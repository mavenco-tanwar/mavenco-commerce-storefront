'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  LayoutTemplate,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PageBuilderDocument } from '@/types/builder.types';

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create page modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [pageType, setPageType] = useState('page');
  const [creating, setCreating] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content/pages');
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setPages(json.data);
      }
    } catch (err) {
      console.error('Failed to load pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^\//, '');
    const pageId = `page_${Date.now()}`;

    try {
      const newPage: PageBuilderDocument = {
        id: pageId,
        tenantId: 'lumina',
        title: title.trim(),
        slug: cleanSlug,
        type: pageType as any,
        status: 'draft',
        version: 1,
        content: {
          version: 1,
          settings: {
            background: '#FFFDFC',
            backgroundColor: '#FFFDFC',
            textColor: '#111111',
          },
          children: [
            {
              id: `sec_${Date.now()}`,
              type: 'section',
              label: 'Main Section',
              props: { containerWidth: 'boxed' },
              styles: {
                desktop: { paddingTop: '80px', paddingBottom: '80px' },
                tablet: {},
                mobile: {},
              },
              children: [
                {
                  id: `head_${Date.now()}`,
                  type: 'heading',
                  props: { text: title.trim(), tag: 'h1' },
                  styles: {
                    desktop: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' },
                    tablet: { fontSize: '32px' },
                    mobile: { fontSize: '24px' },
                  },
                },
                {
                  id: `text_${Date.now()}`,
                  type: 'text',
                  props: { text: 'Start customizing your page content using the visual builder.' },
                  styles: {
                    desktop: { color: '#57534E', fontSize: '16px', lineHeight: '1.6' },
                    tablet: {},
                    mobile: {},
                  },
                },
              ],
            },
          ],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/v1/content/builder/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        router.push(`/admin/pages/${pageId}/builder`);
      } else {
        alert('Failed to create page');
      }
    } catch {
      alert('Network error while creating page');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = async (id: string, pageTitle: string) => {
    if (confirm(`Are you sure you want to delete "${pageTitle}"?`)) {
      try {
        const res = await fetch(`/api/v1/content/builder/pages/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setPages((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
        } else {
          alert('Failed to delete page');
        }
      } catch (err) {
        console.error('Delete page error:', err);
      }
    }
  };

  const handleDuplicatePage = async (p: any) => {
    const newTitle = `${p.title || 'Page'} (Copy)`;
    const newSlug = `${(p.slug || 'page')}-copy-${Math.random().toString(36).substring(2, 6)}`;
    const newId = `page_${Date.now()}`;

    try {
      const duplicatedDoc: PageBuilderDocument = {
        ...p,
        id: newId,
        title: newTitle,
        slug: newSlug,
        status: 'draft',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/v1/content/builder/pages/${newId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedDoc),
      });

      if (res.ok) {
        fetchPages();
      }
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const handleTogglePublish = async (p: any) => {
    const isCurrentlyPublished = p.status === 'published';
    const endpoint = isCurrentlyPublished
      ? `/api/v1/content/builder/pages/${p.id}/unpublish`
      : `/api/v1/content/builder/pages/${p.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        fetchPages();
      }
    } catch (err) {
      console.error('Publish toggle error:', err);
    }
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.slug || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (p.status || 'published') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 select-none font-sans text-zinc-100">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Website Pages & Visual Builder
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Design, preview, version, and publish responsive storefront pages with our visual drag-and-drop studio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/10 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111318] p-3 rounded-xl border border-zinc-800/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by title or slug..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              statusFilter === 'all' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({pages.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              statusFilter === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              statusFilter === 'draft' ? 'bg-amber-950 text-amber-400 border border-amber-800/50 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-[#111318] rounded-xl border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D11] border-b border-zinc-800/80 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    Loading pages...
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No pages found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPages.map((p) => {
                  const isPublished = p.status === 'published';
                  const slugPath = p.slug ? `/${p.slug.replace(/^\//, '')}` : '/';

                  return (
                    <tr key={p.id || p.slug} className="hover:bg-zinc-900/50 transition">
                      {/* Title & Slug */}
                      <td className="py-3 px-4">
                        <div>
                          <Link
                            href={`/admin/pages/${p.id}/builder`}
                            className="font-semibold text-zinc-100 hover:text-amber-400 transition"
                          >
                            {p.title || 'Untitled Page'}
                          </Link>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono mt-0.5">
                            <span>{slugPath}</span>
                            <Link href={slugPath} target="_blank" className="hover:text-zinc-300">
                              <ExternalLink className="w-3 h-3 inline ml-0.5" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-zinc-300 capitalize">
                          {p.type || 'standard'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold font-mono tracking-wider ${
                            isPublished
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                          {p.status || 'draft'}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                        {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Open Visual Builder */}
                          <Link
                            href={`/admin/pages/${p.id}/builder`}
                            className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded font-semibold text-[11px] transition flex items-center gap-1 border border-amber-400/30"
                            title="Open in Visual Builder"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Builder</span>
                          </Link>

                          {/* Toggle Publish */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(p)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition"
                            title={isPublished ? 'Unpublish to Draft' : 'Publish Live'}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicatePage(p)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition"
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeletePage(p.id, p.title)}
                            className="p-1.5 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded transition"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Page Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14181F] text-zinc-100 border border-zinc-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-100">Create New Page</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Summer Atelier Lookbook"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-md text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Page URL Slug</label>
                <div className="flex items-center bg-zinc-900 border border-zinc-700/60 rounded-md px-2.5 py-1.5">
                  <span className="text-zinc-500 font-mono">/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="summer-lookbook"
                    className="w-full bg-transparent border-none outline-none text-zinc-100 font-mono pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Page Type</label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-md text-zinc-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="page">Standard Page</option>
                  <option value="homepage">Homepage Override</option>
                  <option value="landing">Marketing Landing Page</option>
                  <option value="product-template">Product Template</option>
                  <option value="category-template">Category Template</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg transition"
                >
                  {creating ? 'Creating...' : 'Create & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
