'use client';

import React, { useEffect, useState } from 'react';
import { Boxes, Plus, Package } from 'lucide-react';

export default function BundlesAdminPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/catalog/bundles')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBundles(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-amber-400" />
            <span>Bundles, Kits & Composites</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated ensembles, warehouse operational kits, and dynamic component bundles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map((b) => (
          <div key={b.id} className="bg-[#12151B] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-100 text-sm">Bridal Atelier Ensemble</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 ml-2">
                  {b.bundleType} ({b.discountPercentage}% off)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {b.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <span className="text-xs text-zinc-400 font-medium">Included Components:</span>
              {b.components?.map((c: any) => (
                <div key={c.id} className="p-2.5 bg-zinc-900 rounded-lg text-xs flex items-center justify-between">
                  <span className="text-zinc-200 font-medium">{c.productName}</span>
                  <span className="font-mono text-zinc-400">Qty: {c.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
