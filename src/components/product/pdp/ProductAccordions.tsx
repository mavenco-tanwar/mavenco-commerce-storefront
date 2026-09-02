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
    <div className={`space-y-4 select-none ${className}`}>
      {/* 1. Description */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('desc')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Product Overview &amp; Silhouette</span>
          </span>
          {openSections.desc ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSections.desc && (
          <div className="px-6 pb-6 text-xs text-slate-600 space-y-3 border-t border-[#EFE8E2] pt-4">
            <p className="leading-relaxed">{product.description}</p>
            {product.features && product.features.length > 0 && (
              <ul className="space-y-2 pt-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
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
      <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('spec')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Garment Specifications</span>
          </span>
          {openSections.spec ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSections.spec && (
          <div className="px-6 pb-6 text-xs border-t border-[#EFE8E2] pt-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Category</dt>
                <dd className="font-bold text-slate-900">{product.categoryName || product.category || 'Atelier Wear'}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Fabric Composition</dt>
                <dd className="font-bold text-slate-900">{product.fabric || 'Pure Georgette & Soft Crepe'}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">SKU Code</dt>
                <dd className="font-mono font-bold text-slate-900">{product.sku}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Origin / Handcrafting</dt>
                <dd className="font-bold text-slate-900">{product.origin || 'Handcrafted in India'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 3. Care & Maintenance */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('fabric')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-sky-500" />
            <span>Fabric Care &amp; Maintenance</span>
          </span>
          {openSections.fabric ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSections.fabric && (
          <div className="px-6 pb-6 text-xs text-slate-600 space-y-2 border-t border-[#EFE8E2] pt-4">
            {product.careInstructions && product.careInstructions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1.5">
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
