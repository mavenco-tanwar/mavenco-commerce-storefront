'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { MembershipPlan } from '@/types/subscription-commerce.types';

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/subscriptions/memberships')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setMemberships(d.data);
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
              <Award className="w-6 h-6 text-amber-400" />
              <span>Membership Tiers & Perks</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure paid and free membership levels, loyalty multipliers, free shipping, and member-exclusive discounts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberships.map((m) => (
          <div key={m.id} className="bg-[#12151B] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-100 text-sm block">{m.name}</span>
                <span className="font-mono text-amber-300 text-xs mt-0.5">
                  ${(m.price / 100).toFixed(2)} / {m.billingInterval.unit}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 uppercase">
                {m.tier}
              </span>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2">{m.description}</p>

            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-300 block">Configured Perks:</span>
              <div className="space-y-1.5 text-xs text-zinc-400">
                {m.benefits.map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{b.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
