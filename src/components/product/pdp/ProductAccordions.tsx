'use client';

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { NormalizedProduct } from "@/types/pdp-template.types";

export interface ProductAccordionsProps {
  product: NormalizedProduct;
  className?: string;
}

export function ProductAccordions({ product, className = "" }: ProductAccordionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    desc: true,
    spec: true,
    fabric: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasDescription = Boolean(product.description && product.description.trim());
  const hasFeatures = Boolean(product.features && product.features.length > 0);
  const hasCare = Boolean(product.careInstructions && product.careInstructions.length > 0);

  return (
    <div className={`space-y-4 select-none ${className}`}>
      {/* 1. Description */}
      {hasDescription && (
        <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("desc")}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Product Overview &amp; Silhouette</span>
            </span>
            {openSections.desc ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.desc && (
            <div className="px-6 pb-6 text-xs text-slate-700 space-y-4 border-t border-[#EFE8E2] pt-4">
              {/* Render Rich HTML or formatted text from Admin CMS */}
              <div
                className="leading-relaxed prose prose-sm max-w-none text-slate-700 space-y-2.5 [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:text-xs [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:mt-4 [&_h3]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-relaxed [&_strong]:text-slate-900 [&_strong]:font-bold [&_p]:mb-2.5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              {hasFeatures && (
                <ul className="space-y-2 pt-3 border-t border-[#EFE8E2]">
                  {product.features!.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Specifications Matrix */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("spec")}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Garment Specifications</span>
          </span>
          {openSections.spec ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.spec && (
          <div className="px-6 pb-6 text-xs border-t border-[#EFE8E2] pt-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Category</dt>
                <dd className="font-bold text-slate-900 capitalize">
                  {product.categoryName || product.category || "Collection"}
                </dd>
              </div>

              {product.fabric && (
                <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                  <dt className="text-slate-500 font-medium">Fabric Composition</dt>
                  <dd className="font-bold text-slate-900 text-right max-w-[240px] truncate" title={product.fabric}>
                    {product.fabric}
                  </dd>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">SKU Code</dt>
                <dd className="font-mono font-bold text-slate-900">{product.sku}</dd>
              </div>

              {product.brand?.name && (
                <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                  <dt className="text-slate-500 font-medium">Brand</dt>
                  <dd className="font-bold text-slate-900 uppercase">{product.brand.name}</dd>
                </div>
              )}

              {product.origin && (
                <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                  <dt className="text-slate-500 font-medium">Origin / Handcrafting</dt>
                  <dd className="font-bold text-slate-900">{product.origin}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* 3. Care & Maintenance */}
      {hasCare && (
        <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("fabric")}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-sky-500" />
              <span>Fabric Care &amp; Maintenance</span>
            </span>
            {openSections.fabric ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.fabric && (
            <div className="px-6 pb-6 text-xs text-slate-700 space-y-2 border-t border-[#EFE8E2] pt-4">
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                {product.careInstructions!.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
