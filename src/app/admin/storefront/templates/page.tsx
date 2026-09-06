/**
 * Module 38: Tenant Admin - Storefront Templates Management
 * Reusable sections, hero banners, product grids, and platform template presets.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Search,
  Plus,
  ArrowLeft,
  Layout,
  Copy,
  Trash2,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { BuilderTemplate } from '@/lib/page-builder/types';

export default function TenantAdminTemplatesPage() {
  const [templates, setTemplates] = useState<BuilderTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'page' | 'section' | 'block'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/content/templates');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setTemplates(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filtered = templates.filter((t) => {
    const matchesTab = activeTab === 'all' || t.type === activeTab;
    const matchesQuery = (t.name || t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/storefront/pages"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Storefront Templates Library</h1>
                  <p className="text-xs text-zinc-400">
                    Prebuilt page designs and reusable section blocks ready for instant insertion into the Visual Page Builder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/storefront/pages"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Layout className="w-4 h-4" />
            <span>Go to Page Builder</span>
          </Link>
        </div>
      </div>

      {/* Tabs and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs font-medium">
          {(['all', 'page', 'section', 'block'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md capitalize transition ${
                activeTab === tab
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Templates' : `${tab}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <p className="text-xs">Loading template catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-20 text-center space-y-3 p-6">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Templates Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You can save any section or page in the Visual Builder as a reusable template.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition flex flex-col"
            >
              <div className="h-44 bg-zinc-950/80 relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                {tpl.thumbnail ? (
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-600">
                    <Layout className="w-8 h-8" />
                    <span className="text-[11px] font-mono capitalize">{tpl.type}</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 backdrop-blur text-amber-400 border border-amber-500/30 uppercase">
                  {tpl.type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{tpl.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {tpl.category || 'Curated boutique layout designed for modern luxury stores.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {tpl.isPlatform ? 'Platform Preset' : 'Tenant Custom'}
                  </span>
                  <Link
                    href="/admin/storefront/pages"
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Insert in Builder</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
