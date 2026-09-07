'use client';

import React, { useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import {
  getElementsByCategory,
  getAllElementDefinitions,
} from '@/lib/builder/registry';
import { ElementCategory, ElementDefinition } from '@/types/builder.types';
import {
  Search,
  Layout,
  Box,
  Columns,
  Split,
  MoveVertical,
  Minus,
  Heading,
  AlignLeft,
  FileText,
  RectangleHorizontal,
  Sparkles,
  Image as ImageIcon,
  Video,
  Grid3X3,
  SlidersHorizontal,
  ShieldCheck,
  ListCollapse,
  Folders,
  MessageSquareQuote,
  CreditCard,
  HelpCircle,
  Mail,
  Grid,
  ShoppingBag,
  Heading1,
  DollarSign,
  Star,
  ShoppingCart,
  LayoutGrid,
  Folder,
  Sliders,
  GitFork,
  Filter,
  PanelTop,
  Menu,
  ChevronRight,
  PanelBottom,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Layout,
  Box,
  Columns,
  Split,
  MoveVertical,
  Minus,
  Heading,
  AlignLeft,
  FileText,
  RectangleHorizontal,
  Sparkles,
  Image: ImageIcon,
  Video,
  Grid3X3,
  SlidersHorizontal,
  ShieldCheck,
  ListCollapse,
  Folders,
  MessageSquareQuote,
  CreditCard,
  HelpCircle,
  Mail,
  Grid,
  ShoppingBag,
  Heading1,
  DollarSign,
  Star,
  ShoppingCart,
  LayoutGrid,
  Folder,
  Sliders,
  GitFork,
  Search,
  Filter,
  PanelTop,
  Menu,
  ChevronRight,
  PanelBottom,
};

export function ElementPanel() {
  const { addElement } = useBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ElementCategory | 'All'>('All');

  const categories = getElementsByCategory();
  const allElements = getAllElementDefinitions();

  // Filter elements based on search and category
  const filteredElements = allElements.filter((def) => {
    const matchesSearch =
      !searchTerm ||
      def.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || def.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ type: 'NEW_ELEMENT', elementType })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col bg-[#111317] text-zinc-100 border-r border-zinc-800/80 select-none">
      {/* Search Header */}
      <div className="p-3.5 border-b border-zinc-800/80 space-y-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 40+ widgets..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {(['All', 'Layout', 'Basic', 'Media', 'Content', 'Ecommerce', 'Navigation'] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-black font-semibold'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Widget Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
        {activeCategory === 'All' && !searchTerm ? (
          // Grouped by Category View
          Object.entries(categories).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block px-1">
                {categoryName}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {items.map((def) => {
                  const IconComp = ICON_MAP[def.icon] || Box;
                  return (
                    <div
                      key={def.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, def.type)}
                      onClick={() => addElement(def.type)}
                      className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-400/80 hover:bg-zinc-800 transition flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing group shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-md bg-zinc-800 group-hover:bg-amber-400/20 text-zinc-300 group-hover:text-amber-400 flex items-center justify-center mb-1.5 transition">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-200 group-hover:text-white line-clamp-1">
                        {def.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          // Filtered Search Results
          <div>
            <span className="text-[11px] text-zinc-400 block px-1 mb-2">
              Showing {filteredElements.length} widgets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {filteredElements.map((def) => {
                const IconComp = ICON_MAP[def.icon] || Box;
                return (
                  <div
                    key={def.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, def.type)}
                    onClick={() => addElement(def.type)}
                    className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-400/80 hover:bg-zinc-800 transition flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-md bg-zinc-800 group-hover:bg-amber-400/20 text-zinc-300 group-hover:text-amber-400 flex items-center justify-center mb-1.5 transition">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-200 group-hover:text-white line-clamp-1">
                      {def.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
