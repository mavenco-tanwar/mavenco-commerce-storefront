'use client';

import React from 'react';
import { Truck, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ShippingStepProps {
  selectedSpeed: 'standard' | 'express';
  onChange: (speed: 'standard' | 'express') => void;
  onNext: () => void;
  onBack: () => void;
  isFreeShippingEligible: boolean;
}

export function ShippingStep({
  selectedSpeed,
  onChange,
  onNext,
  onBack,
  isFreeShippingEligible,
}: ShippingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {/* Standard Delivery Card */}
        <label
          className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
            selectedSpeed === 'standard'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC] hover:bg-[#F8F1EA]'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="shippingSpeed"
              checked={selectedSpeed === 'standard'}
              onChange={() => onChange('standard')}
              className="mt-1 text-[#B77A68] focus:ring-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B77A68]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Standard Doorstep Delivery
                </span>
              </div>
              <p className="text-xs text-[#777777] mt-1 font-sans">
                Dispatched via Delhivery / BlueDart Surface. Estimated in 2-4 business days.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#111111]">
              {isFreeShippingEligible ? (
                <strong className="text-[#B77A68] uppercase font-bold">FREE</strong>
              ) : (
                '₹99'
              )}
            </span>
          </div>
        </label>

        {/* Express Next-Day Card */}
        <label
          className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
            selectedSpeed === 'express'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC] hover:bg-[#F8F1EA]'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="shippingSpeed"
              checked={selectedSpeed === 'express'}
              onChange={() => onChange('express')}
              className="mt-1 text-[#B77A68] focus:ring-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B77A68]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Express Priority Air Delivery
                </span>
              </div>
              <p className="text-xs text-[#777777] mt-1 font-sans">
                Priority studio processing with Air courier dispatch. Estimated in 1-2 business days.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#111111]">₹99</span>
          </div>
        </label>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onBack}
        >
          &larr; Back
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onNext}
        >
          Continue to Payment &rarr;
        </Button>
      </div>
    </div>
  );
}
