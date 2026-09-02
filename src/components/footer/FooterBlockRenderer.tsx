'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FooterBlock } from '@/lib/footer-config';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
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
  themeAccent = '#E11D48',
}: FooterBlockRendererProps) {
  if (block.enabled === false) return null;

  // Responsive device visibility
  const deviceVis = block.responsive?.[device]?.visible;
  if (deviceVis === false) return null;

  const { type, content = {}, styles = {} } = block;

  // 1. Logo Block
  if (type === 'logo') {
    const { text, imageUrl, logoType, width, linkUrl } = content;
    const targetUrl = linkUrl || `/stores/${tenantSlug}`;

    if (logoType === 'image' && imageUrl) {
      return (
        <Link href={targetUrl} className="inline-block">
          <img
            src={imageUrl}
            alt={content.altText || 'Storefront Logo'}
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
          fontSize: styles.fontSize || '18px',
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight || '800',
          letterSpacing: styles.letterSpacing || '0.12em',
          color: styles.textColor || '#FFFFFF',
          textAlign: styles.textAlign || 'left',
        }}
        className="block font-serif font-black uppercase tracking-widest hover:opacity-90 transition-opacity break-words leading-tight max-w-full"
      >
        {text || tenantSlug.toUpperCase() || 'STOREFRONT'}
      </Link>
    );
  }

  // 2. Text Block
  if (type === 'text') {
    return (
      <p
        style={{
          fontSize: styles.fontSize || '13px',
          color: styles.textColor || '#94A3B8',
          lineHeight: styles.lineHeight || '1.6',
          textAlign: styles.textAlign || 'left',
        }}
        className="font-sans"
      >
        {content.text || ''}
      </p>
    );
  }

  // 3. Navigation Menu Block
  if (type === 'menu') {
    const [isOpen, setIsOpen] = useState(true);
    const isMobile = device === 'mobile';
    const items = content.items || [];

    return (
      <div className="space-y-3">
        {content.heading && (
          <div
            onClick={() => isMobile && setIsOpen(!isOpen)}
            className={`flex items-center justify-between ${
              isMobile ? 'cursor-pointer py-1.5 border-b border-white/5' : ''
            }`}
          >
            <h4
              style={{ color: styles.headingColor || '#FFFFFF' }}
              className="text-xs font-bold uppercase tracking-wider font-sans"
            >
              {content.heading}
            </h4>
            {isMobile && (
              <span className="text-xs text-slate-400 font-bold">{isOpen ? '−' : '+'}</span>
            )}
          </div>
        )}
        {(!isMobile || isOpen) && (
          <ul className="space-y-2 text-xs">
            {items.map((it: any, i: number) => (
              <li key={i}>
                <Link
                  href={it.href || '#'}
                  style={{ color: styles.linkColor || '#94A3B8' }}
                  className="hover:text-white transition-colors duration-200 block py-0.5"
                >
                  {it.label}
                </Link>
              </li>
            ))}
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

    return (
      <div className="space-y-3">
        {content.heading && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            {content.heading}
          </h4>
        )}
        {content.description && (
          <p className="text-xs text-slate-400 font-sans">{content.description}</p>
        )}
        {isDone ? (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
            ✦ {content.successMessage || 'Thank you for subscribing.'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.placeholder || 'Enter your email...'}
                className="flex-1 px-3.5 py-2.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: styles.buttonBgColor || themeAccent,
                  color: styles.buttonTextColor || '#FFFFFF',
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-md"
              >
                {content.buttonText || 'Subscribe'}
              </button>
            </div>
            {content.privacyText && (
              <p className="text-[10px] text-slate-500">{content.privacyText}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // 5. Social Icons Block
  if (type === 'social_icons') {
    const active = (content.platforms || []).filter((p: any) => p.enabled && p.url);

    return (
      <div className="space-y-3">
        {content.heading && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            {content.heading}
          </h4>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {active.map((p: any, i: number) => (
            <a
              key={i}
              href={p.url || '#'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-rose-500 hover:bg-rose-500/20 transition-all text-xs font-bold"
              title={p.name}
            >
              {p.name.charAt(0)}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // 6. Contact Block
  if (type === 'contact') {
    const { phone, email, address, whatsapp, heading } = content;
    return (
      <div className="space-y-3">
        {heading && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            {heading}
          </h4>
        )}
        <ul className="space-y-2 text-xs text-slate-400">
          {phone && (
            <li className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{phone}</span>
            </li>
          )}
          {email && (
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </li>
          )}
          {whatsapp && (
            <li className="flex items-center gap-2.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp: {whatsapp}</span>
            </li>
          )}
          {address && (
            <li className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
          )}
        </ul>
      </div>
    );
  }

  // 7. Payment Icons Block
  if (type === 'payment_icons') {
    const active = (content.methods || []).filter((m: any) => m.enabled !== false);
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {active.map((m: any, i: number) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider"
          >
            {m.name}
          </span>
        ))}
      </div>
    );
  }

  // 8. Copyright Block
  if (type === 'copyright') {
    const year = new Date().getFullYear();
    const storeLabel = content.storeName || (tenantSlug ? tenantSlug.toUpperCase() : 'STOREFRONT');
    const text = (content.template || '© {{year}} {{store.name}}')
      .replace('{{year}}', String(year))
      .replace('{{store.name}}', storeLabel);

    return (
      <div
        style={{
          color: styles.textColor || '#64748B',
          fontSize: styles.fontSize || '11px',
          textAlign: styles.textAlign || 'center',
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
          borderColor: styles.borderColor || 'rgba(255,255,255,0.08)',
          borderTopWidth: styles.borderWidth || '1px',
          margin: `${styles.marginY || '24px'} 0`,
        }}
      />
    );
  }

  // 10. Spacer Block
  if (type === 'spacer') {
    return <div style={{ height: content.height || '32px' }} className="w-full" />;
  }

  // 11. Custom HTML Block
  if (type === 'custom_html') {
    return <div dangerouslySetInnerHTML={{ __html: content.html || '' }} />;
  }

  return null;
}
