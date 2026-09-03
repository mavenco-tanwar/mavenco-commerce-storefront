'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  ArrowLeft,
  Calendar,
  Clock,
  Package,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Pause,
  Play,
  SkipForward,
  XCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { Subscription } from '@/types/subscription-commerce.types';

export default function CustomerSubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const subId = resolvedParams.id;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Cancellation modal & retention
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Too expensive');
  const [showRetentionOffer, setShowRetentionOffer] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/subscriptions/${subId}`);
      const data = await res.json();
      if (data.data) {
        setSubscription(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [subId]);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (!subscription || newQty < 1) return;
    setActionLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/v1/subscriptions/${subscription.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantityChange: { itemId, newQuantity: newQty },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
        setFeedback('Quantity updated successfully.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!subscription) return;
    setActionLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/v1/subscriptions/${subscription.id}/skip`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
        setFeedback('Next delivery has been skipped.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePause = async () => {
    if (!subscription) return;
    setActionLoading(true);
    setFeedback('');
    try {
      const endpoint = subscription.status === 'paused' ? 'resume' : 'pause';
      const res = await fetch(`/api/v1/subscriptions/${subscription.id}/${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
        setFeedback(subscription.status === 'paused' ? 'Subscription resumed.' : 'Subscription paused.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async (immediate: boolean) => {
    if (!subscription) return;
    setActionLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/v1/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: cancelReason,
          cancelImmediately: immediate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
        setIsCancelModalOpen(false);
        setFeedback('Subscription cancellation confirmed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center text-zinc-500 text-sm">
        Loading subscription details...
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-zinc-200 font-bold">Subscription Not Found</h2>
        <Link href="/account/subscriptions" className="text-xs text-amber-400 hover:underline">
          Return to subscriptions
        </Link>
      </div>
    );
  }

  const isPaused = subscription.status === 'paused';
  const isCancelled = subscription.status === 'cancelled' || subscription.status === 'cancel_pending';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/account/subscriptions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">{subscription.subscriptionNumber}</span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  subscription.status === 'active'
                    ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                    : isPaused
                    ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-zinc-100 mt-0.5">{subscription.planName}</h1>
          </div>
        </div>

        {/* Top Actions */}
        {!isCancelled && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              disabled={actionLoading || isPaused}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition disabled:opacity-50"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Delivery</span>
            </button>

            <button
              onClick={handleTogglePause}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition disabled:opacity-50"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-medium transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
          <span>{feedback}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items and Quantity */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#12151B] border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Subscribed Items</span>
            </h3>

            <div className="divide-y divide-zinc-800/80">
              {subscription.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                      {item.productSnapshot.image && (
                        <img
                          src={item.productSnapshot.image}
                          alt={item.productSnapshot.productTitle}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">{item.productSnapshot.productTitle}</div>
                      <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{item.productSnapshot.sku}</div>
                      <div className="text-xs font-bold text-amber-300 mt-1">
                        {item.currency} {(item.recurringPrice / 100).toFixed(2)} / unit
                      </div>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={actionLoading || item.quantity <= 1}
                        className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-zinc-100 px-2">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={actionLoading}
                        className="p-1 text-zinc-400 hover:text-zinc-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-zinc-800 pt-3 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Recurring Subtotal:</span>
                <span className="text-zinc-200">
                  {subscription.currency} {(subscription.pricingSnapshot.subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax:</span>
                <span className="text-zinc-200">
                  {subscription.currency} {(subscription.pricingSnapshot.taxAmount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-zinc-100 text-sm pt-2 border-t border-zinc-800/80">
                <span>Total per Renewal:</span>
                <span className="text-amber-400">
                  {subscription.currency} {(subscription.pricingSnapshot.total / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedules, Shipping, Payment */}
        <div className="space-y-4">
          {/* Schedules */}
          <div className="bg-[#12151B] border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Schedules</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-zinc-900 rounded-lg">
                <span className="text-zinc-500 text-[11px] block">Next Delivery</span>
                <span className="font-semibold text-zinc-200 block mt-0.5">
                  {subscription.nextDeliveryAt ? new Date(subscription.nextDeliveryAt).toLocaleDateString() : '—'}
                </span>
              </div>

              <div className="p-2.5 bg-zinc-900 rounded-lg">
                <span className="text-zinc-500 text-[11px] block">Next Billing Cycle</span>
                <span className="font-semibold text-zinc-200 block mt-0.5">
                  {subscription.nextBillingAt ? new Date(subscription.nextBillingAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#12151B] border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Delivery Address</span>
            </h3>
            <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900 p-3 rounded-lg">
              <div className="font-semibold text-zinc-100">{subscription.shippingAddressSnapshot.fullName}</div>
              <div>{subscription.shippingAddressSnapshot.addressLine1}</div>
              <div>
                {subscription.shippingAddressSnapshot.city}, {subscription.shippingAddressSnapshot.state} {subscription.shippingAddressSnapshot.pincode}
              </div>
              <div className="text-zinc-500 text-[11px] mt-1">{subscription.shippingAddressSnapshot.phone}</div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#12151B] border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Payment Token</span>
            </h3>
            <div className="text-xs text-zinc-300 bg-zinc-900 p-3 rounded-lg flex items-center justify-between">
              <div className="font-mono text-[11px] text-zinc-400">
                {subscription.paymentMethodId || 'Card ending in 4242'}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation & Retention Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14171E] border border-zinc-700/80 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Modify or Cancel Subscription</span>
            </h2>

            {showRetentionOffer ? (
              <div className="space-y-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Special Atelier Retention Offer</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Before you leave, would you like to <strong>pause for 2 months</strong> instead, or enjoy an extra <strong>10% savings</strong> on your upcoming renewal?
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleTogglePause();
                      setIsCancelModalOpen(false);
                    }}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg"
                  >
                    Pause Instead
                  </button>
                  <button
                    onClick={() => setShowRetentionOffer(false)}
                    className="flex-1 py-1.5 bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs rounded-lg"
                  >
                    Proceed to Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Reason for cancellation:</label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 outline-none"
                  >
                    <option value="Too expensive">Too expensive</option>
                    <option value="No longer needed">No longer needed</option>
                    <option value="Temporary pause needed">Temporary pause needed</option>
                    <option value="Switching provider">Switching provider</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={() => handleCancelConfirm(false)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Cancel at Period End
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
