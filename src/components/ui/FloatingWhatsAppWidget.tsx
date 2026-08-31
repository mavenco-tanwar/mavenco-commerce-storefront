'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageSquare, X, Send, Sparkles, ShieldCheck, Clock, ShoppingBag, Package, HelpCircle } from 'lucide-react';
import { resolveTenant, TenantBrandConfig } from '@/lib/tenant-config';

function FloatingWhatsAppWidgetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [tenant, setTenant] = useState<TenantBrandConfig | null>(null);

  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const tenantQuery = searchParams.get('tenant');

  // Check if current page is an isolated tenant store (e.g. /stores/muskan-clothing or ?tenant=muskan-clothing)
  const isStoreRoute =
    pathname.startsWith('/stores/') ||
    pathname.startsWith('/tenant/') ||
    !!tenantQuery ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/collections/') ||
    pathname === '/women' ||
    pathname === '/kids' ||
    pathname === '/new-arrivals' ||
    pathname === '/sale' ||
    pathname === '/cart' ||
    pathname === '/checkout';

  useEffect(() => {
    if (isStoreRoute) {
      const t = resolveTenant(tenantQuery);
      setTenant(t);

      if (t?.slug) {
        fetch(`/api/v1/tenant-config?tenant=${t.slug}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            if (json?.data?.name) {
              setTenant(json.data);
            }
          })
          .catch(() => {});
      }
    } else {
      setTenant(null);
    }
  }, [pathname, tenantQuery, isStoreRoute]);

  // Determine WhatsApp target number & prompts based on context
  const isTenantMode = isStoreRoute && tenant;
  const storeName = isTenantMode ? tenant.name : 'Mavenco Platform';
  const rawWhatsApp = isTenantMode ? tenant.contact?.whatsapp || '918239019096' : '918239019096';
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');

  const quickPrompts = isTenantMode
    ? [
        {
          label: '📦 Track My Order Delivery',
          message: `Hi ${storeName}, I would like to check the shipping status of my recent order.`,
        },
        {
          label: '📏 Sizing & Fit Guidance',
          message: `Hi ${storeName}, could you help me select the right size and fit for an item?`,
        },
        {
          label: '💬 General Product Inquiry',
          message: `Hi ${storeName}, I have a question regarding your current catalog and availability.`,
        },
      ]
    : [
        {
          label: '🚀 Request Live Admin Demo',
          message: 'Hi Ammar, I would like to request a guided live demo of the Mavenco Merchant Admin Panel.',
        },
        {
          label: '💳 Inquire About SaaS Plans & Pricing',
          message: 'Hi Ammar, I want to discuss the SaaS license pricing and server deployment for my brand.',
        },
        {
          label: '🎨 Custom Headless Storefront Migration',
          message: 'Hi Ammar, I want to migrate my existing store to the Mavenco Headless Commerce Engine.',
        },
      ];

  const handleSendPrompt = (text: string) => {
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleSendPrompt(customMsg);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#141724]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{
              background: isTenantMode
                ? `linear-gradient(135deg, ${tenant.theme?.primaryColor || '#0F172A'}, ${tenant.theme?.accentColor || '#6366F1'})`
                : 'linear-gradient(to right, #059669, #10b981, #0d9488)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold text-white text-lg">
                  {storeName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-300 border-2 border-[#141724] animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{storeName} Concierge</h4>
                <div className="text-[11px] text-white/80 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{isTenantMode ? 'Store Customer Care' : 'Typically replies in < 5 mins'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto">
            <div className="p-3 bg-[#0A0C10] rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isTenantMode ? `Need assistance with your ${storeName} order?` : 'Need immediate platform guidance?'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isTenantMode
                  ? `Chat directly with the ${storeName} team on WhatsApp for order tracking, size recommendation, or product inquiries.`
                  : 'Connect directly with our Lead Solutions Architect on WhatsApp for live pricing, custom feature scoping, or sandbox credentials.'}
              </p>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</div>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q.message)}
                  className="w-full text-left p-2.5 bg-slate-900/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-800 rounded-xl text-xs text-slate-200 hover:text-emerald-300 transition-all font-medium flex items-center justify-between group"
                >
                  <span>{q.label}</span>
                  <Send className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>

            {/* Custom message input */}
            <form onSubmit={handleSendCustom} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={isTenantMode ? `Message ${storeName}...` : 'Type custom question...'}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 bg-[#0A0C10] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>
                {isTenantMode ? `${storeName} Support: +${cleanWhatsApp}` : `Direct WhatsApp Channel: +91 82390 19096`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 text-white rounded-full shadow-2xl shadow-emerald-950/80 transition-all hover:scale-105 border"
        style={{
          backgroundColor: isTenantMode ? tenant.theme?.accentColor || '#059669' : '#059669',
          borderColor: isTenantMode ? `${tenant.theme?.accentColor || '#10b981'}80` : '#34d39966',
        }}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-xs font-bold hidden sm:inline">
          {isTenantMode ? `${storeName} Support` : 'WhatsApp Concierge'}
        </span>
      </button>
    </div>
  );
}

export function FloatingWhatsAppWidget() {
  return (
    <Suspense fallback={null}>
      <FloatingWhatsAppWidgetContent />
    </Suspense>
  );
}
