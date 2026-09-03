'use client';

import React, { useState } from 'react';
import { DownloadCloud, FileText } from 'lucide-react';

export default function ExportsAdminPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (format: 'csv' | 'json') => {
    window.open(`/api/v1/catalog/exports?format=${format}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
          <DownloadCloud className="w-6 h-6 text-amber-400" />
          <span>Product Export Center</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Export catalog datasets with full metadata, attributes, variants, and completeness ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-200 text-sm">Full Catalog CSV Export</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Compatible with spreadsheet tools and legacy ERP systems.</p>
            </div>
          </div>
          <button
            onClick={() => handleDownload('csv')}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold transition"
          >
            Download CSV Export
          </button>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-200 text-sm">Rich JSON Catalog Export</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Complete JSON tree with nested variants, attributes, and media.</p>
            </div>
          </div>
          <button
            onClick={() => handleDownload('json')}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-500/20"
          >
            Download JSON Tree
          </button>
        </div>
      </div>
    </div>
  );
}
