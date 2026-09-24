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

      const config: ContactPageConfig = {
        ...fallbackConfig,
        ...(doc?.config || {}),
        design: {
          ...fallbackConfig.design,
          ...(fallbackConfig.design || {}),
          ...(doc?.config?.design || {}),
          ...(doc?.styles || {}),
        },
      };

      return { config, storeName };
    }
  } catch (err) {
    console.error('Failed to load contact page config from MongoDB:', err);
  }

  const fallback = getDefaultContactPageConfig(tenantSlug);
  return {
    config: fallback,
    storeName: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
  };
}

export default async function ContactPage(props: {
  searchParams?: { tenant?: string } | Promise<{ tenant?: string }>;
}) {
  const tenantSlug = await resolveTenantSlug(props.searchParams);
  const { config, storeName } = await getContactPageConfig(tenantSlug);
  const d = config.design;

  const badgeText = config.badgeText || d.badgeText || 'DIRECT ATELIER ACCESS';
  const buttonText = d.buttonText || 'Send Direct Inquiry to Stylist Concierge';

  return (
    <div
      className="w-full min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: d.backgroundColor || '#07090E',
        color: d.textColor || '#F8FAFC',
        fontFamily: d.bodyFont || 'inherit',
      }}
    >
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        {/* Header / Intro Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: d.headerBadgeBg || `${d.accentColor}1A`,
              color: d.headerBadgeText || d.accentColor,
              borderColor: d.headerBadgeBorder || `${d.accentColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: d.headerBadgeText || d.accentColor }} />
            {badgeText}
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight"
            style={{
              color: d.headerTitleColor || '#FFFFFF',
              fontFamily: d.headingFont || 'inherit',
            }}
          >
            {config.pageTitle}
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: d.headerSubtitleColor || d.mutedTextColor || '#94A3B8' }}
          >
            {config.pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Physical Stores / Salons Section (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h2
              className="text-xl font-bold flex items-center gap-2"
              style={{
                color: d.headerTitleColor || '#FFFFFF',
                fontFamily: d.headingFont || 'inherit',
              }}
            >
              <Building className="w-5 h-5" style={{ color: d.storeCardTitleColor || d.accentColor }} />
              <span>Flagship Boutiques &amp; Salons</span>
            </h2>

            <div className="space-y-4">
              {config.stores?.map((store, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border transition-all space-y-3"
                  style={{
                    backgroundColor: d.storeCardBg || '#0E111C',
                    borderColor: d.storeCardBorder || 'rgba(255,255,255,0.08)',
                  }}
                >
                  <h3
                    className="text-base font-bold"
                    style={{
                      color: d.storeCardTitleColor || d.accentColor,
                      fontFamily: d.headingFont || 'inherit',
                    }}
                  >
                    {store.city}
                  </h3>
                  <div
                    className="space-y-2 text-xs"
                    style={{ color: d.storeCardTextColor || '#CBD5E1' }}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: d.storeCardIconColor || '#94A3B8' }}
                      />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone
                        className="w-4 h-4 shrink-0"
                        style={{ color: d.storeCardIconColor || '#94A3B8' }}
                      />
                      <a
                        href={`tel:${store.phone}`}
                        className="hover:underline transition-colors"
                        style={{ color: d.storeCardTextColor || '#E2E8F0' }}
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        className="w-4 h-4 shrink-0"
                        style={{ color: d.storeCardIconColor || '#94A3B8' }}
                      />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concierge Inquiry Form Section (6 Cols) */}
          <div
            className="lg:col-span-6 p-8 rounded-3xl border shadow-xl space-y-6"
            style={{
              backgroundColor: d.formCardBg || '#101320',
              borderColor: d.formCardBorder || 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="space-y-1">
              <h2
                className="text-xl font-bold flex items-center gap-2"
                style={{
                  color: d.formCardTitleColor || '#FFFFFF',
                  fontFamily: d.headingFont || 'inherit',
                }}
              >
                <Mail className="w-5 h-5" style={{ color: d.accentColor }} />
                <span>Concierge &amp; Order Desk</span>
              </h2>
              <p
                className="text-xs"
                style={{ color: d.mutedTextColor || '#94A3B8' }}
              >
                Direct dispatch to{' '}
                <span className="font-mono font-bold" style={{ color: d.accentColor }}>
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
                  <label
                    className="font-semibold block"
                    style={{ color: d.textColor || '#CBD5E1' }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-3 rounded-xl placeholder-slate-500 focus:outline-none border"
                    style={{
                      backgroundColor: d.formInputBg || '#080A10',
                      borderColor: d.formInputBorder || '#334155',
                      color: d.formInputTextColor || '#FFFFFF',
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="font-semibold block"
                    style={{ color: d.textColor || '#CBD5E1' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="priya@example.com"
                    className="w-full p-3 rounded-xl placeholder-slate-500 focus:outline-none border"
                    style={{
                      backgroundColor: d.formInputBg || '#080A10',
                      borderColor: d.formInputBorder || '#334155',
                      color: d.formInputTextColor || '#FFFFFF',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="font-semibold block"
                  style={{ color: d.textColor || '#CBD5E1' }}
                >
                  Inquiry Topic
                </label>
                <select
                  name="subject"
                  className="w-full p-3 rounded-xl focus:outline-none border"
                  style={{
                    backgroundColor: d.formInputBg || '#080A10',
                    borderColor: d.formInputBorder || '#334155',
                    color: d.formInputTextColor || '#FFFFFF',
                  }}
                >
                  {config.formSubjectOptions?.map((opt, i) => (
                    <option key={i} value={opt} style={{ backgroundColor: '#101320', color: '#FFFFFF' }}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  className="font-semibold block"
                  style={{ color: d.textColor || '#CBD5E1' }}
                >
                  Your Message / Requirements
                </label>
                <textarea
                  required
                  rows={4}
                  name="body"
                  placeholder={`How may our ${storeName} stylists or fulfillment specialists assist you?`}
                  className="w-full p-3 rounded-xl placeholder-slate-500 focus:outline-none border"
                  style={{
                    backgroundColor: d.formInputBg || '#080A10',
                    borderColor: d.formInputBorder || '#334155',
                    color: d.formInputTextColor || '#FFFFFF',
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                style={{
                  background: d.formButtonBg || `linear-gradient(135deg, ${d.accentColor}, #B45309)`,
                  color: d.formButtonTextColor || '#000000',
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
