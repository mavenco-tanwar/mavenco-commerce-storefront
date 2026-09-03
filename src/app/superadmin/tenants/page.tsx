'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  RefreshCw,
  Layout,
} from 'lucide-react';

interface TenantRecord {
  tenantId: string;
  slug: string;
  name: string;
  status: string;
  planName: string;
  databaseIdentifier: string;
  storesCount: number;
  mrrMinor: number;
  health: string;
  createdAt: string;
}

export default function SuperadminTenantsPage() {
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/superadmin/tenants?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setTenants(json.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase font-semibold">
                Superadmin Platform Control
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-400 text-xs">Module 36 Tenant Governance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Tenants Directory</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage multi-tenant SaaS clients, module entitlements, and isolated storefront editors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/superadmin/tenants/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Tenant</span>
            </Link>
          </div>
        </div>

        {/* Search & Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-zinc-500 text-xs font-medium">Total SaaS Tenants</span>
            <p className="text-2xl font-bold text-white mt-1">{tenants.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-zinc-500 text-xs font-medium">Platform Database Mode</span>
            <p className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Isolated DB Per Tenant
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-zinc-500 text-xs font-medium">Storefront System</span>
            <p className="text-sm font-semibold text-amber-400 mt-2">Visual Builder v2.0</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-zinc-500 text-xs font-medium">Access Control</span>
            <p className="text-sm font-semibold text-cyan-400 mt-2">Dynamic RBAC + Entitlements</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by tenant name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Tenants Table */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800/80 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Tenant & Slug</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Plan</th>
                  <th className="py-3.5 px-6">Isolated DB</th>
                  <th className="py-3.5 px-6">MRR</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((tenant) => (
                  <tr key={tenant.tenantId} className="hover:bg-zinc-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white text-sm">{tenant.name}</div>
                      <span className="text-[11px] font-mono text-zinc-500">{tenant.slug}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tenant.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-medium">{tenant.planName}</td>
                    <td className="py-4 px-6 font-mono text-[11px] text-amber-400/90">
                      {tenant.databaseIdentifier}
                    </td>
                    <td className="py-4 px-6 font-semibold text-zinc-200">
                      ${((tenant.mrrMinor || 29900) / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/superadmin/tenants/${tenant.slug}/storefront`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-semibold transition border border-amber-500/30"
                      >
                        <Layout className="w-3.5 h-3.5" />
                        <span>Storefront Editor</span>
                      </Link>
                      <Link
                        href={`/superadmin/tenants/${tenant.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
