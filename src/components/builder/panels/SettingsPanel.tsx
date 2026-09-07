'use client';

import React from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import {
  ColorControl,
  NumberControl,
  SelectControl,
  SpacingControl,
  TextControl,
  ToggleControl,
} from '../controls/CommonControls';
import {
  Sliders,
  Palette,
  Layout,
  Code,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Info,
  Trash2,
  Copy,
} from 'lucide-react';
import { ResponsiveDevice } from '@/types/builder.types';

export function SettingsPanel() {
  const {
    selectedElement,
    settingsTab,
    setSettingsTab,
    device,
    setDevice,
    updateElementProps,
    updateElementStyles,
    updateElementAdvanced,
    deleteElement,
    duplicateElement,
    document,
    updatePageSettings,
    updatePageMeta,
  } = useBuilder();

  // If no element is selected, show Page Global Settings
  if (!selectedElement) {
    const pageSettings = document.content?.settings || {};
    return (
      <div className="h-full flex flex-col bg-[#111317] text-zinc-100 border-l border-zinc-800/80 select-none overflow-y-auto">
        <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-xs text-zinc-200">Page Settings</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase font-mono">Global</span>
        </div>

        <div className="p-4 space-y-5">
          <TextControl
            label="Page Title"
            value={document.title}
            onChange={(val) => updatePageMeta({ title: val })}
            allowDynamic={false}
          />

          <TextControl
            label="Page Slug"
            value={document.slug}
            onChange={(val) => updatePageMeta({ slug: val })}
            allowDynamic={false}
          />

          <div className="border-t border-zinc-800/80 pt-4 space-y-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block">
              Layout & Appearance
            </span>

            <ColorControl
              label="Canvas Background"
              value={pageSettings.backgroundColor || pageSettings.background || '#FFFDFC'}
              onChange={(val) => updatePageSettings({ backgroundColor: val, background: val })}
            />

            <SelectControl
              label="Default Font"
              value={pageSettings.fontFamily || 'serif'}
              onChange={(val) => updatePageSettings({ fontFamily: val })}
              options={[
                { label: 'Playfair Display (Serif)', value: 'var(--theme-font-heading, "Playfair Display", serif)' },
                { label: 'Plus Jakarta Sans (Modern Sans)', value: 'var(--theme-font-body, "Plus Jakarta Sans", sans-serif)' },
                { label: 'Cinzel (Luxury Formal)', value: '"Cinzel", serif' },
                { label: 'System Default', value: 'system-ui, sans-serif' },
              ]}
            />
          </div>

          <div className="border-t border-zinc-800/80 pt-4 space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block">
              Custom Scoped CSS
            </span>
            <textarea
              rows={4}
              value={pageSettings.customCss || ''}
              onChange={(e) => updatePageSettings({ customCss: e.target.value })}
              placeholder=".page-builder-output h2 { letter-spacing: 0.05em; }"
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>
    );
  }

  const currentStyles = selectedElement.styles?.[device] || {};
  const props = selectedElement.props || {};
  const advanced = selectedElement.advanced || {};

  return (
    <div className="h-full flex flex-col bg-[#111317] text-zinc-100 border-l border-zinc-800/80 select-none">
      {/* Header with Title and Device Indicator */}
      <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-semibold text-xs text-amber-400 truncate">
            {selectedElement.label || selectedElement.type}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            #{selectedElement.id.slice(-5)}
          </span>
        </div>

        {/* Viewport device selector inside settings */}
        <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-zinc-700/60">
          {(['desktop', 'tablet', 'mobile'] as ResponsiveDevice[]).map((dev) => {
            const Icon = dev === 'desktop' ? Monitor : dev === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={dev}
                type="button"
                onClick={() => setDevice(dev)}
                className={`p-1 rounded ${
                  device === dev ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
                title={`Edit for ${dev}`}
              >
                <Icon className="w-3 h-3" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800/80 text-[11px]">
        {(['content', 'style', 'layout', 'advanced', 'responsive'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSettingsTab(tab)}
            className={`flex-1 py-2 text-center capitalize font-medium transition border-b-2 ${
              settingsTab === tab
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ── CONTENT TAB ── */}
        {settingsTab === 'content' && (
          <div className="space-y-4">
            {/* Heading text */}
            {selectedElement.type === 'heading' && (
              <>
                <TextControl
                  label="Title Text"
                  value={props.text}
                  onChange={(val) => updateElementProps(selectedElement.id, { text: val })}
                />
                <SelectControl
                  label="HTML Tag"
                  value={props.tag || 'h2'}
                  onChange={(val) => updateElementProps(selectedElement.id, { tag: val })}
                  options={[
                    { label: 'H1', value: 'h1' },
                    { label: 'H2', value: 'h2' },
                    { label: 'H3', value: 'h3' },
                    { label: 'H4', value: 'h4' },
                    { label: 'H5', value: 'h5' },
                    { label: 'H6', value: 'h6' },
                  ]}
                />
                <TextControl
                  label="Link URL"
                  value={props.link || ''}
                  onChange={(val) => updateElementProps(selectedElement.id, { link: val })}
                  placeholder="/collections/sale"
                />
              </>
            )}

            {/* Paragraph / Text */}
            {selectedElement.type === 'text' && (
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 font-medium">Text Content</span>
                <textarea
                  rows={4}
                  value={props.text || ''}
                  onChange={(e) => updateElementProps(selectedElement.id, { text: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Button */}
            {selectedElement.type === 'button' && (
              <>
                <TextControl
                  label="Button Text"
                  value={props.text}
                  onChange={(val) => updateElementProps(selectedElement.id, { text: val })}
                />
                <TextControl
                  label="Button Link"
                  value={props.link}
                  onChange={(val) => updateElementProps(selectedElement.id, { link: val })}
                  placeholder="/women"
                />
                <SelectControl
                  label="Icon Position"
                  value={props.iconPosition || 'right'}
                  onChange={(val) => updateElementProps(selectedElement.id, { iconPosition: val })}
                  options={[
                    { label: 'None', value: 'none' },
                    { label: 'Right', value: 'right' },
                    { label: 'Left', value: 'left' },
                  ]}
                />
              </>
            )}

            {/* Image */}
            {selectedElement.type === 'image' && (
              <>
                <TextControl
                  label="Image URL"
                  value={props.src}
                  onChange={(val) => updateElementProps(selectedElement.id, { src: val })}
                />
                <TextControl
                  label="Alt Text (SEO & A11y)"
                  value={props.alt}
                  onChange={(val) => updateElementProps(selectedElement.id, { alt: val })}
                />
                <TextControl
                  label="Link URL (Optional)"
                  value={props.link || ''}
                  onChange={(val) => updateElementProps(selectedElement.id, { link: val })}
                />
              </>
            )}

            {/* Product Grid */}
            {selectedElement.type === 'product-grid' && (
              <>
                <NumberControl
                  label="Products Limit"
                  value={props.limit || 8}
                  onChange={(val) => updateElementProps(selectedElement.id, { limit: val })}
                  min={1}
                  max={24}
                  unit="items"
                />
                <NumberControl
                  label="Columns Count"
                  value={props.columns || 4}
                  onChange={(val) => updateElementProps(selectedElement.id, { columns: val })}
                  min={1}
                  max={6}
                  unit="cols"
                />
                <SelectControl
                  label="Sort By"
                  value={props.sortBy || 'newest'}
                  onChange={(val) => updateElementProps(selectedElement.id, { sortBy: val })}
                  options={[
                    { label: 'Newest Arrivals', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                  ]}
                />
              </>
            )}

            {/* Fallback generic text editor for other widgets */}
            {!['heading', 'text', 'button', 'image', 'product-grid'].includes(selectedElement.type) && (
              <div className="space-y-3">
                <span className="text-[11px] text-zinc-400 block">
                  Configuration for <b>{selectedElement.label}</b>
                </span>
                {Object.entries(props).map(([k, v]) => {
                  if (typeof v === 'string') {
                    return (
                      <TextControl
                        key={k}
                        label={k.charAt(0).toUpperCase() + k.slice(1)}
                        value={v}
                        onChange={(newVal) =>
                          updateElementProps(selectedElement.id, { [k]: newVal })
                        }
                      />
                    );
                  }
                  if (typeof v === 'number') {
                    return (
                      <NumberControl
                        key={k}
                        label={k.charAt(0).toUpperCase() + k.slice(1)}
                        value={v}
                        onChange={(newVal) =>
                          updateElementProps(selectedElement.id, { [k]: newVal })
                        }
                      />
                    );
                  }
                  if (typeof v === 'boolean') {
                    return (
                      <ToggleControl
                        key={k}
                        label={k.charAt(0).toUpperCase() + k.slice(1)}
                        checked={v}
                        onChange={(newVal) =>
                          updateElementProps(selectedElement.id, { [k]: newVal })
                        }
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {settingsTab === 'style' && (
          <div className="space-y-4">
            <ColorControl
              label="Text Color"
              value={currentStyles.color || ''}
              onChange={(val) => updateElementStyles(selectedElement.id, { color: val })}
            />

            <ColorControl
              label="Background Color"
              value={currentStyles.backgroundColor || ''}
              onChange={(val) => updateElementStyles(selectedElement.id, { backgroundColor: val })}
            />

            <NumberControl
              label="Font Size"
              value={parseFloat(currentStyles.fontSize) || 16}
              onChange={(val) => updateElementStyles(selectedElement.id, { fontSize: `${val}px` })}
              min={8}
              max={120}
              unit="px"
            />

            <SelectControl
              label="Font Weight"
              value={currentStyles.fontWeight || '400'}
              onChange={(val) => updateElementStyles(selectedElement.id, { fontWeight: val })}
              options={[
                { label: '300 Light', value: '300' },
                { label: '400 Normal', value: '400' },
                { label: '500 Medium', value: '500' },
                { label: '600 Semi-Bold', value: '600' },
                { label: '700 Bold', value: '700' },
                { label: '800 Extra Bold', value: '800' },
              ]}
            />

            <SelectControl
              label="Text Alignment"
              value={currentStyles.textAlign || 'left'}
              onChange={(val) => updateElementStyles(selectedElement.id, { textAlign: val })}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ]}
            />

            <NumberControl
              label="Border Radius"
              value={parseFloat(currentStyles.borderRadius) || 0}
              onChange={(val) => updateElementStyles(selectedElement.id, { borderRadius: `${val}px` })}
              min={0}
              max={50}
              unit="px"
            />
          </div>
        )}

        {/* ── LAYOUT TAB ── */}
        {settingsTab === 'layout' && (
          <div className="space-y-4">
            <SpacingControl
              label="Padding"
              top={currentStyles.paddingTop}
              right={currentStyles.paddingRight}
              bottom={currentStyles.paddingBottom}
              left={currentStyles.paddingLeft}
              onChange={(vals) =>
                updateElementStyles(selectedElement.id, {
                  paddingTop: vals.top,
                  paddingRight: vals.right,
                  paddingBottom: vals.bottom,
                  paddingLeft: vals.left,
                })
              }
            />

            <SpacingControl
              label="Margin"
              top={currentStyles.marginTop}
              right={currentStyles.marginRight}
              bottom={currentStyles.marginBottom}
              left={currentStyles.marginLeft}
              onChange={(vals) =>
                updateElementStyles(selectedElement.id, {
                  marginTop: vals.top,
                  marginRight: vals.right,
                  marginBottom: vals.bottom,
                  marginLeft: vals.left,
                })
              }
            />

            <NumberControl
              label="Item Gap"
              value={parseFloat(currentStyles.gap) || 0}
              onChange={(val) => updateElementStyles(selectedElement.id, { gap: `${val}px` })}
              min={0}
              max={64}
              unit="px"
            />
          </div>
        )}

        {/* ── ADVANCED TAB ── */}
        {settingsTab === 'advanced' && (
          <div className="space-y-4">
            <TextControl
              label="Custom CSS Class"
              value={advanced.customClass || ''}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { customClass: val })}
              placeholder="my-custom-badge"
              allowDynamic={false}
            />

            <TextControl
              label="Element ID (Anchor)"
              value={advanced.customId || ''}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { customId: val })}
              placeholder="section-features"
              allowDynamic={false}
            />

            <NumberControl
              label="Z-Index"
              value={advanced.zIndex || 0}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { zIndex: val })}
              min={-10}
              max={100}
              unit=""
            />
          </div>
        )}

        {/* ── RESPONSIVE TAB ── */}
        {settingsTab === 'responsive' && (
          <div className="space-y-4">
            <span className="text-[11px] text-zinc-400 block leading-relaxed">
              Toggle device visibility to conditionally hide this widget on specific screen sizes.
            </span>

            <ToggleControl
              label="Hide on Desktop"
              checked={Boolean(advanced.hideOnDesktop)}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { hideOnDesktop: val })}
            />

            <ToggleControl
              label="Hide on Tablet"
              checked={Boolean(advanced.hideOnTablet)}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { hideOnTablet: val })}
            />

            <ToggleControl
              label="Hide on Mobile"
              checked={Boolean(advanced.hideOnMobile)}
              onChange={(val) => updateElementAdvanced(selectedElement.id, { hideOnMobile: val })}
            />
          </div>
        )}

        {/* Quick Footer Actions */}
        <div className="border-t border-zinc-800/80 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => duplicateElement(selectedElement.id)}
            className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => deleteElement(selectedElement.id)}
            className="flex-1 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-red-900/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
