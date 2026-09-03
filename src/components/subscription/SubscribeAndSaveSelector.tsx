'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Truck, Calendar } from 'lucide-react';
import { NormalizedProduct } from '@/types/pdp-template.types';

interface SubscribeAndSaveSelectorProps {
  product: NormalizedProduct;
  selectedVariantPrice?: number;
  onSelectionChange?: (selection: {
    purchaseType: 'one_time' | 'subscription';
    planId?: string;
    billingInterval?: 'day' | 'week' | 'month' | 'year';
    billingIntervalCount?: number;
    recurringPrice?: number;
  }) => void;
}

export default function SubscribeAndSaveSelector({
  product,
  selectedVariantPrice,
  onSelectionChange,
}: SubscribeAndSaveSelectorProps) {
  const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscription'>('one_time');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    product.subscriptionPlans?.[0]?.id || 'sub_plan_monthly_default'
  );

  const basePrice = selectedVariantPrice || product.price || 1499;
  const currency = product.currency || 'USD';
  const plans = product.subscriptionPlans || [];
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const discountPercent = currentPlan?.discountPercent || 15;
  const recurringPrice = Math.round(basePrice * (1 - discountPercent / 100));

  const handleTypeChange = (type: 'one_time' | 'subscription') => {
    setPurchaseType(type);
    if (onSelectionChange) {
      if (type === 'one_time') {
        onSelectionChange({ purchaseType: 'one_time' });
      } else {
        onSelectionChange({
          purchaseType: 'subscription',
          planId: currentPlan?.id,
          billingInterval: currentPlan?.billingInterval,
          billingIntervalCount: currentPlan?.billingIntervalCount,
          recurringPrice,
        });
      }
    }
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (onSelectionChange && purchaseType === 'subscription') {
      const disc = plan?.discountPercent || 15;
      const recPrice = Math.round(basePrice * (1 - disc / 100));
      onSelectionChange({
        purchaseType: 'subscription',
        planId: plan?.id,
        billingInterval: plan?.billingInterval,
        billingIntervalCount: plan?.billingIntervalCount,
        recurringPrice: recPrice,
      });
    }
  };

  if (!product.subscriptionAvailability || plans.length === 0) {
    return null;
  }

  // Calculate estimated next delivery date (e.g. in 1 month)
  const nextDeliveryDate = new Date();
  nextDeliveryDate.setMonth(nextDeliveryDate.getMonth() + (currentPlan?.billingIntervalCount || 1));
  const formattedNextDate = nextDeliveryDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#12151B] p-4 space-y-3.5 my-4">
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Purchase Option</span>
        </span>
        <span className="text-[11px] text-amber-400 font-medium">Save up to 15%</span>
      </div>

      <div className="space-y-2.5">
        {/* Option 1: One-time purchase */}
        <label
          onClick={() => handleTypeChange('one_time')}
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
            purchaseType === 'one_time'
              ? 'border-amber-500/80 bg-amber-500/5'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="radio"
              name="purchase_option"
              checked={purchaseType === 'one_time'}
              onChange={() => handleTypeChange('one_time')}
              className="accent-amber-500 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-zinc-200">One-Time Purchase</div>
              <div className="text-[11px] text-zinc-500">Standard single order</div>
            </div>
          </div>
          <div className="text-xs font-bold text-zinc-100">
            {currency} {basePrice.toLocaleString()}
          </div>
        </label>

        {/* Option 2: Subscribe & Save */}
        <div
          className={`p-3 rounded-lg border transition ${
            purchaseType === 'subscription'
              ? 'border-amber-500/80 bg-amber-500/5'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
          }`}
        >
          <label
            onClick={() => handleTypeChange('subscription')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="purchase_option"
                checked={purchaseType === 'subscription'}
                onChange={() => handleTypeChange('subscription')}
                className="accent-amber-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                  <span>Subscribe & Save</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    Save {discountPercent}%
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">Cancel or pause anytime with 1-click</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-400">
                {currency} {recurringPrice.toLocaleString()}
              </div>
              <div className="text-[10px] line-through text-zinc-500">
                {currency} {basePrice.toLocaleString()}
              </div>
            </div>
          </label>

          {/* Sub-options when Subscribe & Save is selected */}
          {purchaseType === 'subscription' && (
            <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Delivery Frequency:</span>
                <select
                  value={selectedPlanId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 rounded-lg px-2.5 py-1 outline-none cursor-pointer"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.discountPercent}% Off)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded-md">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Next delivery: {formattedNextDate}</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Guaranteed Price Lock</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
