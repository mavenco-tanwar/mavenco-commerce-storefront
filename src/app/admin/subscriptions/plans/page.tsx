'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sliders, Plus, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-commerce.types';

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/subscriptions/plans')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setPlans(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/subscriptions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-amber-400" />
              <span>Subscription Plans & Rules</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure recurring pricing, delivery frequencies, commitment intervals, and customer policies.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-[#12151B] border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 text-sm">{p.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 uppercase">
                {p.status} (v{p.version})
              </span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-2">{p.description}</p>
            <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Billing Interval:</span>
                <span className="text-zinc-200 capitalize">
                  Every {p.currentVersion.billingInterval.count} {p.currentVersion.billingInterval.unit}(s)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Base Recurring Price:</span>
                <span className="font-mono text-amber-300 font-bold">
                  ${(p.currentVersion.recurringPrice / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Introductory Pricing:</span>
                <span className="text-emerald-400">
                  {p.currentVersion.introductoryPricingEnabled ? `$${((p.currentVersion.introductoryPrice || 0) / 100).toFixed(2)}` : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
