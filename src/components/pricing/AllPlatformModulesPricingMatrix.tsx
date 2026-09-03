'use client';

import React, { useState, useMemo } from 'react';
import {
  Check,
  X,
  Sparkles,
  Search,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  Cpu,
  Layout,
  Globe,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';

export interface ModuleDefinition {
  key: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  starter: boolean;
  pro: boolean;
  enterprise: boolean;
  highlight?: string;
}

export const ALL_48_MODULES: ModuleDefinition[] = [
  // ─── 1. CATALOG & MERCHANDISING (4) ───────────────────────────────────────
  {
    key: 'products',
    name: 'Products & SKU Management',
    category: 'catalog',
    categoryLabel: 'Catalog & Merchandising',
    description: 'Enterprise PIM with multi-tier variants, barcode tagging, custom attributes, and automated inventory sync.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Core Foundation',
  },
  {
    key: 'categories',
    name: 'Category Taxonomy & Hierarchy',
    category: 'catalog',
    categoryLabel: 'Catalog & Merchandising',
    description: 'Deep nested multi-level collections, custom breadcrumbs, category banner assets, and SEO URL slugs.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'collections',
    name: 'Curated Collections & Drops',
    category: 'catalog',
    categoryLabel: 'Catalog & Merchandising',
    description: 'Automated rule-based and hand-picked product groupings, seasonal capsules, and limited drop counters.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'inventory',
    name: 'Multi-Warehouse Inventory Tracking',
    category: 'catalog',
    categoryLabel: 'Catalog & Merchandising',
    description: 'Real-time stock reservation locks, low-stock threshold triggers, safety stock buffer, and location routing.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Multi-Location',
  },

  // ─── 2. SALES, OPS & FINANCE (7) ──────────────────────────────────────────
  {
    key: 'orders',
    name: 'Order Lifecycle & Operations',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Real-time order state machine, split fulfillment, batch dispatch labels, packing slips, and order notes.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'High-Concurrency',
  },
  {
    key: 'shipping',
    name: 'Shipping Engine & Carrier Rates',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Zone-based flat rate matrices, weight calculation rules, Shiprocket/Delhivery webhooks, and live tracking.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'returns',
    name: 'Returns & Reverse Logistics (RMA)',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Automated customer returns portal, photo inspection workflows, store credit exchange, and reverse pickup.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'invoices',
    name: 'Automated Invoices & GST Billing',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Automated PDF tax invoices, sequential numbering series, HSN/SAC code mapping, and B2B GSTIN validation.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'GST Compliant',
  },
  {
    key: 'payments',
    name: 'Multi-Gateway Payment Router',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Native Razorpay, Stripe, Cashfree, UPI QR, and Cash on Delivery with phone OTP verification.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'finance',
    name: 'Financial Ledger & Payout Audit',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'Double-entry platform ledger, payment gateway fee reconciliation, profit margin tracking, and tax reports.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Enterprise Only',
  },
  {
    key: 'tax',
    name: 'Dynamic Multi-Jurisdiction Tax',
    category: 'sales',
    categoryLabel: 'Sales & Fulfillment',
    description: 'CGST / SGST / IGST auto-computation, destination-based tax rules, export 0% tax, and digital tax exemptions.',
    starter: true,
    pro: true,
    enterprise: true,
  },

  // ─── 3. CUSTOMERS, LOYALTY & RETENTION (4) ────────────────────────────────
  {
    key: 'customers',
    name: 'Customer CRM & Behavioral Profiles',
    category: 'customers',
    categoryLabel: 'Customers & Loyalty',
    description: 'Complete customer 360 profile, lifetime spend (LTV), order frequency, RFM segmentation, and internal tags.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'reviews',
    name: 'Reviews & Visual UGC Studio',
    category: 'customers',
    categoryLabel: 'Customers & Loyalty',
    description: 'Verified buyer reviews, customer photo/video gallery, star histograms, and SEO Rich Snippets JSON-LD.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Verified UGC',
  },
  {
    key: 'loyalty',
    name: 'Tiered Loyalty & Rewards Engine',
    category: 'customers',
    categoryLabel: 'Customers & Loyalty',
    description: 'Point-for-purchase rules, VIP bronze/silver/gold tiers, referral rewards, and 1-click cart point redemption.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Enterprise VIP',
  },
  {
    key: 'giftCards',
    name: 'Digital Gift Cards & Store Credit',
    category: 'customers',
    categoryLabel: 'Customers & Loyalty',
    description: 'Omnichannel digital gift vouchers with custom redemption codes, personalized email delivery, and balance wallets.',
    starter: false,
    pro: false,
    enterprise: true,
  },

  // ─── 4. MARKETING, GROWTH & AI STUDIO (10) ────────────────────────────────
  {
    key: 'marketing',
    name: 'Marketing Campaigns & Attribution',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Centralized campaign hub with UTM tracking, first/last touch attribution, and promotional calendar planning.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'communications',
    name: 'Omnichannel WhatsApp & SMS Engine',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Automated WhatsApp order confirmation, dispatch alerts, OTP verification, and broadcast messaging.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'WhatsApp Native',
  },
  {
    key: 'discounts',
    name: 'Smart Discount Rules Engine',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Buy-X-Get-Y (BOGO), tiered volume pricing, customer group pricing, and automatic minimum-spend price drops.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'abandonedCart',
    name: 'Abandoned Cart Recovery Machine',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Timed multi-stage recovery triggers via WhatsApp and email with pre-filled 1-click checkout recovery links.',
    starter: false,
    pro: true,
    enterprise: true,
    highlight: '3x Conversion Boost',
  },
  {
    key: 'campaigns',
    name: 'Paid Ads Tracking & CAPI Sync',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Meta Conversions API (CAPI), Google Tag Manager server-side event stream, and TikTok Pixel integration.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'coupons',
    name: 'Coupons & Promotional Codes',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Personalized coupon codes, single-use vouchers, minimum cart thresholds, and auto-expiring promotional discounts.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'seoSettings',
    name: 'Dynamic Meta & Structured Data SEO',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Automated XML sitemaps, OpenGraph image generator, dynamic canonical tags, and Google Merchant Feed.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'search',
    name: 'Instant Fuzzy Search Studio',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Sub-20ms instant predictive search, typo tolerance, custom synonym mappings, and promoted search merchandising.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Sub-20ms Search',
  },
  {
    key: 'ai',
    name: 'AI Copywriting & Merchandising Copilot',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Automated luxury product descriptions, SEO meta tag generator, visual image tagger, and trend predictions.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'AI Powered',
  },
  {
    key: 'analytics',
    name: 'Real-Time Conversion Funnel Analytics',
    category: 'marketing',
    categoryLabel: 'Marketing & AI Studio',
    description: 'Live active visitors, checkout drop-off funnels, cohort retention curves, revenue heatmaps, and device metrics.',
    starter: false,
    pro: false,
    enterprise: true,
  },

  // ─── 5. HEADLESS CMS & DESIGN STUDIO (11) ─────────────────────────────────
  {
    key: 'themeStudio',
    name: 'Visual Theme Studio & Tokens',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Tailored typography, harmonious hex color palettes, border radius curves, and real-time live preview switcher.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Flagship Preset',
  },
  {
    key: 'productCards',
    name: 'Dynamic Product Card Studio',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Custom card aspect ratios, secondary hover image flip, discount tag pill placement, and quick-add drawer.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'headerBuilder',
    name: 'Visual Header & Mega Menu Builder',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Sticky glassmorphism navbar, multi-level dropdown mega-menus, search drawer trigger, and announcement bar.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'footerBuilder',
    name: 'Visual Footer & Policy Builder',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Multi-column link trees, newsletter capture form, copyright credentials, social icons, and payment badges.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'homepageBuilder',
    name: 'Drag & Drop Homepage Studio',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Visual section reordering, full-width cinematic hero sliders, featured collections carousel, and brand story blocks.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Drag & Drop',
  },
  {
    key: 'collectionsBuilder',
    name: 'Collections PLP Visual Builder',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Faceted filter sidebar, price range sliders, collection hero banners, and responsive 2/3/4-column product grids.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'productPageBuilder',
    name: 'Bespoke PDP Layout Builder',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Sticky thumbnail gallery, dynamic size chart modals, collapsible accordions, and related product cross-sells.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'customPages',
    name: 'Custom CMS Pages Engine',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Create unlimited rich informational pages: About Us, Press, Sustainability Story, Brand Heritage, and FAQ.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'richCms',
    name: 'Rich Editorial CMS & Lookbook Stories',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'High-fashion digital magazine layout, shoppable lookbook hotspots, editorial articles, and brand journals.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'media',
    name: 'Cloud Media Asset Manager',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Next-gen image CDN with automated WebP compression, drag-and-drop file uploader, and asset tagging.',
    starter: true,
    pro: true,
    enterprise: true,
    highlight: 'Auto WebP CDN',
  },
  {
    key: 'navigation',
    name: 'Omnichannel Navigation Menus',
    category: 'cms',
    categoryLabel: 'CMS & Design Studio',
    description: 'Custom header menus, mobile bottom app bar navigation, footer link groups, and quick sidebar navigation.',
    starter: true,
    pro: true,
    enterprise: true,
  },

  // ─── 6. ECOSYSTEM, CHANNELS & DEVELOPERS (8) ──────────────────────────────
  {
    key: 'multiStore',
    name: 'Multi-Store & Regional Workspaces',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Manage multiple regional storefronts (US, India, UK, UAE) with separate currencies from a single superadmin console.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Multi-Brand',
  },
  {
    key: 'channels',
    name: 'Omnichannel Sales Channels',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Syndicate product catalog feeds to Google Shopping XML, Facebook Catalog, Instagram Shop, and Pinterest.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'customDomains',
    name: 'Custom Domain & Auto SSL Engine',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Connect your own root domain (e.g. yourbrand.com) with automated Let’s Encrypt edge SSL certificates.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'apiAccess',
    name: 'Headless REST & GraphQL APIs',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Sub-40ms edge REST endpoints and complete documentation for custom mobile apps, IoT devices, and ERP integrations.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Headless Core',
  },
  {
    key: 'integrations',
    name: 'Integration Hub & Webhook Bus',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Real-time outbound event Webhooks, Zapier / Make integration, Slack notification alerts, and CRM webhooks.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'automations',
    name: 'Event-Driven Workflow Automations',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'No-code event trigger builder: "When order > ₹5,000, send WhatsApp VIP greeting and tag customer as High-LTV".',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'No-Code Logic',
  },
  {
    key: 'apps',
    name: 'Modular App & Extension Marketplace',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: '1-click modular extensions to install customized business capabilities without altering core storefront code.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'developers',
    name: 'Developer Sandbox & Key Manager',
    category: 'ecosystem',
    categoryLabel: 'Ecosystem & Developers',
    description: 'Generate publishable client keys, secret admin tokens, webhook payload simulators, and interactive API swagger docs.',
    starter: false,
    pro: false,
    enterprise: true,
  },

  // ─── 7. GOVERNANCE, SECURITY & MULTI-TENANT RBAC (4) ──────────────────────
  {
    key: 'users',
    name: 'Staff & Merchant Account Management',
    category: 'governance',
    categoryLabel: 'Governance & Security',
    description: 'Invite team members, assign individual passwords, enforce 2FA verification, and monitor team status.',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    key: 'roles',
    name: 'Granular Roles & RBAC Permissions',
    category: 'governance',
    categoryLabel: 'Governance & Security',
    description: 'Custom permission policies per staff: restrict finance access, grant fulfillment-only view, or lock CMS editing.',
    starter: false,
    pro: false,
    enterprise: true,
    highlight: 'Zero-Trust RBAC',
  },
  {
    key: 'activity',
    name: 'Immutable Security Audit Logs',
    category: 'governance',
    categoryLabel: 'Governance & Security',
    description: 'Complete audit trail of every staff mutation, IP address logging, price changes, and security events.',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    key: 'billing',
    name: 'SaaS Billing & Cloud Usage Metering',
    category: 'governance',
    categoryLabel: 'Governance & Security',
    description: 'Automated invoice generation, cloud compute usage tracking, payment receipts, and upgrade management.',
    starter: true,
    pro: true,
    enterprise: true,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All 48 Modules', count: 48, icon: Layers },
  { id: 'catalog', label: 'Catalog & Products', count: 4, icon: ShoppingBag },
  { id: 'sales', label: 'Sales & Operations', count: 7, icon: Truck },
  { id: 'customers', label: 'Customers & Loyalty', count: 4, icon: Users },
  { id: 'marketing', label: 'Marketing & AI Studio', count: 10, icon: Cpu },
  { id: 'cms', label: 'CMS & Design Studio', count: 11, icon: Layout },
  { id: 'ecosystem', label: 'Ecosystem & APIs', count: 8, icon: Globe },
  { id: 'governance', label: 'Governance & RBAC', count: 4, icon: ShieldCheck },
];

export function AllPlatformModulesPricingMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredModules = useMemo(() => {
    return ALL_48_MODULES.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.highlight && m.highlight.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div id="all-modules" className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10 border-b border-slate-800 pb-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/15 to-amber-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Complete Architecture Specification</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            All 48 Enterprise Modules <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
              Detailed Plan Breakdown
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Every capability is built directly into our native Next.js 16 headless engine. Zero third-party app subscription bloat ($0/month app fees). Compare all 48 modules across our 3 tiers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any module (e.g. WhatsApp, GST, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141724] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-hidden transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 font-mono"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin relative z-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-transparent shadow-lg shadow-rose-950/40'
                  : 'bg-[#141724] text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0C0E15] relative z-10 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#131622] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-5 w-5/12">Module &amp; Enterprise Capability</th>
              <th className="py-4 px-3 text-center w-2/12">
                <div className="space-y-0.5">
                  <div className="text-rose-300 font-black">Tier 01 • Starter</div>
                  <div className="text-[9px] text-slate-500 font-normal font-mono">₹24,999 One-Time</div>
                </div>
              </th>
              <th className="py-4 px-3 text-center w-2/12 bg-rose-950/20 border-x border-rose-500/20">
                <div className="space-y-0.5">
                  <div className="text-amber-300 font-black">Tier 02 • Pro Scale</div>
                  <div className="text-[9px] text-amber-400/80 font-normal font-mono">₹49,999 One-Time</div>
                </div>
              </th>
              <th className="py-4 px-3 text-center w-3/12 bg-gradient-to-r from-amber-950/20 to-emerald-950/20">
                <div className="space-y-0.5">
                  <div className="text-emerald-300 font-black">Tier 03 • Enterprise</div>
                  <div className="text-[9px] text-emerald-400/80 font-normal font-mono">₹1,39,999 One-Time</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredModules.map((mod, idx) => (
              <tr
                key={mod.key}
                className={`transition-colors hover:bg-[#131622]/60 ${
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-[#0E1018]/40'
                }`}
              >
                {/* Module Details */}
                <td className="py-3.5 px-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-[13px]">{mod.name}</span>
                    {mod.highlight && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/30">
                        {mod.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                    {mod.description}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Category: <span className="text-slate-400">{mod.categoryLabel}</span>
                  </div>
                </td>

                {/* Tier 01: Starter */}
                <td className="py-3.5 px-3 text-center align-middle">
                  {mod.starter ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Included</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-mono text-[11px]">—</span>
                  )}
                </td>

                {/* Tier 02: Pro Scale */}
                <td className="py-3.5 px-3 text-center align-middle bg-rose-950/10 border-x border-rose-500/20">
                  {mod.pro ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      <Check className="w-3.5 h-3.5 text-rose-400" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-mono text-[11px]">—</span>
                  )}
                </td>

                {/* Tier 03: Enterprise */}
                <td className="py-3.5 px-3 text-center align-middle bg-emerald-950/10">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black tracking-wide">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>UNLIMITED</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 via-[#131622] to-amber-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Need a custom module or bespoke ERP connector?</div>
            <div className="text-slate-400 text-xs">
              Every license includes full source-code ownership with extensible TypeScript modules.
            </div>
          </div>
        </div>

        <a
          href="https://mavenco-admin.vercel.app/login"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>Provision Your Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
