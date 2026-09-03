'use client';

import React, { useEffect, useState } from 'react';
import { Globe2, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { ProductPublication } from '@/types/pim-commerce.types';

export default function PublishingMatrixPage() {
  const [publications, setPublications] = useState<ProductPublication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalog/publications');
      const data = await res.json();
      if (data.success) setPublications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-amber-400" />
            <span>Multi-Market & Multi-Channel Publishing Matrix</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Independent publication governance: Products can be published in India, unpublished in the US, and scheduled in the UK without record duplication.
          </p>
        </div>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Product ID</th>
              <th className="p-3">Market</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Catalog</th>
              <th className="p-3">Status</th>
              <th className="p-3">Published At</th>
              <th className="p-3">Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {publications.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-mono font-semibold text-zinc-200">{p.productId}</td>
                <td className="p-3 font-mono text-amber-300">{p.marketId}</td>
                <td className="p-3 capitalize">{p.channelId}</td>
                <td className="p-3 font-mono text-zinc-400">{p.catalogId}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${
                      p.status === 'published'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-zinc-400">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="p-3 font-mono text-zinc-500">v{p.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
