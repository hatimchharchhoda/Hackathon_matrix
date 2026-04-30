import { motion } from 'framer-motion';
import { Sparkles, RefreshCcw, AlertTriangle, Info } from 'lucide-react';
import { useLatestAgentRun, useRunAgent } from '@/hooks/useAgent';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { SourceBadge } from '@/components/common/SourceBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { AgentRun, Recommendation, ExpansionSignal } from '@/types/agent';

export function MarketAnalysisTab({ accountId, accountName }: { accountId: number; accountName: string }) {
  const { data: run, isLoading } = useLatestAgentRun(accountId, 'market_analysis');
  const runAgent = useRunAgent(accountId);
  const agentRun = run as AgentRun | null;

  const handleRun = () => {
    runAgent.mutate({ run_type: 'market_analysis' });
  };

  const isRunning = runAgent.isPending || agentRun?.status === 'running';
  const output = agentRun?.output_payload;

  if (isLoading) return <div className="animate-pulse h-64 bg-matrix-paleBlue rounded-xl" />;

  if (!agentRun || agentRun.status === 'failed') {
    return (
      <div className="card flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-4">
          <Sparkles size={36} className="text-matrix-cyan" />
        </div>
        <h3 className="text-[18px] font-bold text-matrix-navy mb-2">AI Market Analysis</h3>
        <p className="text-muted text-sm text-center max-w-sm mb-6">
          Run AI Market Analysis to surface expansion signals and product recommendations for {accountName}.
        </p>
        <button onClick={handleRun} disabled={isRunning} className="btn-cyan">
          {isRunning ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing…</>
          ) : (
            <><Sparkles size={15} /> Run Analysis</>
          )}
        </button>
        {agentRun?.status === 'failed' && (
          <p className="text-health-red text-sm mt-3">Previous run failed. Try again.</p>
        )}
      </div>
    );
  }

  if (isRunning || agentRun.status === 'pending') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-matrix-cyan font-medium flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-matrix-cyan border-t-transparent rounded-full animate-spin" />
          IRIS is analysing market signals for {accountName}…
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse border-l-4 border-l-matrix-cyan h-24" />
        ))}
      </div>
    );
  }

  const recs: Recommendation[] = output?.recommendations ?? [];
  const signals: ExpansionSignal[] = output?.expansion_signals ?? [];
  const risks: string[] = output?.risk_flags ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-header">Market Analysis Results</h2>
          {agentRun.completed_at && (
            <p className="text-[12px] text-muted mt-0.5">
              Last run: {formatDateTime(agentRun.completed_at)}{agentRun.run_by_name ? ` by ${agentRun.run_by_name}` : ''}
            </p>
          )}
        </div>
        <button onClick={handleRun} disabled={isRunning} className="btn-ghost text-sm">
          <RefreshCcw size={13} /> Re-run Analysis
        </button>
      </div>

      {output?.account_summary && (
        <div className="card bg-matrix-paleBlue/60 border-matrix-lightBlue">
          <p className="text-sm text-body">{output.account_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Expansion Signals */}
        {signals.length > 0 && (
          <div className="card">
            <h3 className="card-title mb-3">Expansion Signals</h3>
            <div className="space-y-3">
              {signals.map((sig, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-matrix-paleBlue/40 border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-matrix-lightBlue flex items-center justify-center flex-shrink-0">
                    <Info size={12} className="text-matrix-blue" />
                  </div>
                  <div>
                    <p className="text-[13px] text-body">{sig.signal}</p>
                    <p className="text-[11px] text-muted mt-0.5 capitalize">{sig.source} · {sig.relevance} relevance</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="card">
          <h3 className="card-title mb-3">Product Recommendations</h3>
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-border rounded-xl overflow-hidden"
                style={{
                  borderTopWidth: 3,
                  borderTopColor: rec.priority === 'HIGH' ? '#EF4444' : rec.priority === 'MEDIUM' ? '#F5A623' : '#1A6FE8'
                }}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PriorityBadge priority={rec.priority} />
                    <SourceBadge source={rec.source} />
                  </div>
                  <p className="font-bold text-matrix-navy text-[14px]">{rec.product_name}</p>
                  <p className="text-[12px] text-muted mt-1">{rec.reason}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px] text-body">Qty: {rec.suggested_quantity}</span>
                    {rec.unit_price && (
                      <span className="text-[12px] font-semibold text-matrix-blue">{formatCurrency(rec.unit_price)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {recs.length === 0 && <p className="text-muted text-sm">No recommendations generated.</p>}
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      {risks.length > 0 && (
        <div className="card border-health-red/30">
          <h3 className="card-title mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-health-red" /> Risk Flags
          </h3>
          <div className="space-y-2">
            {risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-body">
                <span className="text-health-red mt-0.5">•</span> {risk}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Action */}
      {output?.suggested_next_action && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-matrix-lightBlue border border-matrix-blue/20">
          <Info size={16} className="text-matrix-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-matrix-navy mb-0.5">Suggested Next Action</p>
            <p className="text-[13px] text-body">{output.suggested_next_action}</p>
          </div>
        </div>
      )}
    </div>
  );
}
