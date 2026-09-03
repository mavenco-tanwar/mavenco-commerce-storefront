'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PimProduct } from '@/types/pim-commerce.types';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<PimProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionRunning, setBulkActionRunning] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState('dresses');
  const [newMaterial, setNewMaterial] = useState('Pure Silk & Linen');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter !== 'all') q.set('status', statusFilter);
      q.set('limit', '100');

      const res = await fetch(`/api/v1/products?${q.toString()}`);
      const data = await res.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (operation: 'publish' | 'unpublish' | 'archive') => {
    if (selectedIds.length === 0) return;
    setBulkActionRunning(true);
    setFeedbackMsg('');
    try {
      const res = await fetch('/api/v1/catalog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedIds, operation }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`Bulk ${operation} succeeded for ${data.data.successCount} product(s).`);
        setSelectedIds([]);
        fetchProducts();
      }
    } catch (err) {
      console.error('Bulk action error:', err);
    } finally {
      setBulkActionRunning(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const generatedSku = newSku || `ATELIER-${newCategory.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-4)}`;
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          sku: generatedSku,
          categories: [newCategory],
          material: newMaterial,
          description: `Handcrafted ${newTitle} tailored in refined ${newMaterial}.`,
          shortDescription: `Artisanal ${newTitle}.`,
          status: 'draft',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateOpen(false);
        setNewTitle('');
        setNewSku('');
        fetchProducts();
      }
    } catch (err) {
      console.error('Create product error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Authoritative product records, attributes, variants, media, and publishing states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-zinc-800 text-amber-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-zinc-800 text-amber-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12151B] border border-zinc-800/80 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, SKU, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/70 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="in_review">In Review</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
            <span className="font-bold">{selectedIds.length}</span> product(s) selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              disabled={bulkActionRunning}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition disabled:opacity-50"
            >
              Bulk Publish
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              disabled={bulkActionRunning}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium transition disabled:opacity-50"
            >
              Bulk Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              disabled={bulkActionRunning}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-md text-xs font-medium transition disabled:opacity-50"
            >
              Bulk Archive
            </button>
          </div>
        </div>
      )}

      {feedbackMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-lg">
          {feedbackMsg}
        </div>
      )}

      {/* Product List Content */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-sm">
          Loading catalog records...
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-300 font-medium text-sm">No products found</p>
          <p className="text-zinc-500 text-xs mt-1">Try refining your search or status filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#12151B] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-zinc-300 border-collapse">
            <thead className="bg-[#0F1217] text-zinc-400 font-medium uppercase tracking-wider border-b border-zinc-800/80 text-[10px]">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === products.length && products.length > 0}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Status</th>
                <th className="p-3">Category</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Quality</th>
                <th className="p-3">Completeness</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.map((p) => {
                const primaryImage = (p.media || []).find((m) => m.role === 'primary')?.url || p.media?.[0]?.url;
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-zinc-800/40 transition ${isSelected ? 'bg-amber-500/5' : ''}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(p.id)}
                        className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                          {primaryImage ? (
                            <img src={primaryImage} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="font-semibold text-zinc-200 hover:text-amber-400 transition"
                          >
                            {p.title}
                          </Link>
                          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{p.sku}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${
                          p.status === 'published'
                            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                            : p.status === 'in_review'
                            ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                            : p.status === 'draft'
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                            : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 capitalize">{p.categories?.[0] || 'Unassigned'}</td>
                    <td className="p-3 text-zinc-400">{p.brandName || 'Lumina Atelier'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span
                          className={`${
                            (p.quality?.score || 0) >= 80 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {p.quality?.score || 0}
                        </span>
                        <span className="text-[10px] text-zinc-600">/ 100</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${p.completeness?.totalPercent || 0}%` }}
                          />
                        </div>
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {p.completeness?.totalPercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        <span>Edit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => {
            const primaryImage = (p.media || []).find((m) => m.role === 'primary')?.url || p.media?.[0]?.url;
            return (
              <div
                key={p.id}
                className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition"
              >
                <div className="aspect-[4/3] bg-zinc-900 relative">
                  {primaryImage ? (
                    <img src={primaryImage} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border shadow-sm ${
                        p.status === 'published'
                          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                          : 'bg-zinc-900/90 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500">{p.sku}</div>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-semibold text-zinc-100 text-sm hover:text-amber-400 line-clamp-1 mt-0.5"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {p.shortDescription || p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{p.completeness?.totalPercent || 0}% Complete</span>
                    </div>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-amber-400 hover:text-amber-300 font-medium text-xs flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Product Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#14171E] border border-zinc-700/80 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Create PIM Product</span>
            </h2>
            <p className="text-xs text-zinc-400">
              New products are initialized in <strong className="text-zinc-200">Draft</strong> state to permit governance and enrichment prior to channel publishing.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 pt-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ivory Silk Evening Kaftan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1">
                  SKU (Optional - auto-generated if empty)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ATELIER-DRS-009"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-100 outline-none cursor-pointer"
                  >
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="co-ords">Co-ords</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-300 block mb-1">Primary Material</label>
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition"
                >
                  Initialize Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
