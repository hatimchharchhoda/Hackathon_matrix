import { useState } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser } from '@/hooks/useAdmin';
import { useZones } from '@/hooks/useAdmin';
import { formatDate, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/types/user';

const schema = z.object({
  username: z.string().min(3, 'Min 3 chars'),
  email: z.string().email('Invalid email'),
  full_name: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Min 6 chars'),
  role: z.enum(['matrix_manager', 'Sales_manager']),
  zone_id: z.number().optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  is_active: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

export default function AdminUsers() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useUsers();
  const { data: zones } = useZones();
  const users: User[] = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">User Management</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Create User
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <TableSkeleton cols={7} rows={8} />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-matrix-paleBlue/60">
                <tr className="text-[11px] text-muted font-bold uppercase tracking-wide">
                  {['Name', 'Email', 'Role', 'Zone', 'Designation', 'Status', 'Last Login', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.user_id} className={cn('border-b border-border/50', i % 2 === 1 && 'bg-matrix-paleBlue/20')}>
                    <td className="px-4 py-3 font-semibold text-matrix-navy">{user.full_name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] font-bold uppercase px-2 py-0.5 rounded-full',
                        user.role === 'matrix_manager' ? 'bg-[#EDE9FE] text-[#4C1D95]' : 'bg-matrix-lightBlue text-matrix-blue'
                      )}>
                        {user.role === 'matrix_manager' ? 'Matrix Mgr' : 'Sales Mgr'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-body">{user.zone_name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted">{user.designation ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] font-bold uppercase px-2 py-0.5 rounded-full',
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted text-[12px]">{user.last_login ? formatDateTime(user.last_login) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:text-matrix-blue rounded"><Edit2 size={13} /></button>
                        <button className="p-1.5 hover:text-matrix-cyan rounded" title="Reset Password"><Key size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateUserModal open={modalOpen} onClose={() => setModalOpen(false)} zones={zones as { zone_id: number; zone_name: string }[] ?? []} />
    </div>
  );
}

function CreateUserModal({ open, onClose, zones }: { open: boolean; onClose: () => void; zones: { zone_id: number; zone_name: string }[] }) {
  const createUser = useCreateUser();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Sales_manager', is_active: true },
  });
  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    await createUser.mutateAsync(data);
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
              <h2 className="card-title">Create User</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-matrix-paleBlue"><X size={16} className="text-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { label: 'Full Name *', field: 'full_name', placeholder: 'Rajesh Kumar' },
                { label: 'Email *', field: 'email', placeholder: 'rajesh@matrix.com', type: 'email' },
                { label: 'Username *', field: 'username', placeholder: 'rajeshk' },
                { label: 'Password *', field: 'password', placeholder: '••••••••', type: 'password' },
              ].map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label className="label">{label}</label>
                  <input {...register(field as keyof FormData)} type={type} placeholder={placeholder} className="input" />
                  {errors[field as keyof FormData] && (
                    <p className="text-[12px] text-health-red mt-1">{errors[field as keyof FormData]?.message as string}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="label">Role *</label>
                <select {...register('role')} className="input">
                  <option value="Sales_manager">Sales Manager</option>
                  <option value="matrix_manager">Matrix Manager</option>
                </select>
              </div>
              {role === 'Sales_manager' && (
                <div>
                  <label className="label">Zone</label>
                  <select {...register('zone_id', { setValueAs: (v) => v ? Number(v) : undefined })} className="input">
                    <option value="">Select zone…</option>
                    {zones.map((z) => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="label">Designation</label>
                <input {...register('designation')} className="input" placeholder="Territory Manager" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={createUser.isPending} className="btn-primary">
                  {createUser.isPending ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
