'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FooterBlock } from '@/lib/footer-config';
import { formatTenantHref } from '@/lib/tenant-config';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface FooterBlockRendererProps {
  block: FooterBlock;
  device?: 'desktop' | 'tablet' | 'mobile';
  tenantSlug: string;
  themeAccent?: string;
}

export function FooterBlockRenderer({
  block,
  device = 'desktop',
  tenantSlug,
  themeAccent = '#B77A68',
}: FooterBlockRendererProps) {
  if (block.enabled === false) return null;

  // Responsive device visibility
  const deviceVis = block.responsive?.[device]?.visible;
  if (deviceVis === false) return null;

  const rawContent = block.content || (block as any).settings || {};
  const styles = block.styles || {};
  const { type } = block;

  // 1. Logo / Brand Block
  if (type === 'logo' || type === 'brand') {
    const text = rawContent.text || rawContent.logoText || tenantSlug.toUpperCase() || 'STOREFRONT';
    const { imageUrl, logoType, width, linkUrl } = rawContent;
    const targetUrl = formatTenantHref(linkUrl || '/', tenantSlug);

    if ((logoType === 'image' || imageUrl) && imageUrl) {
      return (
        <Link href={targetUrl} className="inline-block">
          <img
            src={imageUrl}
            alt={rawContent.altText || `${text} Logo`}
            style={{ maxWidth: width ? `${width}px` : '180px', height: 'auto' }}
            className="hover:opacity-90 transition-opacity"
          />
        </Link>
      );
    }

    return (
      <Link
        href={targetUrl}
        style={{
          fontSize: styles.fontSize || '20px',
          fontFamily: styles.fontFamily || 'var(--footer-heading-font, var(--theme-font-heading, serif))',
          fontWeight: styles.fontWeight || '800',
          letterSpacing: styles.letterSpacing || '0.12em',
          color: styles.textColor || 'var(--footer-heading, #FFFFFF)',
          textAlign: (styles.textAlign as any) || 'left',
        }}
        className="block font-serif font-black uppercase tracking-widest hover:opacity-90 transition-opacity break-words leading-tight max-w-full"
      >
        {text}
      </Link>
    );
  }

  // 2. Text Block
  if (type === 'text') {
    return (
      <p
        style={{
          fontSize: styles.fontSize || 'var(--footer-font-size, 13px)',
          fontFamily: styles.fontFamily || 'var(--footer-font-family, inherit)',
          color: styles.textColor || 'var(--footer-muted, #94A3B8)',
          lineHeight: styles.lineHeight || '1.6',
          textAlign: (styles.textAlign as any) || 'left',
        }}
        className="font-sans"
      >
        {rawContent.text || ''}
      </p>
    );
  }

  // 3. Navigation Menu Block
  if (type === 'menu' || type === 'navigation' || type === 'links') {
    const [isOpen, setIsOpen] = useState(true);
    const isMobile = device === 'mobile';
    const items = rawContent.items || rawContent.links || rawContent.menuItems || [];
    const heading = rawContent.heading || rawContent.title || rawContent.label || block.name;

    return (
      <div className="space-y-3">
        {heading && (
          <div
            onClick={() => isMobile && setIsOpen(!isOpen)}
            className={`flex items-center justify-between ${
              isMobile ? 'cursor-pointer py-1.5 border-b border-white/5' : ''
            }`}
          >
            <h4
              style={{
                color: styles.headingColor || 'var(--footer-heading, #FFFFFF)',
                fontFamily: styles.headingFontFamily || 'var(--footer-heading-font, inherit)',
              }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              {heading}
            </h4>
            {isMobile && (
              <span className="text-xs text-slate-400 font-bold">{isOpen ? '−' : '+'}</span>
            )}
          </div>
        )}
        {(!isMobile || isOpen) && (
          <ul className="space-y-2 text-xs">
            {items.map((it: any, i: number) => {
              const label = it.label || it.title || it.name || '';
              const href = it.href || it.url || it.link || '#';
              return (
                <li key={i}>
                  <Link
                    href={formatTenantHref(href, tenantSlug)}
                    style={{
                      color: styles.linkColor || styles.textColor || 'var(--footer-muted, #94A3B8)',
                      fontFamily: styles.fontFamily || 'var(--footer-font-family, inherit)',
                    }}
                    className="hover:text-white transition-colors duration-200 block py-0.5"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // 4. Newsletter Block
  if (type === 'newsletter') {
    const [email, setEmail] = useState('');
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes('@')) return;
      setIsDone(true);
    };

    const heading = rawContent.heading || rawContent.title || 'NEWSLETTER';

    return (
      <div className="space-y-3">
        {heading && (
          <h4
            style={{
              color: styles.headingColor || 'var(--footer-heading, #FFFFFF)',
              fontFamily: styles.headingFontFamily || 'var(--footer-heading-font, inherit)',
            }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {heading}
          </h4>
        )}
        {rawContent.description && (
          <p
            style={{ color: 'var(--footer-muted, #94A3B8)' }}
            className="text-xs font-sans"
          >
            {rawContent.description}
          </p>
        )}
        {isDone ? (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
            ✦ {rawContent.successMessage || 'Thank you for subscribing.'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={rawContent.placeholder || 'Enter your email...'}
                className="flex-1 px-3.5 py-2.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#B77A68] transition-colors"
                style={{
                  borderColor: 'var(--footer-border, rgba(255, 255, 255, 0.1))',
                  color: 'var(--footer-text, #FFFFFF)',
                }}
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: styles.buttonBgColor || themeAccent || 'var(--footer-accent, #B77A68)',
                  color: styles.buttonTextColor || '#FFFFFF',
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-md"
              >
                {rawContent.buttonText || 'Subscribe'}
              </button>
            </div>
            {rawContent.privacyText && (
              <p className="text-[10px] text-slate-500">{rawContent.privacyText}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // 5. Social Icons Block
  if (type === 'social_icons' || type === 'socials') {
    const active = (rawContent.platforms || rawContent.links || rawContent.socials || []).filter(
      (p: any) => p.enabled !== false && (p.url || p.href)
    );
    const heading = rawContent.heading || rawContent.title;

    return (
      <div className="space-y-3">
        {heading && (
          <h4
            style={{
              color: styles.headingColor || 'var(--footer-heading, #FFFFFF)',
              fontFamily: styles.headingFontFamily || 'var(--footer-heading-font, inherit)',
            }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {heading}
          </h4>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {active.map((p: any, i: number) => {
            const name = p.name || p.platform || p.label || 'Social';
            const url = p.url || p.href || '#';
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 flex items-center gap-1.5 text-slate-400 hover:text-white hover:border-[#B77A68] hover:bg-[#B77A68]/20 transition-all text-xs font-semibold"
                title={name}
              >
                <span>{name}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. Contact Block
  if (type === 'contact') {
    const { phone, email, address, whatsapp, heading } = rawContent;
    return (
      <div className="space-y-3">
        {heading && (
          <h4
            style={{
              color: styles.headingColor || 'var(--footer-heading, #FFFFFF)',
              fontFamily: styles.headingFontFamily || 'var(--footer-heading-font, inherit)',
            }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {heading}
          </h4>
        )}
        <ul className="space-y-2 text-xs text-slate-400">
          {phone && (
            <li className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-[#B77A68] shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                {phone}
              </a>
            </li>
          )}
          {email && (
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#B77A68] shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </li>
          )}
          {whatsapp && (
            <li className="flex items-center gap-2.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp: {whatsapp}
              </a>
            </li>
          )}
          {address && (
            <li className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#B77A68] shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
          )}
        </ul>
      </div>
    );
  }

  // 7. Payment Icons Block
  if (type === 'payment_icons' || type === 'payments') {
    const active = (rawContent.methods || rawContent.badges || rawContent.icons || []).filter(
      (m: any) => m.enabled !== false
    );
    const heading = rawContent.heading || rawContent.title;

    return (
      <div className="space-y-3">
        {heading && (
          <h4
            style={{
              color: styles.headingColor || 'var(--footer-heading, #FFFFFF)',
              fontFamily: styles.headingFontFamily || 'var(--footer-heading-font, inherit)',
            }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {heading}
          </h4>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {active.map((m: any, i: number) => {
            const name = typeof m === 'string' ? m : m.name || m.label || 'Card';
            return (
              <span
                key={i}
                className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider"
                style={{ borderColor: 'var(--footer-border, rgba(255, 255, 255, 0.1))' }}
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // 8. Copyright Block
  if (type === 'copyright') {
    const year = new Date().getFullYear();
    const storeLabel = rawContent.storeName || tenantSlug.toUpperCase() || 'STOREFRONT';
    const template = rawContent.template || '© {{year}} {{store.name}}. All rights reserved.';
    const text = template
      .replace('{{year}}', String(year))
      .replace('{{store.name}}', storeLabel);

    return (
      <div
        style={{
          color: styles.textColor || 'var(--footer-muted, #64748B)',
          fontSize: styles.fontSize || 'var(--footer-font-size, 11px)',
          fontFamily: styles.fontFamily || 'var(--footer-font-family, inherit)',
          textAlign: (styles.textAlign as any) || 'center',
        }}
        className="font-sans"
      >
        {text}
      </div>
    );
  }

  // 9. Divider Block
  if (type === 'divider') {
    return (
      <hr
        style={{
          borderColor: styles.borderColor || 'var(--footer-border, rgba(255,255,255,0.08))',
          borderTopWidth: styles.borderWidth || '1px',
          margin: `${styles.marginY || '24px'} 0`,
        }}
      />
    );
  }

  // 10. Spacer Block
  if (type === 'spacer') {
    return <div style={{ height: rawContent.height || '32px' }} className="w-full" />;
  }

  // 11. Custom HTML Block
  if (type === 'custom_html') {
    return <div dangerouslySetInnerHTML={{ __html: rawContent.html || '' }} />;
  }

  return null;
}
