import React from 'react';
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { Sparkles, Quote, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { getTenantDatabase } from '@/lib/mongodb';
import { getDefaultAboutPageConfig, AboutPageConfig } from '@/lib/cms-page-presets';

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

async function getAboutPageConfig(tenantSlug: string): Promise<{
  config: AboutPageConfig;
  storeName: string;
  accentColor: string;
}> {
  try {
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [{ type: 'about-page' }, { slug: 'about' }, { id: 'about' }],
      });

      const tenantDoc = await db.collection('tenants').findOne({ slug: tenantSlug });
      const storeName = tenantDoc?.name || (tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1));
      const fallbackConfig = getDefaultAboutPageConfig(tenantSlug, tenantDoc);

      const config: AboutPageConfig = doc?.config ? { ...fallbackConfig, ...doc.config } : fallbackConfig;
      const accentColor =
        doc?.styles?.accentColor ||
        doc?.config?.design?.accentColor ||
        tenantDoc?.theme?.accentColor ||
        fallbackConfig.design.accentColor ||
        '#EAB308';

      return { config, storeName, accentColor };
    }
  } catch (err) {
    console.error('Failed to load about page config from MongoDB:', err);
  }

  const fallback = getDefaultAboutPageConfig(tenantSlug);
  return {
    config: fallback,
    storeName: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
    accentColor: fallback.design.accentColor,
  };
}

export default async function AboutPage(props: {
  searchParams?: { tenant?: string } | Promise<{ tenant?: string }>;
}) {
  const tenantSlug = await resolveTenantSlug(props.searchParams);
  const { config, storeName, accentColor } = await getAboutPageConfig(tenantSlug);

  return (
    <div className="w-full bg-[#07090E] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 w-full">
        {/* Atelier Hero */}
        <section
          className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-center p-8 sm:p-14 border shadow-2xl"
          style={{ borderColor: `${accentColor}30` }}
        >
          <img
            src={config.heroImage}
            alt="Atelier Heritage"
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-transparent" />

          <div className="relative text-center max-w-3xl space-y-4">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor,
                borderColor: `${accentColor}40`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
              {config.heroBadge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              {config.heroHeadline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {config.heroSubtext}
            </p>
          </div>
        </section>

        {/* Founder Vision Statement */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121522] to-[#170E1A] border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <img
              src={config.founderImage}
              alt={config.founderName}
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: `${accentColor}60` }}
            />
            <div
              className="absolute -bottom-2 -right-2 p-2 rounded-full text-slate-900 shadow-lg font-bold"
              style={{ backgroundColor: accentColor }}
            >
              <Quote className="w-4 h-4 text-black" />
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <p className="text-lg sm:text-2xl font-serif italic text-slate-100 leading-relaxed">
              &ldquo;{config.founderQuote}&rdquo;
            </p>
            <div>
              <div className="font-bold text-white text-base">{config.founderName}</div>
              <div
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: accentColor }}
              >
                {config.founderRole}
              </div>
            </div>
          </div>
        </section>

        {/* Pillars of Excellence */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Our Master Commitments</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Uncompromising standards guiding every creation that leaves our atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.pillars?.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0E111C] border border-slate-800 hover:border-opacity-60 transition-all space-y-3"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm"
                  style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
                >
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-white text-base">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Metrics / Stats */}
        {config.stats && config.stats.length > 0 && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 rounded-3xl bg-[#0B0D16] border border-slate-800/80">
            {config.stats.map((st, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight" style={{ color: accentColor }}>
                  {st.value}
                </div>
                <div className="text-xs text-slate-400 font-medium">{st.label}</div>
              </div>
            ))}
          </section>
        )}

        {/* Direct Concierge CTA */}
        <section
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#111422] to-[#1A1320] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">Experience {storeName} In Person</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule a bespoke consultation or private viewing with our master stylists.
            </p>
          </div>

          <Link
            href={`/contact?tenant=${tenantSlug}`}
            className="px-6 py-3.5 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #B45309)`,
              color: '#000000',
              fontWeight: 800,
            }}
          >
            <span>Book Private Salon Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
