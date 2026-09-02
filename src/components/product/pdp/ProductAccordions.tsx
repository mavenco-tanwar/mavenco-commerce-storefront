'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { NormalizedProduct } from '@/types/pdp-template.types';

export interface ProductAccordionsProps {
  product: NormalizedProduct;
  className?: string;
}

export function ProductAccordions({ product, className = '' }: ProductAccordionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    desc: true,
    spec: false,
    fabric: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`space-y-3 select-none ${className}`}>
      {/* 1. Description */}
      <div className="rounded-2xl border border-[#E8DED8] dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('desc')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Product Overview &amp; Silhouette</span>
          </span>
          {openSections.desc ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.desc && (
          <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 space-y-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <p className="leading-relaxed">{product.description}</p>
            {product.features && product.features.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 2. Specifications Matrix */}
      <div className="rounded-2xl border border-[#E8DED8] dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('spec')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Garment Specifications</span>
          </span>
          {openSections.spec ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.spec && (
          <div className="px-5 pb-5 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-400">Category</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{product.categoryName || product.category || 'Atelier Wear'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-400">Fabric Composition</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{product.fabric || 'Pure Georgette & Soft Crepe'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-400">SKU Code</dt>
                <dd className="font-mono font-bold text-slate-900 dark:text-white">{product.sku}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-400">Origin / Handcrafting</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{product.origin || 'India'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 3. Care & Artisan Provenance */}
      <div className="rounded-2xl border border-[#E8DED8] dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('fabric')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-500" />
            <span>Fabric Care &amp; Maintenance</span>
          </span>
          {openSections.fabric ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.fabric && (
          <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            {product.careInstructions && product.careInstructions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {product.careInstructions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p>Dry clean only or gentle hand wash with cold water. Store in breathable garment bag away from direct sunlight.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
