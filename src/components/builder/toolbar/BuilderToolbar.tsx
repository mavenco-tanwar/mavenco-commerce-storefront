'use client';

import React from 'react';
import Link from 'next/link';
import { useBuilder } from '@/lib/builder/builder-state';
import { ResponsiveDevice } from '@/types/builder.types';
import {
  Undo,
  Redo,
  Eye,
  EyeOff,
  Save,
  Send,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  LayoutTemplate,
  Sparkles,
  Layers,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Component,
} from 'lucide-react';

export interface BuilderToolbarProps {
  onOpenTemplates?: () => void;
  onOpenGlobalStyles?: () => void;
  onOpenVersions?: () => void;
  onOpenComponents?: () => void;
}

export function BuilderToolbar({
  onOpenTemplates,
  onOpenGlobalStyles,
  onOpenVersions,
  onOpenComponents,
}: BuilderToolbarProps) {
  const {
    document,
    device,
    setDevice,
    isPreview,
    setIsPreview,
    canUndo,
    canRedo,
    undo,
    redo,
    saveStatus,
    saveDraft,
    publishPage,
    sidebarTab,
    setSidebarTab,
  } = useBuilder();

  return (
    <header className="h-14 bg-[#111317] border-b border-zinc-800/80 px-4 flex items-center justify-between text-zinc-100 select-none sticky top-0 z-40">
      {/* Left: Back to Admin, Page Title & Navigator Toggle */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pages"
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
          title="Exit to Pages Manager"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
          <span className="font-semibold text-xs text-zinc-100 max-w-[140px] md:max-w-[220px] truncate">
            {document.title || 'Untitled Page'}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold ${
              document.status === 'published'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                : 'bg-amber-950 text-amber-400 border border-amber-800/50'
            }`}
          >
            {document.status}
          </span>
        </div>

        {/* Sidebar Tabs Switcher */}
        <div className="hidden lg:flex items-center bg-zinc-900 rounded-md p-0.5 border border-zinc-700/60 ml-2">
          <button
            type="button"
            onClick={() => setSidebarTab('elements')}
            className={`px-2.5 py-1 text-xs rounded transition flex items-center gap-1.5 ${
              sidebarTab === 'elements' ? 'bg-amber-400 text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Widgets</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('navigator')}
            className={`px-2.5 py-1 text-xs rounded transition flex items-center gap-1.5 ${
              sidebarTab === 'navigator' ? 'bg-amber-400 text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Navigator</span>
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Switcher & Undo/Redo */}
      <div className="flex items-center gap-4">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-zinc-900 rounded-md p-0.5 border border-zinc-700/60">
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            className={`p-1.5 rounded transition ${
              canUndo ? 'hover:bg-zinc-800 text-zinc-300' : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Undo (Cmd+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            className={`p-1.5 rounded transition ${
              canRedo ? 'hover:bg-zinc-800 text-zinc-300' : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Viewport Toggle */}
        <div className="flex items-center bg-zinc-900 rounded-md p-0.5 border border-zinc-700/60">
          {(['desktop', 'tablet', 'mobile'] as ResponsiveDevice[]).map((dev) => {
            const Icon = dev === 'desktop' ? Monitor : dev === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={dev}
                type="button"
                onClick={() => setDevice(dev)}
                className={`p-1.5 rounded transition flex items-center gap-1 text-xs ${
                  device === dev ? 'bg-amber-400 text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
                title={`Preview ${dev}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Preview Clean Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`p-1.5 rounded-md border transition flex items-center gap-1.5 text-xs ${
            isPreview
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
              : 'bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:text-white'
          }`}
          title="Toggle Clean Preview Mode"
        >
          {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isPreview ? 'Edit Mode' : 'Preview'}</span>
        </button>
      </div>

      {/* Right: Modals (Templates, Components, Versions) & Save/Publish */}
      <div className="flex items-center gap-3">
        {/* Templates Modal Trigger */}
        {onOpenTemplates && (
          <button
            type="button"
            onClick={onOpenTemplates}
            className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition"
            title="Pre-built Page Templates"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
          </button>
        )}

        {/* Reusable Components Trigger */}
        {onOpenComponents && (
          <button
            type="button"
            onClick={onOpenComponents}
            className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition"
            title="Reusable Components"
          >
            <Component className="w-3.5 h-3.5 text-amber-400" />
            <span>Components</span>
          </button>
        )}

        {/* Version History Trigger */}
        {onOpenVersions && (
          <button
            type="button"
            onClick={onOpenVersions}
            className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition"
            title="Page Version History"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>v{document.version || 1}</span>
          </button>
        )}

        {/* Autosave Status Badge */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-zinc-400">
          {saveStatus === 'saving' && (
            <>
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>All changes saved</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-red-400" />
              <span>Save error</span>
            </>
          )}
        </div>

        {/* Live Storefront Link */}
        <Link
          href={`/${document.slug.replace(/^\//, '')}`}
          target="_blank"
          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          title="Open Live Storefront Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={() => saveDraft()}
          disabled={saveStatus === 'saving'}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-700/60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>

        {/* Publish Live Button */}
        <button
          type="button"
          onClick={() => publishPage()}
          disabled={saveStatus === 'saving'}
          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black rounded-md text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}
