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
  RotateCcw,
  Zap,
  FileText,
  DollarSign,
  History,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Subscription } from '@/types/subscription-commerce.types';

export default function AdminSubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const subId = resolvedParams.id;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSubscription = async () => {
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
    fetchSubscription();
  }, [subId]);

  const handleManualAction = async (endpoint: string) => {
    if (!subscription) return;
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/v1/subscriptions/${subscription.id}/${endpoint}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || `Operation '${endpoint}' completed successfully.`);
        fetchSubscription();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Items & Products' },
    { id: 'billing', label: 'Billing & Pricing' },
    { id: 'orders', label: 'Recurring Orders' },
    { id: 'payments', label: 'Payments & Dunning' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'timeline', label: 'Audit Timeline' },
    { id: 'operations', label: 'Manual Operations' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center text-zinc-500 text-sm">
        Loading subscription governance record...
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-zinc-200 font-bold">Subscription Not Found</h2>
        <Link href="/admin/subscriptions" className="text-xs text-amber-400 hover:underline">
          Return to subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/subscriptions"
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
                    : subscription.status === 'paused'
                    ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {subscription.status}
              </span>
              <span className="text-xs text-zinc-500">• {subscription.renewalCount} renewal(s) completed</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mt-0.5">{subscription.customerName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleManualAction('renew')}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Force Renewal Cycle</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
          <span>{message}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Tabs Strip */}
      <div className="border-b border-zinc-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Subscription Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] text-zinc-500 block">Customer Information</span>
                <div className="font-semibold text-zinc-200 mt-1">{subscription.customerName}</div>
                <div className="text-xs text-zinc-400">{subscription.customerEmail}</div>
                <div className="text-xs text-zinc-500 mt-1 font-mono">{subscription.customerId}</div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] text-zinc-500 block">Plan & Frequency</span>
                <div className="font-semibold text-zinc-200 mt-1">{subscription.planName}</div>
                <div className="text-xs text-amber-300 mt-0.5">
                  Every {subscription.billingInterval.count} {subscription.billingInterval.unit}(s)
                </div>
                <div className="text-xs text-zinc-500 mt-1 capitalize">Delivery: {subscription.deliveryInterval.count} {subscription.deliveryInterval.unit}(s)</div>
              </div>

              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] text-zinc-500 block">Next Scheduled Events</span>
                <div className="text-xs text-zinc-300 mt-1 flex justify-between">
                  <span>Billing:</span>
                  <span className="font-semibold text-zinc-100">
                    {subscription.nextBillingAt ? new Date(subscription.nextBillingAt).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 mt-1 flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold text-zinc-100">
                    {subscription.nextDeliveryAt ? new Date(subscription.nextDeliveryAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Subscribed Items Matrix</h3>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Recurring Price</th>
                    <th className="p-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {subscription.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-zinc-100">{item.productSnapshot.productTitle}</td>
                      <td className="p-3 font-mono text-zinc-400">{item.productSnapshot.sku}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3 font-mono text-zinc-300">${(item.recurringPrice / 100).toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-300">
                        ${((item.recurringPrice * item.quantity) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Pricing Snapshot & Currency Lock</h3>
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Recurring Subtotal:</span>
                <span className="text-zinc-200">${(subscription.pricingSnapshot.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Tax (8%):</span>
                <span className="text-zinc-200">${(subscription.pricingSnapshot.taxAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Fee:</span>
                <span className="text-emerald-400 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-100 text-sm pt-2 border-t border-zinc-800">
                <span>Total Amount per Recurrence:</span>
                <span className="text-amber-400">${(subscription.pricingSnapshot.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Generated Recurring Orders</h3>
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-400">
              {subscription.lastOrderId ? (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-zinc-200 font-semibold block">Last Placed Order: {subscription.lastOrderId}</span>
                    <span className="text-[11px] text-zinc-500">Order sequence #{subscription.renewalCount}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    FULFILLED
                  </span>
                </div>
              ) : (
                <p>No historical orders placed under this subscription yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Manual Administrative Controls</h3>
            <p className="text-xs text-zinc-400">
              Operations here are recorded in the immutable audit log and respect idempotent renewal locks.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleManualAction('renew')}
                disabled={actionLoading}
                className="px-4 py-2 bg-amber-500 text-black text-xs font-semibold rounded-lg hover:bg-amber-400 transition"
              >
                Force Renewal & Capture Payment
              </button>

              <button
                onClick={() => handleManualAction('retry-payment')}
                disabled={actionLoading}
                className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg hover:bg-zinc-700 transition"
              >
                Retry Failed Payment
              </button>

              <button
                onClick={() => handleManualAction(subscription.status === 'paused' ? 'resume' : 'pause')}
                disabled={actionLoading}
                className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg hover:bg-zinc-700 transition"
              >
                {subscription.status === 'paused' ? 'Resume Subscription' : 'Pause Subscription'}
              </button>

              <button
                onClick={() => handleManualAction('skip')}
                disabled={actionLoading}
                className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg hover:bg-zinc-700 transition"
              >
                Skip Next Shipment
              </button>
            </div>
          </div>
        )}

        {!['overview', 'products', 'billing', 'orders', 'operations'].includes(activeTab) && (
          <div className="py-16 text-center text-zinc-400 text-xs">
            <p className="font-semibold text-zinc-200 capitalize">{activeTab} Ledger Panel</p>
            <p className="text-zinc-500 mt-1">
              Maintains full audit integrity synchronized with FinancialLedger and InvoiceService.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
