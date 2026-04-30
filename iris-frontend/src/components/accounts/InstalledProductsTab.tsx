import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAccountProducts } from '@/hooks/useAccounts';
import { ProductChip } from '@/components/common/ProductChip';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { formatDate, expiryColor } from '@/lib/utils';
import type { InstalledProduct } from '@/types/product';

const licenseStatusColors: Record<string, string> = {
  Active: 'text-health-green',
  'Expiring Soon': 'text-health-amber',
  Expired: 'text-health-red',
  Discontinued: 'text-muted line-through',
};

export function InstalledProductsTab({ accountId }: { accountId: number }) {
  const { data, isLoading } = useAccountProducts(accountId);
  const products: InstalledProduct[] = Array.isArray(data) ? data : (data as { data?: InstalledProduct[] })?.data ?? [];

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="card-title">Installed Products</h2>
        <button className="btn-primary text-sm"><Plus size={14} /> Add Product</button>
      </div>
      {isLoading ? (
        <TableSkeleton cols={7} rows={5} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products installed"
          description="Add the first product to start tracking versions, expiry and health."
          action={<button className="btn-primary text-sm"><Plus size={13} />Add Product</button>}
          className="py-12"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-matrix-paleBlue/60">
              <tr className="text-[11px] text-muted font-bold uppercase tracking-wide">
                {['Product', 'Domain', 'Qty', 'Version', 'Install Date', 'License Expiry', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.install_id} className={`border-b border-border/50 ${i % 2 === 1 ? 'bg-matrix-paleBlue/20' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-matrix-navy text-[13px]">{p.product_name}</td>
                  <td className="px-4 py-3"><ProductChip domain={p.domain} label={p.domain} /></td>
                  <td className="px-4 py-3 text-body">{p.quantity}</td>
                  <td className="px-4 py-3 text-body font-mono text-[12px]">{p.installed_version ?? '—'}</td>
                  <td className="px-4 py-3 text-body">{formatDate(p.installation_date)}</td>
                  <td className={`px-4 py-3 text-[13px] ${expiryColor(p.license_expiry)}`}>{formatDate(p.license_expiry)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-semibold ${licenseStatusColors[p.license_status] ?? 'text-body'}`}>
                      {p.license_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:text-matrix-blue"><Edit2 size={13} /></button>
                      <button className="p-1 hover:text-health-red"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
