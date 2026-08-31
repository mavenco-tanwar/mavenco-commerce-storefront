'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Database,
  Globe,
  DollarSign,
  Search,
  Layers,
  ShoppingBag,
  Cpu,
  Server,
  Lock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'ownership' | 'pricing' | 'payments' | 'domains' | 'cms' | 'architecture' | 'migration';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const FAQS: FaqItem[] = [
  {
    id: 'data-ownership',
    category: 'ownership',
    categoryLabel: 'Data Ownership & Privacy',
    question: 'Do I retain 100% ownership of my customer database, orders, and catalog?',
    answer:
      'Yes, absolutely. Unlike closed-wall monolithic SaaS platforms (Shopify, Wix, BigCommerce), every Mavenco store runs on an isolated, dedicated MongoDB Atlas partition. You own 100% of your customer records, transaction histories, product catalogs, customer reviews, and media assets with zero vendor lock-in. You can export or query your database directly at any time.',
    highlights: [
      '100% database sovereignty — isolated MongoDB partition per merchant',
      'Direct API and raw JSON export capabilities',
      'No shared multi-tenant database cross-contamination',
    ],
    icon: Database,
  },
  {
    id: 'commission-structure',
    category: 'pricing',
    categoryLabel: 'Pricing & Cloud Economics',
    question: 'How does the 0% platform transaction commission structure work?',
    answer:
      'Mavenco charges zero percent commission on your gross merchandise value (GMV). Whether you process ₹50,000 or ₹50,00,000 per month, you keep 100% of your earnings. You only pay your one-time platform license and a predictable monthly cloud server maintenance fee (ranging from ₹2,000/mo for Starter to ₹8,000/mo for Enterprise dedicated clusters).',
    highlights: [
      '0% GMV revenue share or hidden platform fees',
      'Flat, predictable server maintenance billed on flexible pay-as-you-go blocks',
      'Keeps your profit margins intact as you scale',
    ],
    icon: DollarSign,
  },
  {
    id: 'payment-gateways',
    category: 'payments',
    categoryLabel: 'Payments & Payouts',
    question: 'Can I connect my own payment gateway (Razorpay, Cashfree, Stripe, PhonePe)?',
    answer:
      'Yes. You connect your own registered merchant payment accounts directly. All customer payouts settle directly into your business bank account according to your standard merchant acquirer schedule (T+1 or T+2). Mavenco never intercepts, holds, or deducts fees from your payout settlements.',
    highlights: [
      'Native Razorpay, Stripe, Cashfree, PhonePe, and COD support',
      'Direct settlement to your registered bank account',
      'Zero intermediary hold periods or escrow delays',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'custom-domains',
    category: 'domains',
    categoryLabel: 'Domains & Branding',
    question: 'Can I use custom domains for both my public Storefront and Merchant Admin?',
    answer:
      'Yes! Mavenco is engineered with dual custom domain routing out of the box. You can map your public headless storefront to your custom apex domain (e.g. `yourbrand.com`) and your staff merchant admin workspace to a custom subdomain (e.g. `admin.yourbrand.com`). Automated TLS 1.3 wildcard SSL provisioning and Anycast DNS routing are managed automatically.',
    highlights: [
      'Dual custom domain support (Storefront + Admin Workspace)',
      'Automated zero-config SSL certificates via TLS 1.3',
      'Custom subdomain fallback (`brand.mavenco-store.com`)',
    ],
    icon: Globe,
  },
  {
    id: 'visual-cms',
    category: 'cms',
    categoryLabel: 'Visual CMS & Theming',
    question: 'How does the Visual Drag-and-Drop CMS Studio work without writing code?',
    answer:
      'Our visual CMS studio empowers marketing, design, and merchandising teams to create high-converting shopping layouts with zero code changes. You can drag and drop 15+ pre-built modular sections (Atelier Hero Banners, Editorial Lookbooks, Shoppable Product Carousels, Flash Sale Countdowns, Customer Reviews), customize Google typography, and inject brand CSS tokens in real time with live responsive previews.',
    highlights: [
      '15+ production-grade modular e-commerce content blocks',
      'Dynamic typography injection (Google Fonts) with real-time CSS variables',
      'Instant cache purge and sub-50ms edge synchronization',
    ],
    icon: Sparkles,
  },
  {
    id: 'edge-performance',
    category: 'architecture',
    categoryLabel: 'Edge Architecture & Speed',
    question: 'How fast is the Next.js 16 Edge storefront performance?',
    answer:
      'Our modern architecture is built on Next.js 16 Edge runtime and global serverless compute. Every page and product asset is compiled and distributed across global Anycast CDN edge nodes, delivering sub-50ms Time-To-First-Byte (TTFB) across India, North America, Europe, and the Middle East. This ensures perfect Google Core Web Vitals (LCP < 1.2s) and significantly reduces mobile cart drop-offs.',
    highlights: [
      'Sub-50ms global TTFB response times across all devices',
      'Automated WebP image optimization and media CDN delivery',
      '100/100 Google Lighthouse Core Web Vitals score optimization',
    ],
    icon: Zap,
  },
  {
    id: 'trial-deposit',
    category: 'pricing',
    categoryLabel: 'Pricing & Cloud Economics',
    question: 'How does the 14-Day Evaluation Sandbox Trial & Refund policy work?',
    answer:
      'We offer a full 14-day evaluation sandbox for ₹2,000 deposit. During this trial, we provision your live test storefront and merchant admin workspace. If you proceed with the platform license, the ₹2,000 deposit is 100% credited toward your license fee. If you decide not to proceed for any reason, we provide a 50% risk-free refund (₹1,000 back).',
    highlights: [
      '₹2,000 deposit is 100% credited against your final platform license',
      '50% risk-free refund if you decide not to proceed',
      'Full access to all CMS blocks, product catalog features, and admin workflows',
    ],
    icon: DollarSign,
  },
  {
    id: 'migration-support',
    category: 'migration',
    categoryLabel: 'Catalog Migration & Launch',
    question: 'Can I migrate my existing products and customers from Shopify or WooCommerce?',
    answer:
      'Yes. Our automated catalog importer supports standard CSV/JSON exports from Shopify, WooCommerce, and Magento. We migrate your product descriptions, variant matrix (colors, sizes, SKUs), inventory quantities, high-resolution media URLs, and customer databases with zero downtime.',
    highlights: [
      '1-click CSV import for products, variants, images, and prices',
      'Customer database and order history migration assistance',
      'Zero-downtime DNS cutover with automated SSL issuance',
    ],
    icon: Layers,
  },
  {
    id: 'multi-tenant-isolation',
    category: 'ownership',
    categoryLabel: 'Data Ownership & Privacy',
    question: 'How does multi-tenant database isolation work under the hood?',
    answer:
      'Each tenant store provisioned through Mavenco is assigned its own dedicated MongoDB database namespace (e.g. `tenant_yourbrand`). Middleware at the Next.js Edge layer validates request hostnames and securely injects the tenant isolation token into data queries, guaranteeing that no tenant can ever read or write another tenant’s data.',
    highlights: [
      'Strict logical and physical database namespace separation',
      'Cryptographically verified edge middleware tenant resolution',
      'Isolated indexing and dedicated backup snapshots',
    ],
    icon: Lock,
  },
  {
    id: 'custom-features',
    category: 'architecture',
    categoryLabel: 'Architecture & Customization',
    question: 'Can we build custom features or integrate our custom ERP / CRM / WMS?',
    answer:
      'Yes. Because Mavenco is a fully headless architecture, you have complete access to our REST API, GraphQL schemas, and Webhook dispatch engine. You can effortlessly connect custom ERPs (SAP, NetSuite), warehouse management systems (Shiprocket, Delhivery), loyalty engines, or custom analytics pipelines.',
    highlights: [
      'Full headless REST API & Webhook dispatch engine',
      'Custom shipping aggregator integrations (Shiprocket, Bluedart, Delhivery)',
      'Custom ERP/SAP sync available on Professional & Enterprise tiers',
    ],
    icon: Cpu,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions', count: FAQS.length },
  { id: 'ownership', label: 'Data & Security', count: FAQS.filter((f) => f.category === 'ownership').length },
  { id: 'pricing', label: 'Pricing & Cloud', count: FAQS.filter((f) => f.category === 'pricing').length },
  { id: 'payments', label: 'Payments & Payouts', count: FAQS.filter((f) => f.category === 'payments').length },
  { id: 'domains', label: 'Domains & Branding', count: FAQS.filter((f) => f.category === 'domains').length },
  { id: 'cms', label: 'Visual CMS & Design', count: FAQS.filter((f) => f.category === 'cms').length },
  { id: 'architecture', label: 'Speed & Architecture', count: FAQS.filter((f) => f.category === 'architecture').length },
  { id: 'migration', label: 'Migration & Launch', count: FAQS.filter((f) => f.category === 'migration').length },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['data-ownership', 'commission-structure']));

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.categoryLabel.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenItems(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 select-none pb-24">
      {/* ─── Hero Header ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Platform Knowledge Base &amp; Architecture FAQ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Frequently Asked Questions <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-200 to-emerald-400">
              Everything You Need to Know
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-sans leading-relaxed">
            Clear, transparent answers on our multi-tenant headless architecture, transparent billing economics, custom domain routing, and enterprise cloud SLA guarantees.
          </p>

          {/* Interactive Live Search Input */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., pricing, database ownership, payment gateway, custom domain)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#121522] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 shadow-2xl transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main FAQ Interactive Section ─────────────────────────────────── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Pills & Expand/Collapse Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50 scale-105'
                      : 'bg-[#121522] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-black/40 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <button
              type="button"
              onClick={expandAll}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Expand All
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Results Counter */}
        {searchQuery && (
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredFaqs.length}</strong> results for &ldquo;
            <span className="text-rose-400">{searchQuery}</span>&rdquo;
          </div>
        )}

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="p-12 bg-[#10131E] border border-slate-800 rounded-3xl text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No matching questions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any FAQs matching your query. Please try searching for a different keyword or reach out directly to our architecture concierge.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              const Icon = faq.icon;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#121524] border-rose-500/50 shadow-2xl shadow-rose-950/20'
                      : 'bg-[#0E101A] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md'
                            : 'bg-[#151826] text-slate-400 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400/80 font-mono block">
                          {faq.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug mt-0.5">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-800/80 ml-0 sm:ml-13">
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {faq.answer}
                      </p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="p-4 bg-[#0A0C10] rounded-xl border border-slate-800/80 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Key Architectural Guarantees:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {faq.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Still Have Questions Concierge Card ─────────────────────────── */}
        <div className="bg-gradient-to-r from-[#141728] via-[#101320] to-[#121524] border border-rose-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated Solutions Concierge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white max-w-xl mx-auto leading-tight">
            Have a Specific Question About Your Store or Custom Setup?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Our Lead Solutions Architect is available to review your catalog scale, walk through the headless CMS, or provision a 14-day evaluation sandbox.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/918239019096?text=Hi%20Ammar,%20I%20have%20questions%20regarding%20Mavenco%20Commerce%20platform%20architecture"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 82390 19096)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <DollarSign className="w-4 h-4" />
              <span>View Pricing &amp; ROI Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <span>Back to Platform Showcase</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
