import React from 'react';
import { headers, cookies } from 'next/headers';
import { MapPin, Phone, Clock, Mail, Building, Send, Sparkles } from 'lucide-react';
import { getTenantDatabase } from '@/lib/mongodb';
import { getDefaultContactPageConfig, ContactPageConfig } from '@/lib/cms-page-presets';

export const revalidate = 0; // Dynamic on request

async function resolveTenantSlug(searchParams?: { tenant?: string } | Promise<{ tenant?: string }>): Promise<string> {
  let resolvedParams: { tenant?: string } = {};
  if (searchParams) {
    try {
      resolvedParams = await Promise.resolve(searchParams);
    } catch {}
  }
  if (resolvedParams?.tenant && resolvedParams.tenant.trim()) {
    return resolvedParams.tenant.toLowerCase().trim();
  }

  try {
    const headerList = await headers();
    const hTenant = headerList.get('x-tenant-slug');
    if (hTenant && hTenant.trim()) {
      return hTenant.toLowerCase().trim();
    }
  } catch {}

  try {
    const cookieStore = await cookies();
    const cTenant = cookieStore.get('jq_active_tenant')?.value;
    if (cTenant && cTenant.trim()) {
      return cTenant.toLowerCase().trim();
    }
  } catch {}

  return 'silvora';
}

async function getContactPageConfig(tenantSlug: string): Promise<{
  config: ContactPageConfig;
  storeName: string;
  accentColor: string;
}> {
  try {
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [{ type: 'contact-page' }, { slug: 'contact' }, { id: 'contact' }],
      });

      const tenantDoc = await db.collection('tenants').findOne({ slug: tenantSlug });
      const storeName = tenantDoc?.name || (tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1));
      const fallbackConfig = getDefaultContactPageConfig(tenantSlug, tenantDoc);

      const config: ContactPageConfig = doc?.config ? { ...fallbackConfig, ...doc.config } : fallbackConfig;
      const accentColor =
        doc?.styles?.accentColor ||
        doc?.config?.design?.accentColor ||
        tenantDoc?.theme?.accentColor ||
        fallbackConfig.design.accentColor ||
        '#EAB308';

      return { config, storeName, accentColor };
    }
  } catch (err) {
    console.error('Failed to load contact page config from MongoDB:', err);
  }

  const fallback = getDefaultContactPageConfig(tenantSlug);
  return {
    config: fallback,
    storeName: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
    accentColor: fallback.design.accentColor,
  };
}

export default async function ContactPage(props: {
  searchParams?: { tenant?: string } | Promise<{ tenant?: string }>;
}) {
  const tenantSlug = await resolveTenantSlug(props.searchParams);
  const { config, storeName, accentColor } = await getContactPageConfig(tenantSlug);

  const badgeText = config.badgeText || config.design?.badgeText || 'DIRECT ATELIER ACCESS';
  const buttonText = config.design?.buttonText || 'Send Direct Inquiry to Stylist Concierge';

  return (
    <div className="w-full bg-[#07090E] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: `${accentColor}1A`,
              color: accentColor,
              borderColor: `${accentColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            {badgeText}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            {config.pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {config.pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Physical Stores (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <Building className="w-5 h-5" style={{ color: accentColor }} />
              <span>Flagship Boutiques &amp; Salons</span>
            </h2>

            <div className="space-y-4">
              {config.stores?.map((store, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#0E111C] border border-slate-800 hover:border-opacity-60 transition-all space-y-3"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <h3 className="text-base font-bold text-white" style={{ color: accentColor }}>
                    {store.city}
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${store.phone}`}
                        className="hover:underline transition-colors"
                        style={{ color: '#E2E8F0' }}
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Inquiry Desk (6 Cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#101320] border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <Mail className="w-5 h-5" style={{ color: accentColor }} />
                <span>Concierge &amp; Order Desk</span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct dispatch to{' '}
                <span className="font-mono font-bold" style={{ color: accentColor }}>
                  {config.notificationEmail}
                </span>
              </p>
            </div>

            <form
              action={`mailto:${config.notificationEmail}`}
              method="GET"
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Your Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="priya@example.com"
                    className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Inquiry Topic</label>
                <select
                  name="subject"
                  className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  {config.formSubjectOptions?.map((opt, i) => (
                    <option key={i} value={opt} className="bg-[#101320] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Your Message / Requirements</label>
                <textarea
                  required
                  rows={4}
                  name="body"
                  placeholder={`How may our ${storeName} stylists or fulfillment specialists assist you?`}
                  className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #B45309)`,
                  color: '#000000',
                  fontWeight: 800,
                }}
              >
                <Send className="w-4 h-4" />
                <span>{buttonText}</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
