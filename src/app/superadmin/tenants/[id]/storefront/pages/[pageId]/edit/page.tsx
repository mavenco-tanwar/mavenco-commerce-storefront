'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Check,
  CheckCircle2,
  Save,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Layers,
  Image as ImageIcon,
  Type,
  Layout,
  RefreshCw,
} from 'lucide-react';
import { StorefrontPage, StorefrontSection } from '@/types/tenant-governance.types';

export default function SuperadminPageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.id as string) || '';
  const pageId = (params?.pageId as string) || '';

  const [page, setPage] = useState<StorefrontPage | null>(null);
  const [sections, setSections] = useState<StorefrontSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!tenantId || !pageId) return;

    fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront/pages/${pageId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) {
          setPage(json.data);
          setSections(json.data.sections || []);
          if (json.data.sections?.length > 0) {
            setSelectedSectionId(json.data.sections[0].id);
          }
        }
      });
  }, [tenantId, pageId]);

  const handleSaveDraft = async () => {
    setSaving(true);
    setStatusMsg('');

    try {
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Draft saved successfully.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublishPage = async () => {
    setPublishing(true);
    setStatusMsg('');

    try {
      // First save draft
      await fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });

      // Then publish
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/storefront/pages/${pageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Page published live to storefront!');
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleAddSection = (type: string) => {
    const newSec: StorefrontSection = {
      id: `sec_${type}_${Date.now()}`,
      type,
      title: type === 'hero' ? 'Luxury Atelier Statement' : type === 'categories-grid' ? 'Explore Collections' : 'Featured Creations',
      subtitle: 'Curated by master craftspeople',
      displayOrder: sections.length + 1,
      isVisible: true,
      settings: {
        primaryCtaText: 'Discover Lookbook',
        primaryCtaLink: '/collections',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop',
      },
    };
    setSections([...sections, newSec]);
    setSelectedSectionId(newSec.id);
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const activeSection = sections.find((s) => s.id === selectedSectionId);

  if (!page) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-zinc-100 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0B0D11] text-zinc-100 flex flex-col antialiased overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800/80 bg-[#101318]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href={`/superadmin/tenants/${tenantId}/storefront`}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront Hub</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">{page.title}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              /{page.slug}
            </span>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700/60 rounded-lg p-0.5">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded transition ${
              previewDevice === 'desktop' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded transition ${
              previewDevice === 'tablet' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded transition ${
              previewDevice === 'mobile' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
              {statusMsg}
            </span>
          )}

          <button
            disabled={saving}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-zinc-400" />}
            <span>Save Draft</span>
          </button>

          <button
            disabled={publishing}
            onClick={handlePublishPage}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {publishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Publish Page</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section Tree Navigator */}
        <aside className="w-64 border-r border-zinc-800/80 bg-[#0E1116] flex flex-col justify-between shrink-0 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sections</span>
              <span className="text-[11px] text-zinc-500">{sections.length} Blocks</span>
            </div>

            <div className="space-y-1">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-2.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                    selectedSectionId === sec.id
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-zinc-500 text-[10px]">{idx + 1}</span>
                    <span className="truncate">{sec.title || sec.type}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(sec.id);
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800/60 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Add Section Block
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleAddSection('hero')}
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 text-left"
                >
                  + Hero Banner
                </button>
                <button
                  onClick={() => handleAddSection('categories-grid')}
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 text-left"
                >
                  + Categories
                </button>
                <button
                  onClick={() => handleAddSection('featured-products')}
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 text-left"
                >
                  + Products
                </button>
                <button
                  onClick={() => handleAddSection('rich-text')}
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 text-left"
                >
                  + Rich Text
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Live Interactive Preview Canvas */}
        <main className="flex-1 bg-[#07090C] overflow-y-auto p-6 flex justify-center">
          <div
            className={`transition-all duration-300 bg-[#FFFDFC] text-[#111111] shadow-2xl rounded-lg overflow-hidden border border-zinc-800 flex flex-col ${
              previewDevice === 'mobile'
                ? 'w-[375px] min-h-[667px]'
                : previewDevice === 'tablet'
                ? 'w-[768px] min-h-[1024px]'
                : 'w-full max-w-5xl min-h-screen'
            }`}
          >
            {sections.length === 0 ? (
              <div className="p-20 text-center text-zinc-400">
                <Layout className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
                <h3 className="font-bold text-zinc-700">No Sections Added</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Add blocks from the left sidebar to start composing this page.
                </p>
              </div>
            ) : (
              sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`relative cursor-pointer transition border-2 ${
                    selectedSectionId === sec.id ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  {sec.type === 'hero' && (
                    <div className="relative py-24 px-8 bg-zinc-900 text-white text-center flex flex-col items-center justify-center overflow-hidden">
                      {sec.settings?.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-35"
                          style={{ backgroundImage: `url(${sec.settings.image})` }}
                        />
                      )}
                      <div className="relative z-10 max-w-2xl space-y-3">
                        <span className="text-[10px] tracking-widest font-mono uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {sec.settings?.badge || 'EXCLUSIVE LOOKBOOK'}
                        </span>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                          {sec.title}
                        </h1>
                        <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                          {sec.subtitle}
                        </p>
                        <div className="pt-2">
                          <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-none">
                            {sec.settings?.primaryCtaText || 'Shop Collection'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {sec.type === 'categories-grid' && (
                    <div className="py-12 px-6 bg-[#FAF6F2] text-center">
                      <h2 className="text-xl font-serif font-bold text-[#111111]">{sec.title}</h2>
                      <p className="text-xs text-zinc-500 mb-6">{sec.subtitle}</p>
                      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {['Couture Silks', 'Evening Co-Ords', 'Festive Anarkalis'].map((cat, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-[#ECE4DE] flex items-center justify-center font-serif font-bold text-xs uppercase text-[#111111] border border-[#E0D4CC]"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sec.type === 'featured-products' && (
                    <div className="py-12 px-6 bg-[#FFFDFC] text-center">
                      <h2 className="text-xl font-serif font-bold text-[#111111]">{sec.title}</h2>
                      <p className="text-xs text-zinc-500 mb-6">{sec.subtitle}</p>
                      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {['Silk Velvet Kurta', 'Banarasi Brocade Gown', 'Artisanal Dupatta'].map(
                          (item, i) => (
                            <div
                              key={i}
                              className="p-4 border border-[#E8DED8] bg-white text-left space-y-2"
                            >
                              <div className="aspect-[3/4] bg-[#F5EFEB]" />
                              <h4 className="font-serif font-bold text-xs text-[#111111]">{item}</h4>
                              <p className="font-mono text-xs font-semibold text-[#B77A68]">
                                $395.00
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {sec.type === 'rich-text' && (
                    <div className="py-12 px-8 max-w-2xl mx-auto text-center space-y-3">
                      <h2 className="text-xl font-serif font-bold text-[#111111]">{sec.title}</h2>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {sec.settings?.content || sec.subtitle}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right: Section Settings Inspector */}
        <aside className="w-72 border-l border-zinc-800/80 bg-[#0E1116] shrink-0 p-5 overflow-y-auto">
          {activeSection ? (
            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
                Inspector: {activeSection.type}
              </span>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Section Title</label>
                <input
                  type="text"
                  value={activeSection.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections(
                      sections.map((s) => (s.id === activeSection.id ? { ...s, title: val } : s))
                    );
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={activeSection.subtitle || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections(
                      sections.map((s) => (s.id === activeSection.id ? { ...s, subtitle: val } : s))
                    );
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              {activeSection.type === 'hero' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Button CTA Text
                    </label>
                    <input
                      type="text"
                      value={activeSection.settings?.primaryCtaText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) =>
                            s.id === activeSection.id
                              ? { ...s, settings: { ...s.settings, primaryCtaText: val } }
                              : s
                          )
                        );
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Background Image URL
                    </label>
                    <input
                      type="text"
                      value={activeSection.settings?.image || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) =>
                            s.id === activeSection.id
                              ? { ...s, settings: { ...s.settings, image: val } }
                              : s
                          )
                        );
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs text-zinc-500">
              Select a section block to inspect and edit its properties.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
