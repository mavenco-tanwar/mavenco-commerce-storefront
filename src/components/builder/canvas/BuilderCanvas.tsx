'use client';

import React, { useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import { CanvasElement } from './CanvasElement';
import { Plus, LayoutTemplate, Layers, Sparkles } from 'lucide-react';

export function BuilderCanvas() {
  const {
    document,
    device,
    isPreview,
    setSelectedElementId,
    addElement,
    setSidebarTab,
  } = useBuilder();

  const [isRootDropOver, setIsRootDropOver] = useState(false);
  const elements = document.content?.children || [];
  const settings = document.content?.settings || {};

  // Viewport widths
  const viewportStyles = {
    desktop: 'w-full max-w-full',
    tablet: 'w-[768px] my-6 shadow-2xl rounded-lg border border-zinc-700/50',
    mobile: 'w-[375px] my-6 shadow-2xl rounded-2xl border-4 border-zinc-800',
  }[device];

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRootDropOver(true);
  };

  const handleRootDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsRootDropOver(false);
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRootDropOver(false);

    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      if (payload.type === 'NEW_ELEMENT') {
        addElement(payload.elementType, null, 'inside');
      }
    } catch {}
  };

  return (
    <div
      onClick={() => setSelectedElementId(null)}
      className="flex-1 bg-[#1A1D24] overflow-y-auto overflow-x-hidden p-4 md:p-8 flex justify-center items-start min-h-[calc(100vh-64px)] relative"
    >
      <div
        onDragOver={handleRootDragOver}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
        style={{
          backgroundColor: settings.backgroundColor || settings.background || '#FFFDFC',
          fontFamily: settings.fontFamily || undefined,
          color: settings.textColor || undefined,
        }}
        className={`bg-[#FFFDFC] text-stone-900 min-h-[85vh] transition-all duration-300 relative flex flex-col ${viewportStyles}`}
      >
        {/* Scoped CSS */}
        {settings.customCss && (
          <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        )}

        {/* Empty Canvas Starter Banner */}
        {elements.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              Start Crafting Your Page
            </h3>
            <p className="text-xs text-stone-500 max-w-md mb-6 leading-relaxed">
              Drag elements from the left panel onto this canvas, or choose a pre-designed template from our library to get started quickly.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => addElement('section')}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Section</span>
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab('templates')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center gap-2 border border-stone-300"
              >
                <LayoutTemplate className="w-4 h-4" />
                <span>Explore Templates</span>
              </button>
            </div>
          </div>
        ) : (
          elements.map((child, idx) => (
            <CanvasElement
              key={child.id}
              element={child}
              index={idx}
              totalSiblings={elements.length}
            />
          ))
        )}

        {/* Bottom Root Drop Zone */}
        {elements.length > 0 && !isPreview && (
          <div
            onDragOver={handleRootDragOver}
            onDragLeave={handleRootDragLeave}
            onDrop={handleRootDrop}
            onClick={(e) => {
              e.stopPropagation();
              addElement('section');
            }}
            className={`py-6 my-4 mx-6 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition ${
              isRootDropOver
                ? 'border-amber-500 bg-amber-50 text-amber-700 shadow'
                : 'border-stone-300/80 text-stone-500 hover:border-stone-400 hover:bg-stone-50'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Drop new section here or click to add</span>
          </div>
        )}
      </div>
    </div>
  );
}
