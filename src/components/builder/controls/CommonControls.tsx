'use client';

import React, { useState } from 'react';
import { Database, Link as LinkIcon, Unlink, Sparkles } from 'lucide-react';

// ── Text Control ──
export function TextControl({
  label,
  value,
  onChange,
  placeholder = '',
  allowDynamic = true,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  allowDynamic?: boolean;
}) {
  const [showDynamicMenu, setShowDynamicMenu] = useState(false);

  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between items-center text-zinc-400 font-medium">
        <span>{label}</span>
        {allowDynamic && (
          <button
            type="button"
            onClick={() => setShowDynamicMenu(!showDynamicMenu)}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
            title="Insert Dynamic Data Binding"
          >
            <Database className="w-3 h-3" />
            <span>Dynamic</span>
          </button>
        )}
      </div>

      {showDynamicMenu && (
        <div className="p-2 bg-zinc-900 border border-amber-500/30 rounded-md space-y-1 animate-in fade-in zoom-in-95 duration-100">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 block mb-1">
            Pick Dynamic Value:
          </span>
          {[
            { label: 'Product Title', token: '{{ product.name }}' },
            { label: 'Product Price', token: '{{ product.price }}' },
            { label: 'Product Description', token: '{{ product.description }}' },
            { label: 'Product Image', token: '{{ product.image }}' },
            { label: 'Category Name', token: '{{ category.name }}' },
            { label: 'Store Name', token: '{{ store.name }}' },
            { label: 'Store Email', token: '{{ store.email }}' },
          ].map((item) => (
            <button
              key={item.token}
              type="button"
              onClick={() => {
                onChange(item.token);
                setShowDynamicMenu(false);
              }}
              className="w-full text-left px-2 py-1 rounded text-[11px] text-zinc-200 hover:bg-zinc-800 hover:text-amber-300 transition"
            >
              {item.label} <code className="text-[9px] text-zinc-500 ml-1">{item.token}</code>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
      />
    </div>
  );
}

// ── Number Control ──
export function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'px',
}: {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value || 0;

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-400 font-medium">{label}</span>
      <div className="flex items-center gap-1.5 w-28">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={num}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-right text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
        />
        {unit && <span className="text-[10px] text-zinc-500 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

// ── Select Control ──
export function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-400 font-medium">{label}</span>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-xs text-zinc-100 focus:outline-none focus:border-amber-400 w-36 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Toggle Control ──
export function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-400 font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
          checked ? 'bg-amber-400' : 'bg-zinc-700'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-black shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// ── Color Control (with Theme presets) ──
export function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const themePresets = [
    { label: 'Primary', val: 'var(--theme-color-primary, #111111)' },
    { label: 'Accent', val: 'var(--theme-color-accent, #B77A68)' },
    { label: 'Background', val: 'var(--theme-color-background, #FFFDFC)' },
    { label: 'Text', val: 'var(--theme-color-text, #111111)' },
    { label: 'White', val: '#FFFFFF' },
    { label: 'Black', val: '#000000' },
  ];

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between items-center text-zinc-400 font-medium">
        <span>{label}</span>
        <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">{value || 'Default'}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value?.startsWith('#') ? value : '#111111'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000 or var(...)"
          className="flex-1 px-2 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
        />
      </div>
      {/* Theme Presets */}
      <div className="flex gap-1.5 pt-1">
        {themePresets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.val)}
            className="text-[10px] px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700/40"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Spacing Control (4 sides, Margin or Padding) ──
export function SpacingControl({
  label,
  top,
  right,
  bottom,
  left,
  onChange,
}: {
  label: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  onChange: (vals: { top: string; right: string; bottom: string; left: string }) => void;
}) {
  const [isLinked, setIsLinked] = useState(true);

  const cleanNum = (val?: string) => (val ? val.replace('px', '') : '0');

  const handleAllChange = (val: string) => {
    onChange({
      top: `${val}px`,
      right: `${val}px`,
      bottom: `${val}px`,
      left: `${val}px`,
    });
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between items-center text-zinc-400 font-medium">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => setIsLinked(!isLinked)}
          className={`p-1 rounded ${isLinked ? 'text-amber-400' : 'text-zinc-500'}`}
          title={isLinked ? 'Unlink sides' : 'Link sides together'}
        >
          {isLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center">
        <div>
          <input
            type="text"
            value={cleanNum(top)}
            onChange={(e) => {
              if (isLinked) handleAllChange(e.target.value);
              else
                onChange({
                  top: `${e.target.value}px`,
                  right: right || '0px',
                  bottom: bottom || '0px',
                  left: left || '0px',
                });
            }}
            className="w-full px-1 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-center text-xs text-zinc-100"
          />
          <span className="text-[10px] text-zinc-500 block mt-0.5">Top</span>
        </div>
        <div>
          <input
            type="text"
            value={cleanNum(right)}
            onChange={(e) => {
              if (isLinked) handleAllChange(e.target.value);
              else
                onChange({
                  top: top || '0px',
                  right: `${e.target.value}px`,
                  bottom: bottom || '0px',
                  left: left || '0px',
                });
            }}
            className="w-full px-1 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-center text-xs text-zinc-100"
          />
          <span className="text-[10px] text-zinc-500 block mt-0.5">Right</span>
        </div>
        <div>
          <input
            type="text"
            value={cleanNum(bottom)}
            onChange={(e) => {
              if (isLinked) handleAllChange(e.target.value);
              else
                onChange({
                  top: top || '0px',
                  right: right || '0px',
                  bottom: `${e.target.value}px`,
                  left: left || '0px',
                });
            }}
            className="w-full px-1 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-center text-xs text-zinc-100"
          />
          <span className="text-[10px] text-zinc-500 block mt-0.5">Bottom</span>
        </div>
        <div>
          <input
            type="text"
            value={cleanNum(left)}
            onChange={(e) => {
              if (isLinked) handleAllChange(e.target.value);
              else
                onChange({
                  top: top || '0px',
                  right: right || '0px',
                  bottom: bottom || '0px',
                  left: `${e.target.value}px`,
                });
            }}
            className="w-full px-1 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-center text-xs text-zinc-100"
          />
          <span className="text-[10px] text-zinc-500 block mt-0.5">Left</span>
        </div>
      </div>
    </div>
  );
}
