"""Zone model."""
import json
from datetime import datetime
from app.extensions import db


class Zone(db.Model):
    __tablename__ = 'zones'

    zone_id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String(100), nullable=False)
    # PostgreSQL ARRAY; SQLite stores as JSON string
    _states = db.Column('states', db.Text, nullable=False, default='[]')
    sales_office = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    users = db.relationship('User', back_populates='zone', lazy='dynamic',
                            foreign_keys='User.zone_id')
    accounts = db.relationship('Account', back_populates='zone', lazy='dynamic')
    si_partners = db.relationship('SIPartner', back_populates='zone', lazy='dynamic')

    @property
    def states(self):
        if isinstance(self._states, list):
            return self._states
        try:
            return json.loads(self._states or '[]')
        except (ValueError, TypeError):
            return []

    @states.setter
    def states(self, value):
        if isinstance(value, list):
            self._states = json.dumps(value)
        else:
            self._states = value or '[]'

    def to_dict(self):
        return {
            'zone_id': self.zone_id,
            'zone_name': self.zone_name,
            'states': self.states,
            'sales_office': self.sales_office,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Zone {self.zone_id}: {self.zone_name}>'
