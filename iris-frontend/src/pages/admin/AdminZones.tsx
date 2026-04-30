import { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { useZones, useCreateZone } from '@/hooks/useAdmin';
import { EmptyState } from '@/components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { INDIAN_STATES } from '@/config/constants';
import type { Zone } from '@/types/shared';

export default function AdminZones() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useZones();
  const zones: Zone[] = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Zone Management</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Create Zone
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card animate-pulse h-36" />)}
        </div>
      ) : zones.length === 0 ? (
        <EmptyState title="No zones configured" description="Create zones to assign sales managers and accounts." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {zones.map((zone) => (
            <div key={zone.zone_id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h2 className="card-title">{zone.zone_name}</h2>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:text-matrix-blue rounded"><Edit2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted mb-3">
                {zone.sm_count != null && <span>SM Count: <b className="text-body">{zone.sm_count}</b></span>}
                {zone.accounts_count != null && <span>Accounts: <b className="text-body">{zone.accounts_count}</b></span>}
              </div>
              {zone.states?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">States</p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.states.map((s) => (
                      <span key={s} className="text-[11px] bg-matrix-paleBlue text-matrix-blue px-2 py-0.5 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {zone.sales_office && (
                <p className="text-[12px] text-muted mt-2">Sales Office: <b className="text-body">{zone.sales_office}</b></p>
              )}
              <button className="mt-3 text-[12px] text-matrix-blue hover:underline">
                View Accounts →
              </button>
            </div>
          ))}
        </div>
      )}

      <CreateZoneModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function CreateZoneModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createZone = useCreateZone();
  const { register, handleSubmit, reset } = useForm<{ zone_name: string; sales_office?: string; states: string[] }>();

  const onSubmit = async (data: { zone_name: string; sales_office?: string; states: string[] }) => {
    await createZone.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="card-title">Create Zone</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-matrix-paleBlue"><X size={16} className="text-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Zone Name *</label>
                <input {...register('zone_name', { required: true })} className="input" placeholder="West Zone" />
              </div>
              <div>
                <label className="label">States (hold Ctrl to select multiple)</label>
                <select {...register('states')} multiple className="input h-40">
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Sales Office</label>
                <input {...register('sales_office')} className="input" placeholder="Mumbai" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={createZone.isPending} className="btn-primary">
                  {createZone.isPending ? 'Creating…' : 'Create Zone'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
