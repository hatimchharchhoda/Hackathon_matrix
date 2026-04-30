import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { RefreshCcw } from 'lucide-react';
import { useAccountHealth, useAccountHealthHistory, useRecalculateHealth } from '@/hooks/useHealth';
import { HealthRing } from '@/components/common/HealthRing';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { getHealthColor } from '@/lib/healthUtils';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { AccountHealth, HealthHistoryEntry } from '@/types/health';

export function HealthTab({ accountId }: { accountId: number }) {
  const { data: health, isLoading } = useAccountHealth(accountId);
  const { data: history } = useAccountHealthHistory(accountId);
  const recalc = useRecalculateHealth(accountId);

  const h = health as AccountHealth | undefined;
  const hist: HealthHistoryEntry[] = Array.isArray(history) ? history : [];

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-matrix-paleBlue rounded-xl" /><div className="h-60 bg-matrix-paleBlue rounded-xl" /></div>;

  return (
    <div className="space-y-5">
      {/* Score Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h2 className="card-title">Health Score</h2>
          <button
            onClick={() => recalc.mutate()}
            disabled={recalc.isPending}
            className="btn-ghost text-sm"
          >
            <RefreshCcw size={13} className={recalc.isPending ? 'animate-spin' : ''} />
            {recalc.isPending ? 'Recalculating…' : 'Recalculate Now'}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {h && <HealthRing score={h.health_score} size={80} showLabel />}
          {h && <StatusBadge status={h.health_status} />}
          {h?.recalculated_at && (
            <span className="text-[12px] text-muted ml-auto">
              Last calculated: {formatDateTime(h.recalculated_at)}
            </span>
          )}
        </div>

        {/* Breakdown */}
        {h?.breakdown && (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-matrix-paleBlue/40 font-semibold text-[13px] text-matrix-navy border-b border-border">
              <span>Component</span>
              <span>Points</span>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/50 text-sm">
              <span className="text-body">Base Score</span>
              <span className="font-bold text-matrix-navy">+{h.breakdown.base_score}</span>
            </div>
            {h.breakdown.deductions.map((d, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between border-b border-border/50 text-sm">
                <span className="text-body">— {d.reason}{d.product_name ? ` (${d.product_name})` : ''}</span>
                <span className="font-semibold text-health-red">−{d.points}</span>
              </div>
            ))}
            <div className="px-4 py-3 flex items-center justify-between bg-matrix-paleBlue/40 text-[15px]">
              <span className="font-bold text-matrix-navy">Final Score</span>
              <span className="font-bold" style={{ color: getHealthColor(h.health_score) }}>
                {h.health_score}
              </span>
            </div>
            {h.breakdown.exclusions.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <p className="text-[11px] font-bold text-muted uppercase mb-2">Excluded Items</p>
                {h.breakdown.exclusions.map((e, i) => (
                  <p key={i} className="text-[12px] text-muted italic">• {e.reason}{e.product_name ? ` — ${e.product_name}` : ''}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Chart */}
      <div className="card">
        <h2 className="card-title mb-4">Health Score History</h2>
        {hist.length < 2 ? (
          <EmptyState
            title="No history yet"
            description="Recalculate to start tracking health score over time."
          />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hist.map((h) => ({ ...h, date: formatDate(h.calculated_at) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF5FD" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #C5D8EF', fontSize: 12 }}
                formatter={(val: number) => [val, 'Health Score']}
              />
              <Line
                type="monotone"
                dataKey="health_score"
                stroke="#1A6FE8"
                strokeWidth={2}
                dot={(props) => {
                  const color = getHealthColor(props.payload.health_score);
                  return <Dot key={props.key} {...props} fill={color} stroke={color} r={4} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
