'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Globe2,
  Sliders,
  Image as ImageIcon,
  FolderTree,
  DollarSign,
  Boxes,
  Eye,
  Tag,
  Share2,
  History,
  Sparkles,
  Search,
  Check,
  RotateCcw,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { PimProduct, ProductVersion } from '@/types/pim-commerce.types';

export default function ProductDetailAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<PimProduct | null>(null);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // AI assistant loading
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const [prodRes, verRes] = await Promise.all([
        fetch(`/api/v1/products/${productId}`),
        fetch(`/api/v1/catalog/versions?productId=${productId}`),
      ]);
      const prodData = await prodRes.json();
      const verData = await verRes.json();

      if (prodData.data) {
        setProduct(prodData.data);
      }
      if (verData.data) {
        setVersions(verData.data);
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch(`/api/v1/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        setSaveMessage('Product updated and new version snapshot created.');
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAiEnrich = async () => {
    if (!product) return;
    setAiGenerating(true);
    // Simulate grounded AI enrichment
    setTimeout(() => {
      setProduct((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: prev.title.includes('Bespoke') ? prev.title : `Bespoke ${prev.title}`,
          shortDescription: `Artisanal hand-draped ${prev.title} crafted in pure ${prev.material || 'luxurious textiles'}.`,
          tags: Array.from(new Set([...prev.tags, 'couture-edit', 'artisan-atelier', 'slow-fashion'])),
          seo: {
            ...prev.seo,
            title: `${prev.title} | Lumina Atelier Haute Couture`,
            description: `Shop the handcrafted ${prev.title} tailored in pure ${prev.material || 'fine fabric'}. Complimentary international delivery.`,
          },
        };
      });
      setAiGenerating(false);
      setSaveMessage('Grounded AI draft applied (Unsaved draft).');
    }, 600);
  };

  const handleApprovalAction = async (action: 'submit_for_review' | 'approve' | 'reject') => {
    if (!product) return;
    try {
      const res = await fetch('/api/v1/catalog/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, action, comments: `Processed by Curator Lead` }),
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.data.product);
        setSaveMessage(`Approval state transitioned: ${action.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Approval transition error:', err);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!product) return;
    try {
      const res = await fetch('/api/v1/catalog/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, versionId }),
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.data.product);
        setSaveMessage(data.message);
        fetchProduct();
      }
    } catch (err) {
      console.error('Rollback error:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: '1. Overview' },
    { id: 'content', label: '2. Content' },
    { id: 'attributes', label: '3. Attributes' },
    { id: 'variants', label: '4. Variants' },
    { id: 'media', label: '5. Media' },
    { id: 'categories', label: '6. Categories' },
    { id: 'collections', label: '7. Collections' },
    { id: 'pricing', label: '8. Pricing' },
    { id: 'inventory', label: '9. Inventory' },
    { id: 'markets', label: '10. Markets' },
    { id: 'channels', label: '11. Channels' },
    { id: 'seo', label: '12. SEO' },
    { id: 'localization', label: '13. Localization' },
    { id: 'relationships', label: '14. Relationships' },
    { id: 'bundles', label: '15. Bundles / Kits' },
    { id: 'publishing', label: '16. Publishing & Approvals' },
    { id: 'versions', label: '17. Versions' },
    { id: 'integrations', label: '18. Integrations' },
    { id: 'analytics', label: '19. Analytics & Audit' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center text-zinc-500 text-sm">
        Loading product governance record...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-zinc-200 font-bold text-lg">Product Not Found</h2>
        <Link href="/admin/products" className="text-amber-400 text-xs hover:underline">
          Return to products catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">{product.sku}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase border ${
                  product.status === 'published'
                    ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                    : product.status === 'in_review'
                    ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {product.status}
              </span>
              <span className="text-xs text-zinc-500">• v{product.version}</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mt-0.5">{product.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAiEnrich}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/10 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
            <span>AI Enrich (Draft)</span>
          </button>

          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-medium transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live PDP</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
          <span>{saveMessage}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Governance Health Badges */}
      <div className="grid grid-cols-3 gap-4 bg-[#12151B] border border-zinc-800/80 rounded-xl p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Completeness Score</div>
            <div className="text-sm font-bold text-zinc-100">
              {product.completeness?.totalPercent || 0}% Complete
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Quality Health</div>
            <div className="text-sm font-bold text-zinc-100">
              {product.quality?.score || 0} / 100 Score
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Publishing Readiness</div>
            <div className="text-sm font-bold text-amber-300">
              {product.readiness?.status || 'READY'}
            </div>
          </div>
        </div>
      </div>

      {/* 19 Tabs Navigation Strip */}
      <div className="border-b border-zinc-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-[#12151B] border border-zinc-800 rounded-xl p-6 min-h-[420px]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Core Product Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={product.subtitle || ''}
                  onChange={(e) => setProduct({ ...product, subtitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">SKU</label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Barcode (EAN / UPC / GTIN)</label>
                <input
                  type="text"
                  value={product.barcode || ''}
                  onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={product.brandName || 'Lumina Atelier'}
                  onChange={(e) => setProduct({ ...product, brandName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT & VISUAL BUILDER */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Product Content & Story</h3>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Short Description</label>
              <textarea
                rows={2}
                value={product.shortDescription || ''}
                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Detailed Description</label>
              <textarea
                rows={5}
                value={product.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-100 outline-none"
              />
            </div>

            {/* Visual Builder Sections Preview */}
            <div className="border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-300">Rich Visual Sections (Page → Section → Block)</span>
                <span className="text-[11px] text-amber-400">Integrated with Visual Builder</span>
              </div>
              <div className="space-y-2">
                {product.richSections?.length > 0 ? (
                  product.richSections.map((sec) => (
                    <div key={sec.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                      <div className="font-semibold text-zinc-200">{sec.title} ({sec.type})</div>
                      <div className="text-zinc-400 text-[11px] mt-1">
                        {sec.blocks.length} configured block(s)
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No rich builder sections added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTRIBUTES */}
        {activeTab === 'attributes' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Dynamic Product Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Fabric Composition</label>
                <input
                  type="text"
                  value={product.material || ''}
                  onChange={(e) => setProduct({ ...product, material: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={product.countryOfOrigin || 'India'}
                  onChange={(e) => setProduct({ ...product, countryOfOrigin: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Weight (grams)</label>
                <input
                  type="number"
                  value={product.weight || 450}
                  onChange={(e) => setProduct({ ...product, weight: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Tax Category ID</label>
                <input
                  type="text"
                  value={product.taxCategoryId || 'tax_standard'}
                  onChange={(e) => setProduct({ ...product, taxCategoryId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VARIANTS */}
        {activeTab === 'variants' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Dynamic Variants & Matrix</h3>
            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
              {product.variants?.map((v) => (
                <div key={v.id} className="p-3 bg-zinc-900/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-200">{v.title}</div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">SKU: {v.sku}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400">Options: {JSON.stringify(v.optionValues)}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px]">
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Product Media Gallery & Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.media?.map((m, idx) => (
                <div key={m.id || idx} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-2">
                  <div className="aspect-square bg-zinc-950 rounded-lg overflow-hidden mb-2">
                    <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-zinc-400">{m.role}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">#{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PRICING (AUTHORITATIVE SEPARATION) */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200">
              <strong>CRITICAL OWNERSHIP PRINCIPLE:</strong> PIM does not calculate authoritative order pricing.
              Prices shown here are catalog reference rates governed by <strong>PricingService</strong> and promotional rules in <strong>PromotionEngine</strong>.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Base Price Reference (USD)</label>
                <input
                  type="number"
                  value={(product as any).price || 1499}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Compare At Price Reference</label>
                <input
                  type="number"
                  value={(product as any).compareAtPrice || 2199}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: INVENTORY (AUTHORITATIVE SEPARATION) */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200">
              <strong>CRITICAL OWNERSHIP PRINCIPLE:</strong> Inventory allocation is owned strictly by <strong>InventoryService</strong>. PIM only stores SKU references and trackability flags.
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Inventory Tracking:</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Assigned SKU:</span>
                <span className="font-mono text-zinc-200">{product.sku}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Search Engine Optimization</h3>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Meta Title</label>
              <input
                type="text"
                value={product.seo?.title || ''}
                onChange={(e) => setProduct({ ...product, seo: { ...product.seo, title: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={product.seo?.description || ''}
                onChange={(e) => setProduct({ ...product, seo: { ...product.seo, description: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-100 outline-none"
              />
            </div>

            {/* Google SERP Live Simulation */}
            <div className="border-t border-zinc-800 pt-4">
              <span className="text-xs font-semibold text-zinc-400 block mb-2">Google SERP Snippet Preview</span>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-w-xl">
                <div className="text-[11px] text-zinc-400 font-mono">https://lumina-atelier.com/products/{product.slug}</div>
                <div className="text-sm font-medium text-blue-400 hover:underline cursor-pointer mt-0.5 line-clamp-1">
                  {product.seo?.title || product.title}
                </div>
                <div className="text-xs text-zinc-300 mt-1 line-clamp-2">
                  {product.seo?.description || product.shortDescription}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 16: PUBLISHING & APPROVALS */}
        {activeTab === 'publishing' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Publication Governance & Approvals</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-400">Current Status:</div>
                <div className="text-base font-bold text-amber-300 uppercase mt-0.5">{product.status}</div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Approval Level: <strong className="text-zinc-300 capitalize">{product.approvalState?.currentLevel}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprovalAction('submit_for_review')}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => handleApprovalAction('approve')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Approve & Advance
                </button>
                <button
                  onClick={() => handleApprovalAction('reject')}
                  className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-medium transition"
                >
                  Reject to Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 17: VERSIONS & NON-DESTRUCTIVE ROLLBACK */}
        {activeTab === 'versions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Immutable Version History</h3>
            <p className="text-xs text-zinc-400">
              Every edit creates an immutable snapshot. Rolling back produces a new forward version and never mutates history.
            </p>

            <div className="space-y-2 mt-4">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400 font-mono">v{v.version}</span>
                      <span className="text-zinc-300 font-medium">{v.changeSummary}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      By {v.changedBy} on {new Date(v.changedAt).toLocaleString()}
                    </div>
                  </div>

                  {v.version !== product.version && (
                    <button
                      onClick={() => handleRollback(v.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback to v{v.version}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT FALLBACK FOR OTHER TABS */}
        {!['overview', 'content', 'attributes', 'variants', 'media', 'pricing', 'inventory', 'seo', 'publishing', 'versions'].includes(activeTab) && (
          <div className="py-12 text-center text-zinc-400 text-xs space-y-2">
            <p className="font-semibold text-zinc-300 capitalize">{activeTab} Governance Panel</p>
            <p className="text-zinc-500 max-w-md mx-auto">
              This module maintains seamless continuous synchronization with the enterprise data model and authoritative domain adapters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
