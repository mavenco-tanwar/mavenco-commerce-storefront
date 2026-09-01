'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Store,
  Layers,
  Palette,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Zap,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  Send,
  Building2,
  ArrowRight,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency-context';

export function PlatformNavbar() {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Demo Request Form State
  const [fullName, setFullName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [brandName, setBrandName] = useState('');
  const [interestedPlan, setInterestedPlan] = useState('Professional Scale (₹49,999)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [demoStores, setDemoStores] = useState<Array<{ slug: string; name: string; industry: string; badge: string }>>([]);

  React.useEffect(() => {
    fetch('/api/v1/platform/tenants')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const mapped = json.data.map((t: any) => ({
            slug: t.slug,
            name: t.name,
            industry: t.tagline || 'Modern Commerce Store',
            badge: t.planName || 'Live Storefront',
          }));
          setDemoStores(mapped);
        } else {
          setDemoStores([]);
        }
      })
      .catch(() => {
        setDemoStores([]);
      });
  }, []);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: contactEmail,
          phone: contactPhone,
          brandName,
          interestedPlan,
          source: 'Platform Navbar Demo Modal',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn('Inquiry notice:', data?.error);
      }
    } catch (err) {
      console.warn('Inquiry dispatch err:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const resetDemoForm = () => {
    setIsDemoModalOpen(false);
    setIsSubmitted(false);
    setFullName('');
    setContactEmail('');
    setContactPhone('');
    setBrandName('');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0A0C10]/95 backdrop-blur-md border-b border-slate-800 text-white select-none">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-emerald-950/80 border-b border-slate-800/80 px-4 py-1.5 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>
            <strong>Mavenco Commerce Engine</strong> — Next-Generation Headless Visual CMS &amp; Multi-Tenant Platform
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>MAVENCO</span>
                <span className="text-rose-400 font-medium text-xs px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 uppercase tracking-wider">
                  COMMERCE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide -mt-0.5">Headless SaaS Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
            {/* Live Brand Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-rose-300 border border-rose-500/30 transition-all font-bold"
              >
                <Store className="w-3.5 h-3.5 text-rose-400" />
                <span>Live Brand Switcher</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStoreMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-80 bg-[#12151F] border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsStoreMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Explore Live Tenant Stores</span>
                    <span className="text-emerald-400 font-mono">Next.js Edge</span>
                  </div>
                  {demoStores.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No active stores provisioned yet. Create a live store from Superadmin!
                    </div>
                  ) : (
                    demoStores.map((store) => (
                      <Link
                        key={store.slug}
                        href={`/stores/${store.slug}`}
                        onClick={() => setIsStoreMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group border border-transparent hover:border-slate-700"
                      >
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                            <span>{store.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{store.industry}</div>
                        </div>
                        <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                          Launch &rarr;
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link href="/cms" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Visual CMS</span>
            </Link>

            <Link href="/pricing" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>SaaS Pricing</span>
            </Link>

            <Link href="/status" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Status</span>
            </Link>

            <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Enterprise FAQ</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 rounded-xl shadow-lg shadow-rose-950/40 transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Us for Demo</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0F111A] border-b border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Client Stores</div>
            <div className="space-y-1">
              {demoStores.map((store) => (
                <Link
                  key={store.slug}
                  href={`/stores/${store.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-white"
                >
                  <div className="font-bold">{store.name}</div>
                  <div className="text-[11px] text-slate-400">{store.industry}</div>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 bg-slate-800 text-center font-bold text-xs text-slate-200 rounded-lg"
              >
                SaaS Pricing & Plans
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 bg-slate-800 text-center font-bold text-xs text-slate-200 rounded-lg"
              >
                Enterprise FAQ
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 text-center font-bold text-xs text-white rounded-lg flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Us for Demo</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* CONTACT US FOR ADMIN DEMO MODAL */}
      {/* ========================================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141724] border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Contact Us for Admin Panel Demo</h3>
                  <p className="text-xs text-slate-400">Get a guided live walkthrough or custom evaluation sandbox</p>
                </div>
              </div>
              <button
                onClick={resetDemoForm}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Email Channel Banner */}
            <div>
              <a
                href="mailto:ammar.tanwar.dev@gmail.com?subject=Request%20Admin%20Panel%20Demo%20-%20Mavenco%20Platform&body=Hi%20Mavenco%20Team%2C%0A%0AI%20would%20like%20to%20request%20a%20live%20demo%20of%20the%20Merchant%20Admin%20Panel.%0A%0AName%3A%0ABrand%20Name%3A%0AEmail%3A"
                className="w-full p-3.5 bg-gradient-to-r from-rose-500/15 via-slate-900 to-amber-500/15 hover:from-rose-500/25 hover:to-amber-500/25 border border-rose-500/30 rounded-2xl text-left flex items-center justify-between transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 border border-rose-500/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">
                      Direct Email Support Channel
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">ammar.tanwar.dev@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  Compose Email &rarr;
                </span>
              </a>
            </div>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleDemoSubmit} className="space-y-3.5 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Or Send Us Your Details Below:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#0C0E17] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium">Brand / Store Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zenith Apparel"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#0C0E17] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@brand.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#0C0E17] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium">Contact Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#0C0E17] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium">SaaS Tier of Interest</label>
                  <select
                    value={interestedPlan}
                    onChange={(e) => setInterestedPlan(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#0C0E17] border border-slate-700 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Starter Boutique (₹24,999 + ₹2,000/mo server)">
                      Starter Boutique (₹24,999 + ₹2,000/mo server)
                    </option>
                    <option value="Professional Scale (₹49,999 + ₹4,000/mo server - Recommended)">
                      Professional Scale (₹49,999 + ₹4,000/mo server - Recommended)
                    </option>
                    <option value="Enterprise Custom (₹99,999 + ₹8,000/mo server)">
                      Enterprise Custom (₹99,999 + ₹8,000/mo server)
                    </option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={resetDemoForm}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    {isSubmitting ? (
                      <span>Sending Email...</span>
                    ) : (
                      <>
                        <span>Submit Demo Request</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">Demo Request Received!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you {fullName}! Your request has been dispatched directly to <strong>ammar.tanwar.dev@gmail.com</strong>. Our team will email you within 2 hours with your sandbox demo invite.
                  </p>
                </div>

                <div className="pt-3 flex justify-center">
                  <button
                    onClick={resetDemoForm}
                    className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    Back to Platform
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
