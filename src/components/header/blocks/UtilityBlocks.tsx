'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { formatTenantHref } from '@/lib/tenant-config';

export function WhatsAppBlock({ block }: { block: HeaderBlock }) {
  const s = block.settings || {};
  const label = s.label || 'WhatsApp Concierge';
  const phone = s.phone || '18004125864';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = s.url || `https://wa.me/${cleanPhone}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity select-none"
      style={{
        color: block.styles?.textColor || 'inherit',
        fontSize: block.styles?.fontSize || 'inherit',
        fontFamily: block.styles?.fontFamily,
      }}
    >
      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
      <span>{label}</span>
    </a>
  );
}

export function PhoneBlock({ block }: { block: HeaderBlock }) {
  const s = block.settings || {};
  const label = s.label || s.phone || '+1 (800) 412-LUMI';
  const phone = s.phone || '+1 (800) 412-LUMI';

  return (
    <a
      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity select-none"
      style={{
        color: block.styles?.textColor || 'inherit',
        fontSize: block.styles?.fontSize || 'inherit',
        fontFamily: block.styles?.fontFamily,
      }}
    >
      <Phone className="w-3.5 h-3.5 opacity-75" />
      <span>{label}</span>
    </a>
  );
}

export function TextBlock({ block }: { block: HeaderBlock }) {
  const s = block.settings || {};
  const text = s.text || '';

  return (
    <span
      className="select-none tracking-wider"
      style={{
        color: block.styles?.textColor || 'inherit',
        fontSize: block.styles?.fontSize || 'inherit',
        fontFamily: block.styles?.fontFamily,
        fontWeight: block.styles?.fontWeight || '600',
        letterSpacing: block.styles?.letterSpacing,
      }}
    >
      {text}
    </span>
  );
}

export function IconBlock({ block }: { block: HeaderBlock }) {
  const s = block.settings || {};
  const text = s.text || '';

  return (
    <span
      className="inline-flex items-center gap-1.5 select-none hover:opacity-80 transition-opacity"
      style={{
        color: block.styles?.textColor || 'inherit',
        fontSize: block.styles?.fontSize || 'inherit',
        fontFamily: block.styles?.fontFamily,
        letterSpacing: block.styles?.letterSpacing,
      }}
    >
      <span className="opacity-90">✦</span>
      <span>{text}</span>
    </span>
  );
}

export function CTAButtonBlock({ block, tenantSlug }: { block: HeaderBlock; tenantSlug?: string }) {
  const s = block.settings || {};
  const label = s.label || 'EXPLORE';
  const rawUrl = s.url || s.link || '/sale';
  const url = formatTenantHref(rawUrl, tenantSlug);

  return (
    <Link
      href={url}
      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-transform active:scale-95 shadow-xs select-none inline-flex items-center"
      style={{
        backgroundColor: block.styles?.backgroundColor || '#E11D48',
        color: block.styles?.textColor || '#FFFFFF',
      }}
    >
      {label}
    </Link>
  );
}

export function DividerBlock({ block }: { block: HeaderBlock }) {
  return (
    <span
      className="opacity-30 select-none px-1"
      style={{ color: block.styles?.textColor || 'inherit' }}
    >
      •
    </span>
  );
}

export function SpacerBlock({ block }: { block: HeaderBlock }) {
  const width = block.settings?.width || '16px';
  return <div style={{ width }} className="shrink-0" />;
}
