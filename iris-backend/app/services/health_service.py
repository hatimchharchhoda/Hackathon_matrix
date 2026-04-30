"""Health score calculation service."""
import json
import logging
from datetime import date, timedelta
from typing import Optional, List, Dict, Any

from app.extensions import db
from app.models.account import Account
from app.models.installed_product import InstalledProduct
from app.models.ticket import Ticket
from app.models.health_score import HealthScoreLog

logger = logging.getLogger(__name__)

# ─── Thresholds ────────────────────────────────────────────────────────────────
OPEN_TICKET_STATES = ('Open', 'In Progress')
DISCONTINUED_GRACE_DAYS = 30


def _is_excluded(ip: InstalledProduct, today: date) -> bool:
    """Return True if this installed product should be excluded from health calc.

    Excluded when:
      license_status = 'Discontinued' AND license_expiry < (today - 30 days)
    """
    if ip.license_status != 'Discontinued':
        return False
    if ip.license_expiry is None:
        return False
    return ip.license_expiry < (today - timedelta(days=DISCONTINUED_GRACE_DAYS))


def calculate_health_breakdown(account_id: int) -> Dict[str, Any]:
    """
    Compute health score for an account without persisting anything.
    Returns a breakdown dict.
    """
    today = date.today()
    account = Account.query.get(account_id)
    if not account:
        raise ValueError(f'Account {account_id} not found')

    installed_products = InstalledProduct.query.filter_by(account_id=account_id).all()
    all_tickets = Ticket.query.filter(
        Ticket.account_id == account_id,
        Ticket.status.in_(OPEN_TICKET_STATES)
    ).all()

    deductions = []
    exclusions = []
    total_deduction = 0

    # Identify excluded products
    active_ips = []
    for ip in installed_products:
        if _is_excluded(ip, today):
            exclusions.append({
                'reason': f'Discontinued license ignored (expired >{DISCONTINUED_GRACE_DAYS} days)',
                'install_id': ip.install_id,
            })
        else:
            active_ips.append(ip)

    # ── Open ticket deductions ──────────────────────────────────────────────
    # Filter tickets belonging to non-excluded installed products
    excluded_install_ids = {ip.install_id for ip in installed_products if _is_excluded(ip, today)}
    active_tickets = [t for t in all_tickets
                      if t.install_id is None or t.install_id not in excluded_install_ids]

    open_count = len(active_tickets)
    ticket_deduction = 0
    if open_count > 0:
        per_ticket = min(open_count, 3) * 8
        ticket_deduction += per_ticket
        if open_count > 3:
            ticket_deduction += 20
        deductions.append({
            'reason': f'{open_count} open ticket{"s" if open_count != 1 else ""}',
            'points': -ticket_deduction,
        })
    total_deduction += ticket_deduction

    # ── License expiry deductions ───────────────────────────────────────────
    license_deduction = 0
    for ip in active_ips:
        if ip.license_expiry is None or ip.license_type in ('Perpetual', 'None', None):
            continue
        days_to_expiry = (ip.license_expiry - today).days
        product_name = ip.product.product_name if ip.product else f'product #{ip.product_id}'
        if days_to_expiry < 0:
            pts = 45
            reason = f'Expired license ({product_name})'
        elif days_to_expiry <= 30:
            pts = 35
            reason = f'License expiring in {days_to_expiry} days ({product_name})'
        elif days_to_expiry <= 90:
            pts = 20
            reason = f'License expiring in {days_to_expiry} days ({product_name})'
        elif days_to_expiry <= 180:
            pts = 10
            reason = f'License expiring in {days_to_expiry} days ({product_name})'
        else:
            continue
        deductions.append({'reason': reason, 'points': -pts})
        license_deduction += pts
    total_deduction += license_deduction

    # ── Hardware/software age deduction ────────────────────────────────────
    age_deducted = False
    for ip in active_ips:
        if age_deducted:
            break
        hardware_old = ip.hardware_age_years and float(ip.hardware_age_years) > 4
        lifespan = ip.product.expected_lifespan_years if ip.product else 5
        software_old = False
        if ip.installation_date and lifespan:
            age_years = (today - ip.installation_date).days / 365.25
            software_old = age_years > lifespan
        if hardware_old or software_old:
            deductions.append({
                'reason': f'Hardware age > 4 years or software outdated '
                          f'({ip.product.product_name if ip.product else ""})',
                'points': -10,
            })
            total_deduction += 10
            age_deducted = True

    # ── Engagement deduction ────────────────────────────────────────────────
    engagement_threshold = today - timedelta(days=180)
    if account.last_visit_date is None or account.last_visit_date < engagement_threshold:
        days_since = (today - account.last_visit_date).days if account.last_visit_date else None
        reason = (f'No visit in {days_since} days' if days_since
                  else 'No visit recorded')
        deductions.append({'reason': reason, 'points': -15})
        total_deduction += 15

    final_score = max(0, 100 - total_deduction)

    # ── Status determination ────────────────────────────────────────────────
    any_expired_active = any(
        ip for ip in active_ips
        if ip.license_expiry and ip.license_expiry < today
        and ip.license_type not in ('Perpetual', 'None', None)
    )
    any_expiring_soon = any(
        ip for ip in active_ips
        if ip.license_expiry
        and 0 <= (ip.license_expiry - today).days < 30
        and ip.license_type not in ('Perpetual', 'None', None)
    )
    if final_score < 40 or open_count > 3 or any_expired_active or any_expiring_soon:
        status = 'Critical'
    elif final_score >= 70:
        status = 'Healthy'
    else:
        status = 'At-Risk'

    return {
        'account_id': account_id,
        'account_name': account.account_name,
        'health_score': final_score,
        'health_status': status,
        'breakdown': {
            'base_score': 100,
            'deductions': deductions,
            'exclusions': exclusions,
        },
        'installed_products': [ip.to_dict(include_product=True) for ip in active_ips],
        'open_tickets': [t.to_dict() for t in active_tickets],
        'last_visit_date': account.last_visit_date.isoformat() if account.last_visit_date else None,
        'recalculated_at': date.today().isoformat(),
    }


def recalculate_account_health(account_id: int, triggered_by: str = 'manual') -> dict:
    """Recalculate health score, persist to DB, and log the change."""
    account = Account.query.get(account_id)
    if not account:
        raise ValueError(f'Account {account_id} not found')

    score_before = account.health_score
    status_before = account.health_status

    breakdown = calculate_health_breakdown(account_id)
    new_score = breakdown['health_score']
    new_status = breakdown['health_status']

    # Persist
    account.health_score = new_score
    account.health_status = new_status

    # Audit log
    log = HealthScoreLog(
        account_id=account_id,
        score_before=score_before,
        score_after=new_score,
        status_before=status_before,
        status_after=new_status,
        triggered_by=triggered_by,
        breakdown=json.dumps(breakdown['breakdown']),
    )
    db.session.add(log)
    db.session.commit()

    logger.info(f'Health recalculated for account {account_id}: '
                f'{score_before} -> {new_score} ({new_status})')
    return breakdown


def recalculate_all(zone_id: Optional[int] = None) -> List[dict]:
    """Batch recalculate health scores for all accounts (optionally filtered by zone)."""
    query = Account.query.filter_by(is_deleted=False)
    if zone_id is not None:
        query = query.filter_by(zone_id=zone_id)
    accounts = query.all()
    results = []
    for account in accounts:
        try:
            result = recalculate_account_health(account.account_id, triggered_by='manual')
            results.append({
                'account_id': account.account_id,
                'account_name': account.account_name,
                'health_score': result['health_score'],
                'health_status': result['health_status'],
                'success': True,
            })
        except Exception as e:
            logger.error(f'Failed to recalculate health for account {account.account_id}: {e}')
            results.append({
                'account_id': account.account_id,
                'success': False,
                'error': str(e),
            })
    return results
