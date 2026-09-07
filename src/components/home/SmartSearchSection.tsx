'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, TrendingUp } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

interface SmartSearchSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  placeholder?: string;
  showFilters?: boolean;
  showAutocomplete?: boolean;
  showRecommendations?: boolean;
  tenantSlug?: string;
}

const POPULAR_TAGS = [
  'Chanderi Silk Sarees',
  'Embroidered Anarkali',
  'Cotton Midi Dresses',
  'Kids Party Frocks',
  'Festive Kurti Sets',
  'Organza Dupattas',
];

const FILTER_PILLS = [
  { label: 'All Atelier', query: '' },
  { label: 'Women', query: 'women' },
  { label: 'Kids', query: 'kids' },
  { label: 'Dresses', query: 'dresses' },
  { label: 'Silk & Sarees', query: 'saree' },
  { label: 'Festive', query: 'festive' },
];

export function SmartSearchSection({
  customTitle = 'Smart Search & Atelier Discovery',
  customSubtitle = 'Find your perfect ensemble with real-time filters and curated boutique recommendations.',
  customBadge = 'AI-POWERED SEARCH',
  placeholder = 'Search by garment, fabric, color, or silhouette...',
  showFilters = true,
  showAutocomplete = true,
  showRecommendations = true,
  tenantSlug,
}: SmartSearchSectionProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() && !selectedFilter) return;
    const query = searchTerm.trim() || selectedFilter;
    router.push(formatTenantHref(`/search?q=${encodeURIComponent(query)}`, tenantSlug));
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    router.push(formatTenantHref(`/search?q=${encodeURIComponent(tag)}`, tenantSlug));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="bg-[#FAF6F2] border border-[#E8DED8] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm text-center space-y-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8DED8] rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#777777] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-white border border-[#E8DED8] focus-within:border-[#B77A68] rounded-full shadow-xs transition-all p-1.5 sm:p-2">
            <div className="pl-3 sm:pl-4 pr-2 text-[#777777]">
              <Search className="w-5 h-5 text-[#B77A68]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] bg-transparent outline-hidden font-sans pr-2"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold rounded-full shadow-sm transition-all whitespace-nowrap"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3 text-[#B77A68]" />
              Departments:
            </span>
            {FILTER_PILLS.map((pill) => {
              const active = selectedFilter === pill.query;
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(active ? '' : pill.query);
                    if (pill.query) {
                      router.push(formatTenantHref(`/search?q=${encodeURIComponent(pill.query)}`, tenantSlug));
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#B77A68] text-white shadow-xs'
                      : 'bg-white border border-[#E8DED8] text-[#444444] hover:border-[#B77A68] hover:text-[#111111]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        )}

        {/* AI Recommendations / Trending Tags */}
        {showRecommendations && (
          <div className="pt-2 border-t border-[#E8DED8]/60 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-[11px] text-[#777777] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#B77A68]" />
              Trending:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="text-xs text-[#555555] hover:text-[#111111] hover:underline decoration-[#B77A68] underline-offset-4 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
