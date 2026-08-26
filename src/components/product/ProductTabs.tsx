'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/types/product';

export function ProductTabs({ product }: { product: Product }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    fabric: false,
    shipping: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="border-t border-[#E8DED8] divide-y divide-[#E8DED8] mt-8 select-none">
      {/* 1. Details & Features */}
      <div className="py-4">
        <button
          onClick={() => toggleSection('details')}
          className="w-full flex items-center justify-between text-left font-serif font-bold text-base text-[#111111]"
        >
          <span>Product Details &amp; Design Notes</span>
          <ChevronDown
            className={`w-4 h-4 text-[#B77A68] transition-transform duration-200 ${
              openSections['details'] ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections['details'] && (
          <div className="pt-3 pb-2 text-xs text-[#777777] font-sans leading-relaxed space-y-3 animate-in fade-in duration-200">
            <p>{product.description}</p>
            {product.features && product.features.length > 0 && (
              <ul className="list-disc pl-4 space-y-1 text-[#111111]">
                {product.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            )}
            {product.modelInfo && (
              <p className="text-[11px] bg-[#FAF6F2] p-2 border border-[#E8DED8] text-[#111111] italic">
                {product.modelInfo}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. Fabric & Care */}
      <div className="py-4">
        <button
          onClick={() => toggleSection('fabric')}
          className="w-full flex items-center justify-between text-left font-serif font-bold text-base text-[#111111]"
        >
          <span>Fabric, Material &amp; Care</span>
          <ChevronDown
            className={`w-4 h-4 text-[#B77A68] transition-transform duration-200 ${
              openSections['fabric'] ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections['fabric'] && (
          <div className="pt-3 pb-2 text-xs text-[#777777] font-sans leading-relaxed space-y-2 animate-in fade-in duration-200">
            <p>
              <strong className="text-[#111111]">Material:</strong> {product.fabric}
            </p>
            {product.careInstructions && (
              <div>
                <strong className="text-[#111111] block mb-1">Care Guidelines:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {product.careInstructions.map((care, idx) => (
                    <li key={idx}>{care}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Shipping & Returns */}
      <div className="py-4">
        <button
          onClick={() => toggleSection('shipping')}
          className="w-full flex items-center justify-between text-left font-serif font-bold text-base text-[#111111]"
        >
          <span>Shipping, Easy Returns &amp; Exchanges</span>
          <ChevronDown
            className={`w-4 h-4 text-[#B77A68] transition-transform duration-200 ${
              openSections['shipping'] ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections['shipping'] && (
          <div className="pt-3 pb-2 text-xs text-[#777777] font-sans leading-relaxed space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#B77A68] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block">Express Delivery:</strong>
                <span>Dispatched within 24-48 hours. Free delivery on orders above ₹999 across all Indian PIN codes.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-[#B77A68] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block">7-Day Doorstep Returns:</strong>
                <span>Hassle-free reverse pickups with instant refunds to original payment method or store credit.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B77A68] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block">Quality Promise:</strong>
                <span>100% authentic designer fashion hand-checked by our studio team prior to dispatch.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
