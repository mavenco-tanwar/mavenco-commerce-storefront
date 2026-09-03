'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Calendar,
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';
import { Subscription } from '@/types/subscription-commerce.types';

export default function CustomerSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/storefront/v1/subscriptions/customer');
      const data = await res.json();
      if (data.data) {
        setSubscriptions(data.data);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSkip = async (id: string) => {
    setActionLoadingId(id);
    setFeedback('');
    try {
      const res = await fetch(`/api/v1/subscriptions/${id}/skip`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedback('Next delivery has been skipped. Your schedule has updated.');
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePause = async (id: string, currentStatus: string) => {
    setActionLoadingId(id);
    setFeedback('');
    try {
      const endpoint = currentStatus === 'paused' ? 'resume' : 'pause';
      const res = await fetch(`/api/v1/subscriptions/${id}/${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedback(currentStatus === 'paused' ? 'Subscription resumed.' : 'Subscription paused.');
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link href="/account" className="hover:text-amber-400">Account</Link>
            <span>/</span>
            <span className="text-zinc-200">Subscriptions</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-amber-400" />
            <span>Recurring Subscriptions & Memberships</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your auto-deliveries, pause or skip upcoming shipments, and update your preferences.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
          <span>{feedback}</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-sm">
          Loading your active subscriptions...
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl p-8 space-y-3">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-zinc-200 font-semibold text-sm">No Active Subscriptions</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You currently have no recurring deliveries or active memberships. Explore our catalog for Subscribe & Save options.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition"
          >
            <span>Explore Collection</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const firstItem = sub.items[0];
            const isPaused = sub.status === 'paused';

            return (
              <div
                key={sub.id}
                className="bg-[#12151B] border border-zinc-800/90 rounded-2xl p-5 hover:border-zinc-700/80 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                      {firstItem?.productSnapshot.image ? (
                        <img
                          src={firstItem.productSnapshot.image}
                          alt={firstItem.productSnapshot.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-100">
                          {firstItem?.productSnapshot.productTitle || sub.planName}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            sub.status === 'active'
                              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                              : sub.status === 'paused'
                              ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {sub.subscriptionNumber} • {sub.planName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-300">
                      {sub.currency} {(sub.pricingSnapshot.total / 100).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Billed every {sub.billingInterval.count} {sub.billingInterval.unit}(s)
                    </div>
                  </div>
                </div>

                {/* Delivery & Billing Schedule Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Next Delivery</span>
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {sub.nextDeliveryAt ? new Date(sub.nextDeliveryAt).toLocaleDateString() : '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[11px]">Next Billing Date</span>
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {sub.nextBillingAt ? new Date(sub.nextBillingAt).toLocaleDateString() : '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[11px]">Ship to</span>
                    <span className="font-medium text-zinc-300 mt-0.5 truncate block">
                      {sub.shippingAddressSnapshot.city}, {sub.shippingAddressSnapshot.country}
                    </span>
                  </div>
                </div>

                {/* Quick Actions Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSkip(sub.id)}
                      disabled={actionLoadingId === sub.id || isPaused}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 text-xs transition disabled:opacity-50"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      <span>Skip Next Delivery</span>
                    </button>

                    <button
                      onClick={() => handleTogglePause(sub.id, sub.status)}
                      disabled={actionLoadingId === sub.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 text-xs transition disabled:opacity-50"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isPaused ? 'Resume Subscription' : 'Pause'}</span>
                    </button>
                  </div>

                  <Link
                    href={`/account/subscriptions/${sub.id}`}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Manage Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
