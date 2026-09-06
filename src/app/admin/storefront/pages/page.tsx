/**
 * Module 38: Tenant Admin - Storefront Pages Management
 * Lists all pages for the current tenant store and allows launching the Elementor-style Visual Page Builder.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layout,
  Plus,
  Edit,
  Trash2,
  Copy,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { PageDocument } from '@/lib/page-builder/types';

export default function TenantAdminStorefrontPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/content/pages');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setPages(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load storefront pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) return;

    setIsCreating(true);
    try {
      const slug = newPageSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
      const res = await fetch('/api/v1/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageTitle.trim(),
          name: newPageTitle.trim(),
          slug,
          type: 'standard',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setShowCreateModal(false);
        setNewPageTitle('');
        setNewPageSlug('');
        if (json?.data?.id) {
          router.push(`/admin/storefront/pages/${json.data.id}/edit`);
        } else {
          fetchPages();
        }
      }
    } catch (err) {
      console.error('Failed to create page:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/content/pages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  const filteredPages = pages.filter((p) =>
    (p.name || p.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Storefront Visual Pages</h1>
              <p className="text-xs text-zinc-400">
                Elementor-style drag-and-drop page builder with live responsive editing and instant storefront rendering.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/storefront/templates"
            className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search storefront pages by title or slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center justify-between">
          <span className="text-xs text-zinc-400">Total Pages</span>
          <span className="text-sm font-bold text-white">{pages.length}</span>
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs">Loading tenant storefront pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Start Building Your Storefront</h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">
                No custom pages created yet. Design landing pages, lookbooks, or product showcase pages with drag-and-drop.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
            >
              Create First Page
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Page Name & Route</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Version</th>
                <th className="py-3.5 px-6">Updated</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white text-sm">{page.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <span>/{page.slug}</span>
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-600 hover:text-amber-400 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded text-[11px]">
                      {page.type || 'standard'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        page.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {page.status === 'published' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span className="capitalize">{page.status || 'draft'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-zinc-400 text-xs">
                    v{page.version || 1}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 text-[11px]">
                    {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/admin/storefront/pages/${page.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold transition border border-amber-500/30"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Visual Builder</span>
                    </Link>
                    <button
                      onClick={() => handleDeletePage(page.id, page.name)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-400" />
                <span>Create New Storefront Page</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Page Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Lookbook 2026"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">URL Slug</label>
                <div className="flex items-center bg-zinc-800/80 border border-zinc-700 rounded-lg overflow-hidden px-3">
                  <span className="text-zinc-500 font-mono">/</span>
                  <input
                    type="text"
                    required
                    placeholder="summer-lookbook"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    className="w-full py-2 bg-transparent text-white focus:outline-none pl-1 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create & Launch Builder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
