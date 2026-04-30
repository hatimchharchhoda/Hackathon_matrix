import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRunProspectAnalysis } from '@/hooks/useAgent';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { SourceBadge } from '@/components/common/SourceBadge';
import { formatCurrency } from '@/lib/utils';
import { INDIAN_STATES, INDUSTRIES } from '@/config/constants';
import type { Recommendation, AgentOutput } from '@/types/agent';

const schema = z.object({
  company_name: z.string().min(1, 'Required'),
  industry: z.string().min(1, 'Required'),
  sub_industry: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  headcount: z.string().optional(),
  site_size: z.string().optional(),
  news_snippet: z.string().min(10, 'Please provide some context'),
  existing_system: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProspectNew() {
  const [result, setResult] = useState<AgentOutput | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const runAnalysis = useRunProspectAnalysis();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await runAnalysis.mutateAsync(data as unknown as Record<string, unknown>);
    setResult(res as AgentOutput);
  };

  const recs: Recommendation[] = result?.recommendations ?? [];
  const toggleProduct = (name: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <h1 className="page-title">Prospect Mode</h1>
      <p className="text-sm text-muted">Analyse a prospect and generate AI-powered product recommendations.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_30%_35%] gap-5 items-start">
        {/* Panel 1: Input */}
        <div className="card">
          <h2 className="card-title mb-4">Prospect Details</h2>
          <form id="prospect-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Company Name *</label>
              <input {...register('company_name')} className="input" placeholder="ABC Logistics Pvt Ltd" />
              {errors.company_name && <p className="text-[12px] text-health-red mt-1">{errors.company_name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Industry *</label>
                <select {...register('industry')} className="input">
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                {errors.industry && <p className="text-[12px] text-health-red mt-1">{errors.industry.message}</p>}
              </div>
              <div>
                <label className="label">Sub-industry</label>
                <input {...register('sub_industry')} className="input" placeholder="Warehouse" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">City *</label>
                <input {...register('city')} className="input" placeholder="Pune" />
                {errors.city && <p className="text-[12px] text-health-red mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label">State *</label>
                <select {...register('state')} className="input">
                  <option value="">Select…</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-[12px] text-health-red mt-1">{errors.state.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Headcount</label>
                <select {...register('headcount')} className="input">
                  <option value="">&lt;50</option>
                  <option>50–200</option>
                  <option>200–1000</option>
                  <option>1000+</option>
                </select>
              </div>
              <div>
                <label className="label">Site Size</label>
                <select {...register('site_size')} className="input">
                  <option>Single Site</option>
                  <option>Multi-Site</option>
                  <option>Campus</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">News / Requirement Snippet *</label>
              <textarea
                {...register('news_snippet')}
                rows={4}
                className="input resize-none"
                placeholder="Paste any news, tender notice, or requirement text…"
              />
              {errors.news_snippet && <p className="text-[12px] text-health-red mt-1">{errors.news_snippet.message}</p>}
            </div>
            <div>
              <label className="label">Known Existing System</label>
              <input {...register('existing_system')} className="input" placeholder="Hikvision DVR, Punch card T&A" />
            </div>
            <div>
              <label className="label">Additional Notes</label>
              <textarea {...register('notes')} rows={2} className="input resize-none" />
            </div>
            <button
              form="prospect-form"
              type="submit"
              disabled={runAnalysis.isPending}
              className="btn-cyan w-full justify-center"
            >
              {runAnalysis.isPending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing…</>
              ) : (
                <><Sparkles size={15} /> Analyze with AI</>
              )}
            </button>
          </form>
        </div>

        {/* Panel 2: Keyword Analysis */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h2 className="card-title mb-4">Detected Signals</h2>
              {result.expansion_signals && result.expansion_signals.length > 0 && (
                <div className="space-y-3 mb-4">
                  {result.expansion_signals.map((sig, i) => (
                    <div key={i} className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-[13px]">
                      <p className="text-body">{sig.signal}</p>
                      <p className="text-[11px] text-muted mt-1 capitalize">{sig.source}</p>
                    </div>
                  ))}
                </div>
              )}
              {result.suggested_next_action && (
                <div className="p-3 rounded-lg bg-matrix-lightBlue border border-matrix-blue/20 text-[13px] text-body">
                  <p className="font-bold text-matrix-navy mb-1">Suggested Action</p>
                  {result.suggested_next_action}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel 3: Recommendations */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="card-title mb-4">Product Recommendations</h2>
              <div className="space-y-3">
                {recs.map((rec, i) => (
                  <div
                    key={i}
                    className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${selectedProducts.has(rec.product_name) ? 'border-matrix-blue bg-matrix-paleBlue/40' : 'border-border'}`}
                    onClick={() => toggleProduct(rec.product_name)}
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: rec.priority === 'HIGH' ? '#EF4444' : rec.priority === 'MEDIUM' ? '#F5A623' : '#1A6FE8'
                    }}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={rec.priority} />
                          <SourceBadge source={rec.source} />
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(rec.product_name)}
                          readOnly
                          className="accent-matrix-blue w-4 h-4"
                        />
                      </div>
                      <p className="font-bold text-matrix-navy text-[13px]">{rec.product_name}</p>
                      <p className="text-[12px] text-muted mt-1">{rec.reason}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[12px]">Qty: {rec.suggested_quantity}</span>
                        {rec.unit_price && <span className="text-[12px] font-semibold text-matrix-blue">{formatCurrency(rec.unit_price)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProducts.size > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-3">{selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected</p>
                  <button className="btn-primary w-full justify-center">
                    Generate Proposal <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
