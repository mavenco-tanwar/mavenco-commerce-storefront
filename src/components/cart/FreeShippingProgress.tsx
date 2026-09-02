'use client';

import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export interface FreeShippingProgressProps {
  subtotal: number;
  threshold?: number;
  className?: string;
}

export function FreeShippingProgress({
  subtotal,
  threshold = 999,
  className = '',
}: FreeShippingProgressProps) {
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotal);
  const isUnlocked = remaining === 0 && subtotal > 0;

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        isUnlocked
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-[#FAF7F5] border-[#EFE8E2] text-slate-800'
      } ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        <div className="flex items-center gap-1.5">
          {isUnlocked ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-700">
                🎉 Congratulations! You have unlocked Free Express Shipping!
              </span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Add{' '}
                <strong className="text-rose-600 font-mono font-black">
                  ${remaining.toLocaleString()}
                </strong>{' '}
                more for <strong className="text-slate-900">Free Express Delivery</strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-500">
          {percent}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isUnlocked
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
