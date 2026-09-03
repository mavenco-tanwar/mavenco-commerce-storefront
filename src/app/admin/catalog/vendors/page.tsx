'use client';

import React, { useEffect, useState } from 'react';
import { Truck, ShieldAlert, Lock, Mail, Phone } from 'lucide-react';
import { Vendor } from '@/types/pim-commerce.types';

export default function VendorsAdminPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [canViewCosts, setCanViewCosts] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalog/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.data);
        setCanViewCosts(data.canViewCosts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-amber-400" />
            <span>Vendors & Suppliers</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Supplier directory, manufacturing relationships, and RBAC-governed cost protection.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          {canViewCosts ? (
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Cost Clearance Active
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5" />
              Confidential Cost Protection Active
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Vendor / Supplier</th>
              <th className="p-3">Code</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Currency</th>
              <th className="p-3">Payment Terms</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-zinc-200">{v.name}</td>
                <td className="p-3 font-mono text-zinc-400">{v.code}</td>
                <td className="p-3 text-zinc-400">
                  <div>{v.contactEmail}</div>
                  {v.contactPhone && <div className="text-[11px] text-zinc-500">{v.contactPhone}</div>}
                </td>
                <td className="p-3 font-mono text-zinc-300">{v.currency}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${v.paymentTerms === 'Restricted' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' : 'text-zinc-300'}`}>
                    {v.paymentTerms}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
