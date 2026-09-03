'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Layout,
  Store,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Power,
  ExternalLink,
  Users,
  Settings,
} from 'lucide-react';

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = (params?.id as string) || '';

  const [tenant, setTenant] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'storefront' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    Promise.all([
      fetch(`/api/v1/superadmin/tenants/${tenantId}`).then((r) => r.json()),
      fetch(`/api/v1/superadmin/tenants/${tenantId}/modules`).then((r) => r.json()),
    ])
      .then(([tRes, mRes]) => {
        if (tRes?.data) setTenant(tRes.data);
        if (mRes?.data) setModules(mRes.data);
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  const handleToggleModule = async (moduleKey: string, currentStatus: string) => {
    const action = currentStatus === 'enabled' ? 'disable' : 'enable';
    setActionLoading(moduleKey);

    try {
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleKey, action }),
      });
      const data = await res.json();

      if (data.success) {
        setModules((prev) =>
          prev.map((m) =>
            m.key === moduleKey
              ? { ...m, entitlement: { ...m.entitlement, status: action === 'enable' ? 'enabled' : 'disabled' } }
              : m
          )
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !tenant) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-zinc-100 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <Link
            href="/superadmin/tenants"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tenants</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Database:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {tenant.databaseIdentifier || `tenant_${tenantId}`}
            </span>
          </div>
        </div>

        {/* Tenant Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{tenant.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tenant.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Slug: {tenant.slug}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/superadmin/tenants/${tenantId}/storefront`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              <Layout className="w-4 h-4" />
              <span>Open Storefront Editor</span>
            </Link>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80">
          {(['overview', 'modules', 'storefront', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Commerce Plan
              </span>
              <p className="text-lg font-bold text-white">{tenant.planName}</p>
              <p className="text-xs text-zinc-500">Includes Multi-Store, Dedicated DB & Visual Builder</p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Storefront Status
              </span>
              <p className="text-lg font-bold text-emerald-400">Live & Synced</p>
              <Link
                href={`/superadmin/tenants/${tenantId}/storefront`}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Storefront</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Entitled Modules
              </span>
              <p className="text-lg font-bold text-white">
                {modules.filter((m) => m.entitlement?.status === 'enabled').length} / {modules.length}
              </p>
              <button
                onClick={() => setActiveTab('modules')}
                className="text-xs text-amber-400 hover:underline"
              >
                Configure Entitlements &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Non-Destructive Module Rule:</strong> Disabling a module revokes tenant admin access immediately, but all historical products, orders, inventory, and records remain preserved in MongoDB.
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-6">Module</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Dependencies</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {modules.map((m) => {
                    const isEnabled = m.entitlement?.status === 'enabled';
                    return (
                      <tr key={m.key} className="hover:bg-zinc-800/20 transition">
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-white">{m.name}</div>
                          <span className="text-[11px] text-zinc-500">{m.description}</span>
                        </td>
                        <td className="py-3.5 px-6 uppercase font-mono text-[10px] text-zinc-400">
                          {m.category}
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-[11px] text-zinc-500">
                          {m.dependencies?.length ? m.dependencies.join(', ') : 'None'}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            disabled={actionLoading === m.key}
                            onClick={() => handleToggleModule(m.key, m.entitlement?.status)}
                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition ${
                              isEnabled
                                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {actionLoading === m.key ? 'Saving...' : isEnabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: STOREFRONT */}
        {activeTab === 'storefront' && (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
            <Layout className="w-12 h-12 mx-auto text-amber-400" />
            <h3 className="text-base font-bold text-white">Central Storefront Hub</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Edit homepage, manage custom pages, preview on desktop/tablet/mobile, and publish immutable versions.
            </p>
            <Link
              href={`/superadmin/tenants/${tenantId}/storefront`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              <span>Launch Storefront Management</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Tab Content: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3 text-xs">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Database Driver:</span>
              <span className="font-mono text-white">MongoDB Native Driver v7.6</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Isolation Invariant:</span>
              <span className="font-mono text-emerald-400">ONE TENANT = ONE SEPARATE DB</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
