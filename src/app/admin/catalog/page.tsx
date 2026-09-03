'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Catalog, PimProduct } from '@/types/pim-commerce.types';

export default function CatalogDashboardPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [products, setProducts] = useState<PimProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/v1/catalog'),
        fetch('/api/v1/products?limit=100'),
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      if (catData.success) setCatalogs(catData.data);
      if (prodData.data) setProducts(prodData.data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const totalProducts = products.length;
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const inReviewCount = products.filter((p) => p.status === 'in_review').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const qualityIssueCount = products.filter((p) => (p.quality?.score || 0) < 80).length;
  const avgCompleteness = totalProducts > 0
    ? Math.round(products.reduce((acc, p) => acc + (p.completeness?.totalPercent || 0), 0) / totalProducts)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Master Catalog & PIM Governance</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Authoritative source for multi-market, multi-channel product governance and publication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCatalogData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-medium transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-500/20"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Total Catalog</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalProducts}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Items in tenant store</p>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
            <span>Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{publishedCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Live in store channels</p>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
            <span>In Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{inReviewCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Pending approval</p>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Drafts</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-200">{draftCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Work in progress</p>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-rose-400 text-xs mb-2">
            <span>Quality Issues</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{qualityIssueCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Below 80% quality score</p>
        </div>

        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
            <span>Avg Completeness</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{avgCompleteness}%</div>
          <p className="text-[11px] text-zinc-500 mt-1">Readiness benchmark</p>
        </div>
      </div>

      {/* Catalog Hierarchy & Inheritance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#12151B] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Catalog Inheritance Architecture</span>
            </h2>
            <span className="text-xs text-zinc-500">Master → Market → Channel</span>
          </div>

          <div className="space-y-3">
            {catalogs.map((cat) => (
              <div
                key={cat.id}
                className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200 text-sm">{cat.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {cat.type}
                    </span>
                    {cat.parentCatalogId && (
                      <span className="text-[10px] text-amber-400/90 font-mono">
                        ↳ inherits from #{cat.parentCatalogId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                    <span>Markets: <strong className="text-zinc-300">{cat.markets.join(', ')}</strong></span>
                    <span>•</span>
                    <span>Channels: <strong className="text-zinc-300">{cat.channels.join(', ')}</strong></span>
                    <span>•</span>
                    <span>Products: <strong className="text-amber-400">{cat.productIds?.length || 0}</strong></span>
                  </div>
                </div>
                <Link
                  href="/admin/catalog/publishing"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <span>Publishing</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Sidebar */}
        <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Governance Shortcuts</span>
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/admin/merchandising"
                className="block p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition text-xs group"
              >
                <div className="font-medium text-zinc-200 group-hover:text-amber-300 transition">
                  Merchandising Studio
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  Pin hero garments, boost trending dresses, apply collection boost rules.
                </div>
              </Link>
              <Link
                href="/admin/catalog/quality"
                className="block p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition text-xs group"
              >
                <div className="font-medium text-zinc-200 group-hover:text-amber-300 transition">
                  Quality Audit Engine
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  Scan for missing imagery, empty care instructions, and duplicate descriptions.
                </div>
              </Link>
              <Link
                href="/admin/catalog/imports"
                className="block p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition text-xs group"
              >
                <div className="font-medium text-zinc-200 group-hover:text-amber-300 transition">
                  Import Center (CSV / JSON)
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  Visual field mapping, dry-run simulations, and version-creating upserts.
                </div>
              </Link>
              <Link
                href="/admin/catalog/reconciliation"
                className="block p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition text-xs group"
              >
                <div className="font-medium text-zinc-200 group-hover:text-amber-300 transition">
                  Reconciliation Report
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  Verify consistency between PIM, Search Engine, and Storefront APIs.
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500">
            Authoritative Product Information Engine • Module 33
          </div>
        </div>
      </div>
    </div>
  );
}
