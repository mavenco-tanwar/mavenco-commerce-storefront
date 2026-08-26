import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface FreeShippingBarProps {
  subtotal: number;
  threshold: number;
}

export function FreeShippingBar({ subtotal, threshold }: FreeShippingBarProps) {
  const isUnlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-[#FAF6F2] border border-[#E8DED8] p-3 mb-4 select-none">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
        {isUnlocked ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#B77A68] shrink-0" />
            <span className="text-[#111111] font-bold">
              🎉 Congratulations! You have unlocked <span className="text-[#B77A68]">FREE SHIPPING</span>!
            </span>
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 text-[#B77A68] shrink-0" />
            <span className="text-[#111111]">
              Add <strong className="text-[#B77A68]">{formatCurrency(remaining)}</strong> more to get{' '}
              <strong className="underline underline-offset-2">FREE SHIPPING</strong>
            </span>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#E8DED8] overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-[#CF9584] to-[#B77A68] transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
