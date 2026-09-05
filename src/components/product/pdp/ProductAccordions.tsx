'use client';

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Shield, Sparkles, Truck, Package, Zap } from "lucide-react";
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
    shipping: false,
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
              {product.description.includes("<") && product.description.includes(">") ? (
                <div
                  className="prose prose-xs max-w-none text-slate-700 leading-relaxed font-sans space-y-2 [&_p]:mb-2 [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
              )}

              {/* Highlight Features Pills */}
              {hasFeatures && (
                <div className="pt-2 border-t border-[#EFE8E2]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                    Key Craft &amp; Design Attributes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features!.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Specifications */}
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
                  <dd className="font-bold text-slate-900 text-right max-w-[65%] sm:max-w-[70%] break-words leading-relaxed" title={product.fabric}>
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

              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Package Weight</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {product.shipping?.weightKg ? `${product.shipping.weightKg} kg` : '0.4 kg'}
                </dd>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#EFE8E2]">
                <dt className="text-slate-500 font-medium">Dispatch Mode</dt>
                <dd className="font-bold text-emerald-600 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {product.shipping?.isExpressAvailable !== false ? 'Express Air Dispatch (24h)' : 'Standard Surface'}
                </dd>
              </div>
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

      {/* 4. Shipping, Delivery & Packaging Guarantees */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5] text-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/2 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-rose-600" />
            <span>Shipping, Packaging &amp; Return Guarantees</span>
          </span>
          {openSections.shipping ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.shipping && (
          <div className="px-6 pb-6 text-xs text-slate-700 space-y-4 border-t border-[#EFE8E2] pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#EFE8E2] space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Package className="w-4 h-4 text-rose-600" />
                  <span>Package Weight &amp; Presentation</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Net package weight is <strong>{product.shipping?.weightKg ? `${product.shipping.weightKg} kg` : '0.4 kg'}</strong>. Each order is individually wrapped in artisanal tissue and enclosed in our signature tamper-proof, weatherproof luxury box.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EFE8E2] space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Dispatch &amp; Delivery Timeline</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.shipping?.isExpressAvailable !== false
                    ? 'Eligible for Priority Express dispatch within 24 business hours.'
                    : 'Dispatches within 48 business hours via standard courier.'}{' '}
                  Estimated doorstep delivery in <strong>2–4 business days</strong> with live SMS &amp; WhatsApp tracking.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 flex items-start gap-3">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-950">Complimentary Shipping &amp; 7-Day Doorstep Exchange</p>
                <p className="text-emerald-800 leading-relaxed">
                  Free express shipping on all orders over ₹999. Enjoy complete peace of mind with our 7-day hassle-free doorstep size/item exchange policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
