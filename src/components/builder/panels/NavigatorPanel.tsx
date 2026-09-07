'use client';

import React, { useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import { PageBuilderElement } from '@/types/builder.types';
import { getElementDefinition } from '@/lib/builder/registry';
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Box,
} from 'lucide-react';

export function NavigatorPanel() {
  const { document, selectedElementId, setSelectedElementId } = useBuilder();
  const elements = document.content?.children || [];

  return (
    <div className="h-full flex flex-col bg-[#111317] text-zinc-100 border-r border-zinc-800/80 select-none">
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-xs text-zinc-200">DOM Navigator</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          {elements.length} root sections
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {elements.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            No elements on the canvas yet.
          </div>
        ) : (
          elements.map((el) => (
            <NavigatorTreeItem
              key={el.id}
              element={el}
              depth={0}
              selectedId={selectedElementId}
              onSelect={setSelectedElementId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NavigatorTreeItem({
  element,
  depth,
  selectedId,
  onSelect,
}: {
  element: PageBuilderElement;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { deleteElement, duplicateElement } = useBuilder();
  const [isOpen, setIsOpen] = useState(true);
  const def = getElementDefinition(element.type);
  const hasChildren = element.children && element.children.length > 0;
  const isSelected = selectedId === element.id;

  return (
    <div className="space-y-0.5 text-xs">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(element.id);
        }}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-md cursor-pointer transition ${
          isSelected
            ? 'bg-amber-500/20 text-amber-300 font-medium'
            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-0.5 text-zinc-400 hover:text-zinc-200"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5 inline-block" />
          )}

          <Box className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">{element.label || def?.label || element.type}</span>
        </div>

        {/* Quick Actions on Hover */}
        <div className="hidden group-hover:flex items-center gap-1 text-zinc-400">
          <button
            type="button"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              duplicateElement(element.id);
            }}
            className="p-1 hover:text-zinc-100"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(element.id);
            }}
            className="p-1 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {element.children!.map((child) => (
            <NavigatorTreeItem
              key={child.id}
              element={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
