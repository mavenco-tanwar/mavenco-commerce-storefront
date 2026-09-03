'use client';

import React, { useState } from 'react';
import { UploadCloud, Play, CheckCircle2, AlertCircle } from 'lucide-react';

const SAMPLE_CSV = `SKU,Title,Category,Material,Description
JQT-WMN-DRS-099,Gold Zari Organza Anarkali,dresses,Pure Silk Organza,Handcrafted festive silk organza anarkali with fine zari embroidery.
JQT-WMN-TOP-088,Pleated Linen Peplum Tunic,tops,100% Organic Linen,Minimalist handloom peplum tunic with shell button accents.`;

export default function ImportsAdminPage() {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [content, setContent] = useState(SAMPLE_CSV);
  const [isDryRun, setIsDryRun] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleProcessImport = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/v1/catalog/imports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawContent: content,
          format,
          isDryRun,
          upsertStrategy: 'upsert',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
          <UploadCloud className="w-6 h-6 text-amber-400" />
          <span>Product Import Center</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Asynchronous bulk ingestion supporting CSV and JSON with visual field mapping, dry-run safety, and version creation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#12151B] border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200">Raw Data Input</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFormat('csv')}
                className={`px-2.5 py-1 rounded text-xs ${format === 'csv' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
              >
                CSV
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`px-2.5 py-1 rounded text-xs ${format === 'json' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
              >
                JSON
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 outline-none focus:border-amber-500"
          />

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isDryRun}
                onChange={(e) => setIsDryRun(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-amber-500"
              />
              <span>Dry Run Simulation (Validate only, do not mutate database)</span>
            </label>

            <button
              onClick={handleProcessImport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{loading ? 'Processing...' : isDryRun ? 'Run Simulation' : 'Execute Import'}</span>
            </button>
          </div>
        </div>

        {/* Visual Mapping Overview */}
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Visual Field Mappings</h2>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-zinc-900 rounded flex justify-between">
              <span className="text-zinc-400">SKU</span>
              <span className="font-mono text-amber-300">↳ sku (uppercase)</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded flex justify-between">
              <span className="text-zinc-400">Title</span>
              <span className="font-mono text-amber-300">↳ title (trimmed)</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded flex justify-between">
              <span className="text-zinc-400">Category</span>
              <span className="font-mono text-amber-300">↳ categories[0]</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded flex justify-between">
              <span className="text-zinc-400">Material</span>
              <span className="font-mono text-amber-300">↳ material</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Import Execution Summary ({result.status})</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">Job: {result.id}</span>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-zinc-900 rounded-lg">
              <div className="text-zinc-400 text-xs">Total Rows</div>
              <div className="text-xl font-bold text-zinc-100 mt-1">{result.totalRows}</div>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <div className="text-zinc-400 text-xs">New Products</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{result.newCount}</div>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <div className="text-zinc-400 text-xs">Updated</div>
              <div className="text-xl font-bold text-amber-300 mt-1">{result.updateCount}</div>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <div className="text-zinc-400 text-xs">Errors</div>
              <div className="text-xl font-bold text-rose-400 mt-1">{result.errorCount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
