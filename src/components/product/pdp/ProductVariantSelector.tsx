'use client';

import React from 'react';
import { Check, Ruler } from 'lucide-react';
import { NormalizedProductVariant, VariantOptionDisplayType } from '@/types/pdp-template.types';

export interface ProductVariantSelectorProps {
  colors?: Array<{ name: string; hex?: string; image?: string }>;
  sizes?: Array<{ size: string; inStock: boolean }>;
  variants: NormalizedProductVariant[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onOpenSizeGuide?: () => void;
  colorDisplayType?: VariantOptionDisplayType;
  sizeDisplayType?: VariantOptionDisplayType;
  showSizeGuide?: boolean;
}

export function ProductVariantSelector({
  colors = [],
  sizes = [],
  variants = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onOpenSizeGuide,
  colorDisplayType = 'swatches',
  sizeDisplayType = 'buttons',
  showSizeGuide = true,
}: ProductVariantSelectorProps) {
  // Helper to check if a combination is valid & in stock
  const isCombinationAvailable = (color: string, size: string) => {
    if (!variants || variants.length === 0) return true;
    const match = variants.find(
      (v) =>
        (!color || v.options.color?.toLowerCase() === color.toLowerCase()) &&
        (!size || v.options.size?.toLowerCase() === size.toLowerCase())
    );
    return match ? match.inStock : true;
  };

  return (
    <div className="space-y-5 select-none">
      {/* 1. Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Color:{' '}
              <span className="font-normal text-slate-600 dark:text-slate-400 capitalize">
                {selectedColor || colors[0]?.name}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {colors.map((c) => {
              const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
              const isAvailable = isCombinationAvailable(c.name, selectedSize);

              if (colorDisplayType === 'chips') {
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onColorChange(c.name)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-black shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    } ${!isAvailable ? 'opacity-40 line-through' : ''}`}
                  >
                    {c.name}
                  </button>
                );
              }

              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(c.name)}
                  className={`relative w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-rose-500 scale-110' : 'hover:scale-105 opacity-90'
                  } ${!isAvailable ? 'opacity-30' : ''}`}
                  style={{ backgroundColor: c.hex || '#0A0A0B' }}
                  title={c.name}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-rose-500 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Size:{' '}
              <span className="font-normal text-slate-600 dark:text-slate-400">
                {selectedSize || sizes[0]?.size}
              </span>
            </span>

            {showSizeGuide && onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {sizes.map((s) => {
              const isSelected = selectedSize === s.size;
              const isAvailable = isCombinationAvailable(selectedColor, s.size) && s.inStock;

              return (
                <button
                  key={s.size}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSizeChange(s.size)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center relative ${
                    isSelected
                      ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                      : isAvailable
                      ? 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 bg-white dark:bg-slate-900'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>{s.size}</span>
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-slate-400 rotate-25" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
