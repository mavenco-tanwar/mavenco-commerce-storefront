'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function CompletenessDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/catalog/completeness')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalProductsChecked: 0,
    overallCompletenessPercent: 0,
    contentAverage: 0,
    mediaAverage: 0,
    attributesAverage: 0,
    seoAverage: 0,
    localizationAverage: 0,
    productsBelowThreshold: 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-amber-400" />
          <span>Catalog Completeness Audit</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Detailed dimensional breakdown across Content, Media, Dynamic Attributes, SEO, and Localization.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">Overall</div>
          <div className="text-xl font-bold text-amber-300 mt-1">{summary.overallCompletenessPercent}%</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">Content</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{summary.contentAverage}%</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">Media</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{summary.mediaAverage}%</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">Attributes</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{summary.attributesAverage}%</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">SEO</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{summary.seoAverage}%</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-[11px] text-zinc-400">Localization</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{summary.localizationAverage}%</div>
        </div>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Completeness</th>
              <th className="p-3">Missing Elements</th>
              <th className="p-3 text-right">Enrich</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data?.products?.map((p: any) => (
              <tr key={p.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-zinc-200">{p.title}</td>
                <td className="p-3 capitalize text-zinc-400">{p.category}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${p.completenessScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-zinc-300 font-bold">{p.completenessScore}%</span>
                  </div>
                </td>
                <td className="p-3 text-zinc-400">
                  {p.missingItems?.length > 0 ? (
                    <span className="text-amber-400">{p.missingItems.join(', ')}</span>
                  ) : (
                    <span className="text-emerald-400">100% Fully Enriched</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium"
                  >
                    <span>Enrich</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
