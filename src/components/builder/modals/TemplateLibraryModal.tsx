'use client';

import React, { useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import { SYSTEM_TEMPLATES } from '@/lib/builder/template-presets';
import { PageTemplate } from '@/types/builder.types';
import { X, LayoutTemplate, Check, Sparkles, ArrowRight } from 'lucide-react';

export function TemplateLibraryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { loadTemplateContent } = useBuilder();
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(SYSTEM_TEMPLATES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Fashion', 'Furniture', 'Electronics', 'Jewelry'];
  const filtered = SYSTEM_TEMPLATES.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory
  );

  const handleApply = () => {
    if (!selectedTemplate) return;
    if (confirm('Applying this template will replace current canvas content. Continue?')) {
      loadTemplateContent(selectedTemplate.content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-[#14181F] text-zinc-100 border border-zinc-700/60 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm text-zinc-100">Template Library</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category bar */}
        <div className="px-6 py-3 border-b border-zinc-800 flex gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                activeCategory === cat
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((tmpl) => {
            const isSelected = selectedTemplate?.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`group border rounded-xl overflow-hidden cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/20 bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="aspect-[16/9] bg-zinc-950 overflow-hidden relative">
                  <img
                    src={tmpl.thumbnailUrl}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
                    {tmpl.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-zinc-100">{tmpl.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Selected: <b className="text-zinc-200">{selectedTemplate?.name || 'None'}</b>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedTemplate}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Insert Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
