'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PageBuilderElement,
  ResponsiveDevice,
} from '@/types/builder.types';
import {
  resolveDynamicBindings,
  resolveResponsiveStyles,
  sanitizeHtml,
} from '@/lib/builder/builder-utils';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Check,
  Sparkles,
  ShieldCheck,
  Heart,
  Eye,
  Sliders,
  Play,
  HelpCircle,
  Mail,
  User,
  Menu,
  X,
  CreditCard,
  Grid,
} from 'lucide-react';

export interface RendererContext {
  device?: ResponsiveDevice;
  product?: Record<string, any>;
  category?: Record<string, any>;
  store?: Record<string, any>;
  isEditor?: boolean;
  onSelectElement?: (id: string) => void;
  renderChildElements?: (children?: PageBuilderElement[]) => React.ReactNode;
}

export interface ElementRendererProps {
  element: PageBuilderElement;
  context: RendererContext;
}

// ── 1. LAYOUT RENDERERS ──

export function SectionRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { tag = 'section', containerWidth = 'boxed' } = element.props || {};
  const Component = tag as any;

  return (
    <Component
      id={element.advanced?.customId}
      className={`w-full relative transition-colors ${element.advanced?.customClass || ''}`}
      style={styles}
    >
      <div
        className={`mx-auto w-full ${
          containerWidth === 'boxed' ? 'max-w-7xl px-4 sm:px-6 lg:px-8' : 'px-0'
        }`}
      >
        {context.renderChildElements?.(element.children)}
      </div>
    </Component>
  );
}

export function ContainerRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');

  return (
    <div
      id={element.advanced?.customId}
      className={`relative ${element.advanced?.customClass || ''}`}
      style={styles}
    >
      {context.renderChildElements?.(element.children)}
    </div>
  );
}

export function ColumnRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');

  return (
    <div
      id={element.advanced?.customId}
      className={`relative flex-1 ${element.advanced?.customClass || ''}`}
      style={styles}
    >
      {context.renderChildElements?.(element.children)}
    </div>
  );
}

export function InnerSectionRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');

  return (
    <div
      id={element.advanced?.customId}
      className={`w-full ${element.advanced?.customClass || ''}`}
      style={styles}
    >
      {context.renderChildElements?.(element.children)}
    </div>
  );
}

export function SpacerRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  return <div style={styles} aria-hidden="true" />;
}

export function DividerRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { style = 'solid', color = '#E8DED8', thickness = '1px', text = '' } = element.props || {};

  if (text) {
    return (
      <div className="flex items-center my-4 w-full" style={styles}>
        <div className="flex-1 border-t" style={{ borderColor: color, borderTopStyle: style, borderWidth: thickness }} />
        <span className="px-3 text-xs uppercase tracking-widest text-[#888888] font-medium">{text}</span>
        <div className="flex-1 border-t" style={{ borderColor: color, borderTopStyle: style, borderWidth: thickness }} />
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles,
        borderTop: `${thickness} ${style} ${color}`,
      }}
      className="my-3 w-full"
    />
  );
}

// ── 2. BASIC RENDERERS ──

export function HeadingRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { text = '', tag = 'h2', link = '' } = element.props || {};
  const resolvedText = resolveDynamicBindings(text, context);
  const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(tag) ? tag : 'h2') as any;

  const content = <Tag style={styles}>{resolvedText}</Tag>;

  if (link && !context.isEditor) {
    return (
      <Link href={link} className="hover:opacity-85 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export function TextRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { text = '' } = element.props || {};
  const resolvedText = resolveDynamicBindings(text, context);

  return (
    <p style={styles} className={element.advanced?.customClass || ''}>
      {resolvedText}
    </p>
  );
}

export function RichTextRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { html = '' } = element.props || {};
  const cleanHtml = sanitizeHtml(resolveDynamicBindings(html, context));

  return (
    <div
      style={styles}
      className={`prose max-w-none ${element.advanced?.customClass || ''}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

export function ButtonRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const {
    text = 'Button',
    link = '#',
    variant = 'primary',
    iconName = '',
    iconPosition = 'right',
  } = element.props || {};
  const resolvedText = resolveDynamicBindings(text, context);

  const inner = (
    <span className="inline-flex items-center gap-2">
      {iconName === 'ArrowRight' && iconPosition === 'left' && <ArrowRight className="w-4 h-4" />}
      {iconName === 'Sparkles' && iconPosition === 'left' && <Sparkles className="w-4 h-4" />}
      {iconName === 'ShoppingCart' && iconPosition === 'left' && <ShoppingCart className="w-4 h-4" />}
      <span>{resolvedText}</span>
      {iconName === 'ArrowRight' && iconPosition === 'right' && <ArrowRight className="w-4 h-4" />}
      {iconName === 'Sparkles' && iconPosition === 'right' && <Sparkles className="w-4 h-4" />}
      {iconName === 'ShoppingCart' && iconPosition === 'right' && <ShoppingCart className="w-4 h-4" />}
    </span>
  );

  if (link && !context.isEditor) {
    return (
      <Link href={link} style={styles} className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" style={styles} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
      {inner}
    </button>
  );
}

export function IconRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { iconName = 'Sparkles', size = 28, color = '#B77A68' } = element.props || {};

  const IconComp =
    iconName === 'ShieldCheck'
      ? ShieldCheck
      : iconName === 'Heart'
      ? Heart
      : iconName === 'Star'
      ? Star
      : Sparkles;

  return (
    <div style={styles}>
      <IconComp size={size} color={color} />
    </div>
  );
}

export function ImageRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { src = '', alt = 'Image', link = '', rounded = '8px' } = element.props || {};
  const resolvedSrc = resolveDynamicBindings(src, context) || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800';

  const img = (
    <img
      src={resolvedSrc}
      alt={alt}
      style={{
        ...styles,
        borderRadius: rounded,
        objectFit: 'cover',
      }}
      className="w-full h-auto transition-transform hover:scale-[1.01]"
      loading="lazy"
    />
  );

  if (link && !context.isEditor) {
    return <Link href={link}>{img}</Link>;
  }

  return img;
}

export function VideoRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { videoUrl = '', controls = true } = element.props || {};

  return (
    <div style={styles} className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
        <iframe
          src={videoUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={videoUrl} controls={controls} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

// ── 3. MEDIA RENDERERS ──

export function ImageGalleryRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { columns = 3, gap = 16, images = [] } = element.props || {};

  return (
    <div
      style={{
        ...styles,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
      className="w-full"
    >
      {(images as any[]).map((img, i) => (
        <div key={i} className="group relative overflow-hidden rounded-lg bg-stone-100 aspect-square">
          <img
            src={img.url || img.src}
            alt={img.alt || `Gallery item ${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {img.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs font-medium">
              {img.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ImageSliderRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { slides = [] } = element.props || {};
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[current] || slides[0];

  return (
    <div style={styles} className="relative w-full overflow-hidden rounded-xl bg-stone-900 text-white min-h-[360px]">
      <img
        src={slide.image}
        alt={slide.title || 'Slide'}
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 p-8 md:p-14 flex flex-col justify-end min-h-[360px] max-w-2xl">
        {slide.subtitle && (
          <span className="text-xs uppercase font-semibold tracking-widest text-[#B77A68] mb-2 block">
            {slide.subtitle}
          </span>
        )}
        <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4">{slide.title}</h3>
        {slide.ctaText && (
          <Link
            href={slide.ctaLink || '/'}
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition w-fit"
          >
            <span>{slide.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {/* Slider dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-6 z-20 flex gap-1.5">
          {slides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${
                current === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function IconBoxRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { iconName = 'ShieldCheck', title = 'Icon Box', description = '', link = '' } = element.props || {};

  const content = (
    <div style={styles} className="group hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-[#B77A68]/10 text-[#B77A68] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-base text-stone-900 mb-2">{title}</h4>
      <p className="text-xs text-stone-600 leading-relaxed">{description}</p>
    </div>
  );

  if (link && !context.isEditor) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

// ── 4. CONTENT RENDERERS ──

export function AccordionRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { items = [] } = element.props || {};
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div style={styles} className="space-y-3 w-full">
      {(items as any[]).map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm text-stone-900 hover:bg-stone-50 transition"
            >
              <span>{item.title}</span>
              {isOpen ? <Minus className="w-4 h-4 text-stone-500" /> : <Plus className="w-4 h-4 text-stone-500" />}
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TabsRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { tabs = [] } = element.props || {};
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div style={styles} className="w-full">
      <div className="flex border-b border-stone-200 gap-6 mb-6">
        {tabs.map((tab: any, i: number) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === i ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
            {activeTab === i && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#B77A68]" />
            )}
          </button>
        ))}
      </div>
      <div className="text-sm text-stone-600 leading-relaxed">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export function TestimonialsRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { items = [] } = element.props || {};

  return (
    <div style={styles} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {(items as any[]).map((t, idx) => (
        <div key={idx} className="p-6 rounded-xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex gap-1 text-amber-500">
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-stone-700 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
          </div>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-100">
            {t.avatar && (
              <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <h5 className="font-semibold text-xs text-stone-900">{t.author}</h5>
              <span className="text-[11px] text-stone-500 block">{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PricingTableRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { tiers = [] } = element.props || {};

  return (
    <div style={styles} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      {(tiers as any[]).map((tier, idx) => (
        <div
          key={idx}
          className={`rounded-2xl p-8 border transition flex flex-col justify-between ${
            tier.highlighted
              ? 'border-stone-900 bg-stone-900 text-white shadow-xl'
              : 'border-stone-200 bg-white text-stone-900 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif font-bold text-xl">{tier.name}</h4>
              {tier.highlighted && (
                <span className="text-[10px] bg-[#B77A68] text-white uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className={`text-xs ${tier.highlighted ? 'text-stone-300' : 'text-stone-500'}`}>
              {tier.description}
            </p>
            <div className="flex items-baseline gap-1 py-2">
              <span className="text-4xl font-bold font-serif">{tier.price}</span>
              <span className={`text-xs ${tier.highlighted ? 'text-stone-400' : 'text-stone-500'}`}>
                {tier.period}
              </span>
            </div>
            <ul className="space-y-2.5 pt-4 border-t border-stone-200/20 text-xs">
              {(tier.features || []).map((feat: string, fIdx: number) => (
                <li key={fIdx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#B77A68] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className={`mt-8 w-full py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition ${
              tier.highlighted
                ? 'bg-[#B77A68] hover:bg-[#9E6555] text-white'
                : 'bg-stone-900 hover:bg-black text-white'
            }`}
          >
            {tier.ctaText || 'Get Started'}
          </button>
        </div>
      ))}
    </div>
  );
}

export function FaqRenderer({ element, context }: ElementRendererProps) {
  const { title = 'FAQ', subtitle = '' } = element.props || {};
  return (
    <div className="w-full text-center space-y-3 mb-8">
      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">{title}</h3>
      {subtitle && <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export function ContactFormRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { title = 'Get In Touch', submitButtonText = 'Send Message', showPhoneField = true } = element.props || {};
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={styles} className="w-full">
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">{title}</h3>
      {submitted ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs text-center font-medium">
          Thank you. Our atelier team will connect with you within 24 hours.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4 text-left"
        >
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Aanya Kapoor"
              className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="aanya@example.com"
              className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900 outline-none"
            />
          </div>
          {showPhoneField && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900 outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
            <textarea
              rows={3}
              required
              placeholder="Inquire regarding bespoke sizing, couture availability, or concierge styling..."
              className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 text-white rounded-md text-xs uppercase tracking-wider font-semibold hover:bg-black transition"
          >
            {submitButtonText}
          </button>
        </form>
      )}
    </div>
  );
}

// ── 5. E-COMMERCE RENDERERS ──

export function ProductGridRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { limit = 8, columns = 4 } = element.props || {};

  const demoProducts = [
    {
      id: 'prod_1',
      title: 'Blush Floral Chanderi Anarkali Gown',
      price: '$240',
      comparePrice: '$320',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop',
      category: 'Women Couture',
    },
    {
      id: 'prod_2',
      title: 'Rose-Gold Zari Handwoven Kurti Set',
      price: '$185',
      comparePrice: '$210',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
      category: 'Festive Pret',
    },
    {
      id: 'prod_3',
      title: 'Little Blossom Tiered Organza Frock',
      price: '$95',
      comparePrice: '',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop',
      category: 'Kids Royals',
    },
    {
      id: 'prod_4',
      title: 'Raw Silk Hand-Embroidered Nehru Jacket',
      price: '$160',
      comparePrice: '$190',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop',
      category: 'Kids Royals',
    },
  ];

  return (
    <div style={styles} className="w-full">
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {demoProducts.slice(0, limit).map((prod) => (
          <div key={prod.id} className="group relative flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100 mb-3">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow text-stone-700 hover:text-rose-600 flex items-center justify-center transition"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68] block mb-1">
                {prod.category}
              </span>
              <h4 className="font-semibold text-xs text-stone-900 line-clamp-1 mb-1">
                {prod.title}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-stone-900">{prod.price}</span>
                {prod.comparePrice && (
                  <span className="text-stone-400 line-through text-[11px]">{prod.comparePrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductCardRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  return (
    <div style={styles} className="border border-stone-200 rounded-xl p-3 bg-white shadow-sm">
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 mb-3">
        <img
          src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop"
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
      <h5 className="font-semibold text-xs text-stone-900">Featured Couture Piece</h5>
      <p className="text-xs font-bold text-[#B77A68] mt-1">$220.00</p>
    </div>
  );
}

export function ProductTitleRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { dynamicBinding = '{{ product.name }}', fallbackText = 'Signature Haute Gown' } = element.props || {};
  const resolved = resolveDynamicBindings(dynamicBinding, context);
  const text = resolved === dynamicBinding ? fallbackText : resolved;

  return <h1 style={styles}>{text}</h1>;
}

export function ProductPriceRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { dynamicBinding = '{{ product.price }}', fallbackPrice = '$285.00' } = element.props || {};
  const resolved = resolveDynamicBindings(dynamicBinding, context);
  const price = resolved === dynamicBinding ? fallbackPrice : resolved;

  return <div style={styles}>{price}</div>;
}

export function ProductDescriptionRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { dynamicBinding = '{{ product.description }}', fallbackText = 'Handcrafted with fine silk weaves.' } = element.props || {};
  const resolved = resolveDynamicBindings(dynamicBinding, context);
  const desc = resolved === dynamicBinding ? fallbackText : resolved;

  return <p style={styles}>{desc}</p>;
}

export function ProductRatingRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { fallbackRating = 4.9, fallbackReviewCount = 42 } = element.props || {};

  return (
    <div style={styles} className="flex items-center gap-1.5 text-xs text-stone-600">
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>
      <span className="font-semibold text-stone-900">{fallbackRating}</span>
      <span className="text-stone-400">({fallbackReviewCount} reviews)</span>
    </div>
  );
}

export function AddToCartRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { buttonText = 'Add to Cart', showQuantity = true } = element.props || {};
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-3 w-full">
      {showQuantity && (
        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-stone-100 text-stone-600"
          >
            -
          </button>
          <span className="px-3 py-2 text-xs font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 hover:bg-stone-100 text-stone-600"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        style={styles}
        onClick={() => {
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-black transition"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>{added ? 'Added to Bag!' : buttonText}</span>
      </button>
    </div>
  );
}

export function CategoryGridRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { categories = [], columns = 3 } = element.props || {};

  return (
    <div
      style={{
        ...styles,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '20px',
      }}
      className="w-full"
    >
      {(categories as any[]).map((cat, i) => (
        <Link
          key={i}
          href={cat.slug ? `/${cat.slug}` : '#'}
          className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-sm"
        >
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h4 className="text-lg font-serif font-bold group-hover:text-[#B77A68] transition-colors">
              {cat.name}
            </h4>
            <span className="text-xs text-stone-300 block">{cat.itemCount || 12} Silhouettes</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CategoryCardRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { name = 'Category', imageUrl = '', badge = '' } = element.props || {};

  return (
    <div style={styles} className="group relative rounded-xl overflow-hidden bg-stone-100 aspect-video shadow-sm">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition" />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5 text-white">
        {badge && (
          <span className="text-[10px] bg-[#B77A68] uppercase font-bold tracking-widest px-2 py-0.5 rounded w-fit mb-1">
            {badge}
          </span>
        )}
        <h4 className="text-lg font-serif font-bold">{name}</h4>
      </div>
    </div>
  );
}

export function ProductSliderRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { title = 'Trending Pieces', subtitle = '' } = element.props || {};

  return (
    <div style={styles} className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div>
          {subtitle && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68] block mb-1">
              {subtitle}
            </span>
          )}
          <h3 className="text-2xl font-serif font-bold text-stone-900">{title}</h3>
        </div>
        <Link href="/women" className="text-xs font-semibold text-[#B77A68] hover:underline flex items-center gap-1">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <ProductGridRenderer element={{ ...element, props: { columns: 4, limit: 4 } }} context={context} />
    </div>
  );
}

export function FeaturedProductsRenderer({ element, context }: ElementRendererProps) {
  return <ProductSliderRenderer element={element} context={context} />;
}

export function RelatedProductsRenderer({ element, context }: ElementRendererProps) {
  return <ProductSliderRenderer element={element} context={context} />;
}

export function ProductSearchRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { placeholder = 'Search collection...' } = element.props || {};

  return (
    <div style={styles} className="relative w-full">
      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900 outline-none shadow-sm"
      />
    </div>
  );
}

export function ProductFilterRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');

  return (
    <div style={styles} className="flex items-center gap-3 py-3 border-y border-stone-200 text-xs text-stone-600">
      <div className="flex items-center gap-1 font-semibold text-stone-900">
        <Sliders className="w-3.5 h-3.5" />
        <span>Filters:</span>
      </div>
      <span className="px-2.5 py-1 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200">Category</span>
      <span className="px-2.5 py-1 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200">Price Range</span>
      <span className="px-2.5 py-1 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200">Size</span>
      <span className="px-2.5 py-1 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200">Fabric</span>
    </div>
  );
}

export function CartSummaryRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { freeShippingThreshold = 150 } = element.props || {};

  return (
    <div style={styles} className="w-full space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-stone-200">
        <h4 className="font-semibold text-sm text-stone-900">Order Summary</h4>
        <span className="text-xs text-stone-500">2 Items</span>
      </div>
      <div className="text-xs space-y-2 text-stone-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-stone-900">$240.00</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Delivery</span>
          <span className="text-emerald-700 font-semibold">Complimentary</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-950">
          <span>Total</span>
          <span>$240.00</span>
        </div>
      </div>
      <button
        type="button"
        className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-black transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

// ── 6. NAVIGATION RENDERERS ──

export function HeaderRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { logoText = 'Lumina Atelier', showSearch = true, showCart = true } = element.props || {};

  return (
    <header style={styles} className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-serif font-bold text-xl tracking-tight text-stone-900">
          {logoText}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-700">
          <Link href="/women" className="hover:text-stone-950 transition">Women</Link>
          <Link href="/kids" className="hover:text-stone-950 transition">Kids</Link>
          <Link href="/new-arrivals" className="hover:text-stone-950 transition">New Arrivals</Link>
          <Link href="/collections" className="hover:text-stone-950 transition">Lookbook</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4 text-stone-700">
        {showSearch && <Search className="w-4 h-4 cursor-pointer hover:text-stone-950" />}
        <User className="w-4 h-4 cursor-pointer hover:text-stone-950" />
        {showCart && (
          <div className="relative cursor-pointer">
            <ShoppingCart className="w-4 h-4 hover:text-stone-950" />
            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#B77A68] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export function NavigationMenuRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { items = [] } = element.props || {};

  return (
    <nav style={styles} className="w-full">
      {(items as any[]).map((item, i) => (
        <Link
          key={i}
          href={item.url || '#'}
          className="text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-[#B77A68] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function BreadcrumbRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');

  return (
    <nav style={styles} className="flex items-center gap-2 py-2">
      <Link href="/" className="hover:text-stone-900 transition">Home</Link>
      <ChevronRight className="w-3 h-3 text-stone-400" />
      <span className="text-stone-900 font-semibold">Atelier Lookbook</span>
    </nav>
  );
}

export function FooterRenderer({ element, context }: ElementRendererProps) {
  const styles = resolveResponsiveStyles(element.styles, context.device || 'desktop');
  const { brandName = 'Lumina Atelier', tagline = '', copyright = '', columns = [] } = element.props || {};

  return (
    <footer style={styles} className="w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <h3 className="font-serif font-bold text-2xl text-white">{brandName}</h3>
          {tagline && <p className="text-xs text-stone-400 max-w-sm leading-relaxed">{tagline}</p>}
        </div>
        {(columns as any[]).map((col, idx) => (
          <div key={idx} className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#B77A68]">{col.title}</h5>
            <ul className="space-y-2 text-xs text-stone-300">
              {(col.links || []).map((link: any, lIdx: number) => (
                <li key={lIdx}>
                  <Link href={link.url || '#'} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
        {copyright || '© 2026 Lumina Atelier. All rights reserved.'}
      </div>
    </footer>
  );
}

// ── COMPONENT REGISTRY DISPATCHER ──

export const ELEMENT_RENDERER_REGISTRY: Record<
  string,
  React.ComponentType<ElementRendererProps>
> = {
  section: SectionRenderer,
  container: ContainerRenderer,
  column: ColumnRenderer,
  'inner-section': InnerSectionRenderer,
  spacer: SpacerRenderer,
  divider: DividerRenderer,

  heading: HeadingRenderer,
  text: TextRenderer,
  'rich-text': RichTextRenderer,
  button: ButtonRenderer,
  icon: IconRenderer,
  image: ImageRenderer,
  video: VideoRenderer,

  'image-gallery': ImageGalleryRenderer,
  'image-slider': ImageSliderRenderer,
  'icon-box': IconBoxRenderer,

  accordion: AccordionRenderer,
  tabs: TabsRenderer,
  testimonials: TestimonialsRenderer,
  'pricing-table': PricingTableRenderer,
  faq: FaqRenderer,
  'contact-form': ContactFormRenderer,

  'product-grid': ProductGridRenderer,
  'product-card': ProductCardRenderer,
  'product-image': ImageRenderer,
  'product-title': ProductTitleRenderer,
  'product-price': ProductPriceRenderer,
  'product-description': ProductDescriptionRenderer,
  'product-rating': ProductRatingRenderer,
  'add-to-cart': AddToCartRenderer,
  'category-grid': CategoryGridRenderer,
  'category-card': CategoryCardRenderer,
  'product-slider': ProductSliderRenderer,
  'featured-products': FeaturedProductsRenderer,
  'related-products': RelatedProductsRenderer,
  'product-search': ProductSearchRenderer,
  'product-filter': ProductFilterRenderer,
  'cart-summary': CartSummaryRenderer,

  header: HeaderRenderer,
  'navigation-menu': NavigationMenuRenderer,
  breadcrumb: BreadcrumbRenderer,
  footer: FooterRenderer,
};
