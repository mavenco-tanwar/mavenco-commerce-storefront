'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export default function QualityDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/catalog/quality')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalProductsChecked: 0,
    averageScore: 100,
    criticalErrorsCount: 0,
    warningsCount: 0,
    healthyProductsCount: 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <span>Product Quality Governance</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Automated rule checks for missing descriptions, empty imagery, SKU integrity, and duplicate content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Average Quality</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.averageScore} / 100</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Healthy Products</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{summary.healthyProductsCount}</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Critical Errors</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{summary.criticalErrorsCount}</div>
        </div>
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Warnings Logged</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{summary.warningsCount}</div>
        </div>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Quality Score</th>
              <th className="p-3">Detected Issues</th>
              <th className="p-3 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data?.products?.map((p: any) => (
              <tr key={p.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-zinc-200">{p.title}</td>
                <td className="p-3 font-mono text-zinc-400">{p.sku}</td>
                <td className="p-3">
                  <span className={`font-bold ${p.score >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {p.score}%
                  </span>
                </td>
                <td className="p-3 text-zinc-400">
                  {p.errors.length > 0 ? (
                    <span className="text-rose-400">{p.errors[0]}</span>
                  ) : p.warnings.length > 0 ? (
                    <span className="text-amber-400">{p.warnings[0]}</span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Clean
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium"
                  >
                    <span>Fix</span>
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
