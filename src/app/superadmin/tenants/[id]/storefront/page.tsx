'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Layout,
  Globe,
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  Edit,
  Eye,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StorefrontPage, StorefrontVersion } from '@/types/tenant-governance.types';

export default function SuperadminStorefrontPage() {
  const params = useParams();
  const tenantId = (params?.id as string) || '';

  const [storefrontData, setStorefrontData] = useState<any>(null);
  const [pages, setPages] = useState<StorefrontPage[]>([]);
  const [versions, setVersions] = useState<StorefrontVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = () => {
    Promise.all([
      fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront`).then((r) => r.json()),
      fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront/pages`).then((r) => r.json()),
    ])
      .then(([sfRes, pRes]) => {
        if (sfRes?.data) {
          setStorefrontData(sfRes.data.storefront);
          setVersions(sfRes.data.versionHistory || []);
        }
        if (pRes?.data) setPages(pRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tenantId) loadData();
  }, [tenantId]);

  const handlePublishStorefront = async () => {
    setPublishing(true);
    setStatusMessage('');

    try {
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          storefrontId: storefrontData?.id,
          changelog: 'Superadmin published live storefront update',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Storefront successfully published as Version ${data.data.version}!`);
        loadData();
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleRollback = async (versionNumber: number) => {
    if (!confirm(`Are you sure you want to rollback to Version ${versionNumber}? This will create a new published version.`)) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          storefrontId: storefrontData?.id,
          targetVersion: versionNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Storefront rolled back! New Version ${data.data.version} created from Version ${versionNumber}.`);
        loadData();
      }
    } finally {
      setPublishing(false);
    }
  };

  if (loading || !storefrontData) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-zinc-100 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
      </div>
    );
  }

  const homePage = pages.find((p) => p.type === 'homepage') || pages[0];

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <Link
            href={`/superadmin/tenants/${tenantId}`}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tenant Overview</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Tenant:</span>
            <span className="text-xs font-mono text-amber-400 font-bold">{tenantId}</span>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Storefront Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{storefrontData.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live & Synced
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Active Published Version: <span className="font-mono text-amber-400 font-bold">v{storefrontData.publishedVersion}</span> • Environment: <span className="text-zinc-200 font-medium capitalize">{storefrontData.environmentId}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Store</span>
            </Link>

            <button
              disabled={publishing}
              onClick={handlePublishStorefront}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {publishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Publish Storefront</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {homePage && (
            <Link
              href={`/superadmin/tenants/${tenantId}/storefront/pages/${homePage.id}/edit`}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Edit Homepage
                </span>
                <Edit className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-zinc-400">
                Open Visual Page Builder to customize hero banner, lookbooks, and section blocks.
              </p>
            </Link>
          )}

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Pages Count</span>
              <Layout className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xl font-bold text-white">{pages.length} Pages</p>
            <p className="text-[11px] text-zinc-500 mt-1">All pages stored in tenant DB</p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Version History</span>
              <History className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xl font-bold text-white">{versions.length} Snapshots</p>
            <p className="text-[11px] text-zinc-500 mt-1">Immutable rollbacks supported</p>
          </div>
        </div>

        {/* Pages Management Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Storefront Pages</h2>
              <p className="text-xs text-zinc-400">Manage drafts and publish individual pages.</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-6">Page Title & Slug</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Sections</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/20 transition">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-white">{p.title}</div>
                      <span className="text-[11px] font-mono text-zinc-500">/{p.slug}</span>
                    </td>
                    <td className="py-3.5 px-6 capitalize text-zinc-400">{p.type}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-400">
                      {p.sections?.length || 0} blocks
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <Link
                        href={`/superadmin/tenants/${tenantId}/storefront/pages/${p.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-semibold transition border border-amber-500/30"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Visual Editor</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immutable Version History */}
        {versions.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Version History & Safe Rollback</h2>
              <p className="text-xs text-zinc-400">
                Rollback creates a new version from historical snapshot. Past versions are never mutated.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-6">Version</th>
                    <th className="py-3 px-6">Published At</th>
                    <th className="py-3 px-6">Operator</th>
                    <th className="py-3 px-6">Changelog</th>
                    <th className="py-3 px-6 text-right">Rollback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {versions.map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-800/20 transition">
                      <td className="py-3 px-6 font-mono font-bold text-amber-400">
                        v{v.version}
                        {v.version === storefrontData.publishedVersion && (
                          <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-zinc-400">
                        {new Date(v.publishedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-zinc-300">{v.publishedBy}</td>
                      <td className="py-3 px-6 text-zinc-400">{v.changelog || 'Regular update'}</td>
                      <td className="py-3 px-6 text-right">
                        {v.version !== storefrontData.publishedVersion && (
                          <button
                            onClick={() => handleRollback(v.version)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            <span>Restore v{v.version}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
