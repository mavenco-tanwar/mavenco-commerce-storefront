'use client';

import React, { useState } from 'react';
import { PageBuilderElement } from '@/types/builder.types';
import { useBuilder } from '@/lib/builder/builder-state';
import { canAcceptChild, getElementDefinition } from '@/lib/builder/registry';
import {
  ELEMENT_RENDERER_REGISTRY,
  RendererContext,
} from '../renderer/ElementRenderers';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Move,
  Plus,
  Sliders,
  Sparkles,
  ClipboardPaste,
} from 'lucide-react';

export interface CanvasElementProps {
  element: PageBuilderElement;
  parentContainerId?: string;
  index: number;
  totalSiblings: number;
}

export function CanvasElement({
  element,
  parentContainerId,
  index,
  totalSiblings,
}: CanvasElementProps) {
  const {
    selectedElementId,
    hoveredElementId,
    device,
    setSelectedElementId,
    setHoveredElementId,
    deleteElement,
    duplicateElement,
    copyElement,
    pasteElement,
    clipboard,
    setSettingsTab,
    addElement,
    moveElement,
  } = useBuilder();

  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id && !isSelected;
  const def = getElementDefinition(element.type);
  const isContainer = Boolean(def?.isContainer);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredElementId(element.id);
  };

  const handleMouseLeave = () => {
    setHoveredElementId(null);
  };

  // Drag-and-drop event handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'EXISTING_ELEMENT', id: element.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;

    if (isContainer && relY > rect.height * 0.25 && relY < rect.height * 0.75) {
      setDropPosition('inside');
    } else if (relY < rect.height * 0.5) {
      setDropPosition('before');
    } else {
      setDropPosition('after');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentDropPos = dropPosition || 'after';
    setDropPosition(null);

    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);

      if (payload.type === 'NEW_ELEMENT') {
        // Drop new widget from sidebar
        if (currentDropPos === 'inside' && isContainer) {
          addElement(payload.elementType, element.id, 'inside');
        } else {
          addElement(payload.elementType, element.id, currentDropPos);
        }
      } else if (payload.type === 'EXISTING_ELEMENT') {
        // Move existing element
        if (payload.id !== element.id) {
          if (currentDropPos === 'inside' && isContainer) {
            moveElement(payload.id, element.id, 'inside');
          } else {
            moveElement(payload.id, element.id, currentDropPos);
          }
        }
      }
    } catch {}
  };

  // Build element context
  const context: RendererContext = {
    device,
    isEditor: true,
    renderChildElements: (children?: PageBuilderElement[]) => {
      if (!children || children.length === 0) {
        if (isContainer) {
          return (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const raw = e.dataTransfer.getData('text/plain');
                if (raw) {
                  try {
                    const p = JSON.parse(raw);
                    if (p.type === 'NEW_ELEMENT') addElement(p.elementType, element.id, 'inside');
                    if (p.type === 'EXISTING_ELEMENT') moveElement(p.id, element.id, 'inside');
                  } catch {}
                }
              }}
              className="py-6 px-4 border border-dashed border-zinc-400/60 rounded-lg text-center text-xs text-zinc-400 bg-zinc-500/5 hover:border-amber-400 hover:text-amber-500 transition cursor-pointer my-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElementId(element.id);
              }}
            >
              <Plus className="w-4 h-4 mx-auto mb-1 opacity-70" />
              <span>Empty {def?.label || 'Container'} — Drop widgets here</span>
            </div>
          );
        }
        return null;
      }

      return children.map((child, i) => (
        <CanvasElement
          key={child.id}
          element={child}
          parentContainerId={element.id}
          index={i}
          totalSiblings={children.length}
        />
      ));
    },
  };

  const RendererComponent = ELEMENT_RENDERER_REGISTRY[element.type];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group/canvas transition-all ${
        isSelected
          ? 'ring-2 ring-amber-500 ring-offset-1 z-20'
          : isHovered
          ? 'ring-1 ring-blue-400 z-10'
          : ''
      }`}
    >
      {/* Visual Drop Indicators */}
      {dropPosition === 'before' && (
        <div className="absolute -top-1.5 inset-x-0 h-1 bg-amber-500 z-30 rounded-full shadow" />
      )}
      {dropPosition === 'after' && (
        <div className="absolute -bottom-1.5 inset-x-0 h-1 bg-amber-500 z-30 rounded-full shadow" />
      )}
      {dropPosition === 'inside' && isContainer && (
        <div className="absolute inset-0 border-2 border-dashed border-emerald-500 bg-emerald-500/10 z-20 pointer-events-none rounded" />
      )}

      {/* Selected Action Bar */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-8 left-0 z-40 bg-zinc-900 text-white rounded shadow-lg px-2 py-1 flex items-center gap-1 text-[11px] font-sans select-none border border-zinc-700 animate-in fade-in zoom-in-95 duration-100"
        >
          <span className="font-semibold text-amber-400 px-1 border-r border-zinc-700">
            {def?.label || element.type}
          </span>

          {/* Move Up */}
          {index > 0 && (
            <button
              type="button"
              title="Move Up"
              onClick={() => {
                // Find previous sibling
                moveElement(element.id, element.id, 'before');
              }}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move Down */}
          {index < totalSiblings - 1 && (
            <button
              type="button"
              title="Move Down"
              onClick={() => {
                moveElement(element.id, element.id, 'after');
              }}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Duplicate */}
          <button
            type="button"
            title="Duplicate (Cmd+D)"
            onClick={() => duplicateElement(element.id)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Copy */}
          <button
            type="button"
            title="Copy Element (Cmd+C)"
            onClick={() => copyElement(element.id)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Paste */}
          {clipboard?.type === 'element' && (
            <button
              type="button"
              title="Paste Next"
              onClick={() => pasteElement(element.id, 'after')}
              className="p-1 hover:bg-zinc-800 rounded text-emerald-400 hover:text-emerald-300"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit Settings Tab */}
          <button
            type="button"
            title="Settings"
            onClick={() => setSettingsTab('content')}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            title="Delete (Del)"
            onClick={() => deleteElement(element.id)}
            className="p-1 hover:bg-red-900/60 rounded text-red-400 hover:text-red-300 ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Render Component */}
      {RendererComponent ? (
        <RendererComponent element={element} context={context} />
      ) : (
        <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-xs">
          Unknown: {element.type}
        </div>
      )}
    </div>
  );
}
