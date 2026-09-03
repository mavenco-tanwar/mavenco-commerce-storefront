'use client';

import React, { useEffect, useState } from 'react';
import { Award, Plus, Globe } from 'lucide-react';
import { Brand } from '@/types/pim-commerce.types';

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalog/brands');
      const data = await res.json();
      if (data.success) setBrands(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Brand Management</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Authoritative brands, logos, origin countries, and localized brand identities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div key={b.id} className="bg-[#12151B] border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 text-sm">{b.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {b.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-2">{b.description}</p>
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span>Origin: <strong className="text-zinc-300">{b.country}</strong></span>
              <span className="font-mono text-[11px] text-amber-400">/{b.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
