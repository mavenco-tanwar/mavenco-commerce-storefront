'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';
import { Subscription, SubscriptionAnalyticsMetrics } from '@/types/subscription-commerce.types';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter !== 'all') q.set('status', statusFilter);

      const [subRes, anaRes] = await Promise.all([
        fetch(`/api/v1/subscriptions?${q.toString()}`),
        fetch('/api/v1/subscriptions/analytics'),
      ]);

      const subData = await subRes.json();
      const anaData = await anaRes.json();

      if (subData.data) setSubscriptions(subData.data);
      if (anaData.data) setAnalytics(anaData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-amber-400" />
            <span>Recurring Commerce & Subscriptions</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Authoritative management of recurring orders, subscribe & save customers, memberships, and automated renewals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/subscriptions/plans"
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition"
          >
            Manage Plans
          </Link>
          <Link
            href="/admin/subscriptions/memberships"
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition"
          >
            Membership Tiers
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400">Monthly Recurring Revenue</div>
            <div className="text-xl font-bold text-amber-300 mt-1">
              ${(analytics.mrrMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>ARR: ${(analytics.arrMinor / 100).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400">Active Subscribers</div>
            <div className="text-xl font-bold text-zinc-100 mt-1">{analytics.activeSubscribers}</div>
            <div className="text-[10px] text-zinc-500 mt-1">Lifetime Avg: {analytics.averageLifetimeDays} days</div>
          </div>

          <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400">Renewal Success</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{analytics.renewalSuccessRatePercent}%</div>
            <div className="text-[10px] text-zinc-500 mt-1">Auto-collected</div>
          </div>

          <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400">Dunning Recovery</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{analytics.recoveryRatePercent}%</div>
            <div className="text-[10px] text-zinc-500 mt-1">Failed charges salvaged</div>
          </div>

          <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400">Monthly Churn</div>
            <div className="text-xl font-bold text-zinc-200 mt-1">{analytics.churnRatePercent}%</div>
            <div className="text-[10px] text-zinc-500 mt-1">Below industry benchmark</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12151B] border border-zinc-800/80 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer, sub #, plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none cursor-pointer"
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due (Dunning)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Subscription #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Billing</th>
              <th className="p-3">Next Delivery</th>
              <th className="p-3">Recurring Total</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  Loading subscriptions...
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  No subscription records found.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-mono font-bold text-zinc-200">
                    <Link href={`/admin/subscriptions/${sub.id}`} className="hover:text-amber-400">
                      {sub.subscriptionNumber}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-zinc-100">{sub.customerName}</div>
                    <div className="text-[11px] text-zinc-500">{sub.customerEmail}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-zinc-200">{sub.planName}</div>
                    <div className="text-[10px] text-zinc-500 capitalize">
                      Every {sub.billingInterval.count} {sub.billingInterval.unit}(s)
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        sub.status === 'active'
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : sub.status === 'paused'
                          ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                          : sub.status === 'trialing'
                          ? 'bg-blue-950/60 border-blue-500/30 text-blue-400'
                          : sub.status === 'past_due'
                          ? 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">
                    {sub.nextBillingAt ? new Date(sub.nextBillingAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {sub.nextDeliveryAt ? new Date(sub.nextDeliveryAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-300">
                    {sub.currency} {(sub.pricingSnapshot.total / 100).toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/subscriptions/${sub.id}`}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
