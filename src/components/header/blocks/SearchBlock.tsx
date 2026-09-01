'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { SearchOverlay } from '@/components/layout/SearchOverlay';

interface SearchBlockProps {
  block: HeaderBlock;
  accentColor?: string;
  onOpenSearch?: () => void;
}

export function SearchBlock({ block, accentColor = '#E11D48', onOpenSearch }: SearchBlockProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const s = block.settings || {};
  const mode = s.mode || 'icon-label'; // 'icon-only' | 'icon-label' | 'inline'
  const label = s.label || 'SEARCH';
  const placeholder = s.placeholder || 'Search our catalogue...';

  const handleTrigger = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      setIsOverlayOpen(true);
    }
  };

  if (mode === 'inline') {
    return (
      <div className="relative flex items-center min-w-[200px] max-w-xs select-none">
        <input
          type="text"
          placeholder={placeholder}
          onClick={handleTrigger}
          readOnly
          className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slate-300/80 bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all cursor-pointer"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        {isOverlayOpen && <SearchOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleTrigger}
        aria-label="Open Search"
        className="flex items-center gap-1.5 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider uppercase cursor-pointer select-none group focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: block.styles?.textColor || 'inherit' }}
      >
        <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
        {mode === 'icon-label' && <span>{label}</span>}
      </button>

      {isOverlayOpen && <SearchOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />}
    </>
  );
}
