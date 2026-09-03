'use client';

import React, { useEffect, useState } from 'react';
import { Network, Plus, ArrowRight } from 'lucide-react';

export default function RelationshipsAdminPage() {
  const [relations, setRelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/catalog/relationships')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRelations(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Network className="w-6 h-6 text-amber-400" />
            <span>Product Relationships Graph</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Governs cross-sells, upsells, accessories, replacement parts, and AI-suggested pairings.
          </p>
        </div>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Source Product</th>
              <th className="p-3">Relationship Type</th>
              <th className="p-3">Target Product</th>
              <th className="p-3">Origin</th>
              <th className="p-3">Relevance Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {relations.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-mono font-semibold text-zinc-200">{r.sourceProductId}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-zinc-800 text-amber-300 border border-zinc-700">
                    {r.type}
                  </span>
                </td>
                <td className="p-3 font-mono text-zinc-300">{r.targetProductId}</td>
                <td className="p-3 text-zinc-400 capitalize">{r.sourceType}</td>
                <td className="p-3 font-mono text-emerald-400 font-semibold">{Math.round((r.score || 1) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
