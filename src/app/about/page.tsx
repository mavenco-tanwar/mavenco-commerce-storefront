import React from 'react';
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { Sparkles, Quote, ArrowRight } from 'lucide-react';
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

      const config: AboutPageConfig = {
        ...fallbackConfig,
        ...(doc?.config || {}),
        sectionsEnabled: {
          ...fallbackConfig.sectionsEnabled,
          ...(doc?.config?.sectionsEnabled || {}),
        },
        customSections: doc?.config?.customSections || fallbackConfig.customSections || [],
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
    console.error('Failed to load about page config from MongoDB:', err);
  }

  const fallback = getDefaultAboutPageConfig(tenantSlug);
  return {
    config: fallback,
    storeName: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
  };
}

export default async function AboutPage(props: {
  searchParams?: { tenant?: string } | Promise<{ tenant?: string }>;
}) {
  const tenantSlug = await resolveTenantSlug(props.searchParams);
  const { config, storeName } = await getAboutPageConfig(tenantSlug);
  const d = config.design;
  const sec = config.sectionsEnabled || {
    hero: true,
    founder: true,
    pillars: true,
    stats: true,
    cta: true,
    customSections: true,
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: d.backgroundColor || '#07090E',
        color: d.textColor || '#F8FAFC',
        fontFamily: d.bodyFont || 'inherit',
      }}
    >
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 w-full">
        {/* 1. Atelier Hero Section */}
        {sec.hero !== false && (
          <section
            className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-center p-8 sm:p-14 border shadow-2xl"
            style={{ borderColor: d.heroBadgeBorder || `${d.accentColor}30` }}
          >
            <img
              src={config.heroImage}
              alt="Atelier Heritage"
              className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105"
              style={{ opacity: d.heroOverlayOpacity ?? 0.35 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${d.backgroundColor || '#07090E'}, rgba(7, 9, 14, 0.6), transparent)`,
              }}
            />

            <div className="relative text-center max-w-3xl space-y-4">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
                style={{
                  backgroundColor: d.heroBadgeBg || `${d.accentColor}1A`,
                  color: d.heroBadgeText || d.accentColor,
                  borderColor: d.heroBadgeBorder || `${d.accentColor}40`,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: d.heroBadgeText || d.accentColor }} />
                {config.heroBadge}
              </span>
              <h1
                className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                style={{
                  color: d.heroTitleColor || '#FFFFFF',
                  fontFamily: d.headingFont || 'inherit',
                }}
              >
                {config.heroHeadline}
              </h1>
              <p
                className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
                style={{ color: d.heroSubtextColor || d.mutedTextColor || '#CBD5E1' }}
              >
                {config.heroSubtext}
              </p>
            </div>
          </section>
        )}

        {/* 2. Founder Vision Statement Section */}
        {sec.founder !== false && (
          <section
            className="p-8 sm:p-12 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center gap-8"
            style={{
              background: d.founderCardBg || 'linear-gradient(135deg, #121522, #170E1A)',
              borderColor: d.founderCardBorder || 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="relative shrink-0">
              <img
                src={config.founderImage}
                alt={config.founderName}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 shadow-2xl"
                style={{ borderColor: d.founderRoleColor || d.accentColor }}
              />
              <div
                className="absolute -bottom-2 -right-2 p-2 rounded-full shadow-lg font-bold"
                style={{ backgroundColor: d.founderBadgeBg || d.accentColor }}
              >
                <Quote className="w-4 h-4 text-black" />
              </div>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <p
                className="text-lg sm:text-2xl font-serif italic leading-relaxed"
                style={{ color: d.founderQuoteColor || '#F8FAFC' }}
              >
                &ldquo;{config.founderQuote}&rdquo;
              </p>
              <div>
                <div
                  className="font-bold text-base"
                  style={{
                    color: d.founderNameColor || '#FFFFFF',
                    fontFamily: d.headingFont || 'inherit',
                  }}
                >
                  {config.founderName}
                </div>
                <div
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: d.founderRoleColor || d.accentColor }}
                >
                  {config.founderRole}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Pillars of Excellence Section */}
        {sec.pillars !== false && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: d.pillarSectionTitleColor || '#FFFFFF',
                  fontFamily: d.headingFont || 'inherit',
                }}
              >
                Our Master Commitments
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: d.mutedTextColor || '#94A3B8' }}>
                Uncompromising standards guiding every creation that leaves our atelier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.pillars?.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border transition-all space-y-3"
                  style={{
                    backgroundColor: d.pillarCardBg || '#0E111C',
                    borderColor: d.pillarCardBorder || 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm"
                    style={{
                      backgroundColor: d.pillarBadgeBg || `${d.accentColor}1A`,
                      color: d.pillarBadgeText || d.accentColor,
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <h3
                    className="font-bold text-base"
                    style={{
                      color: d.pillarTitleColor || '#FFFFFF',
                      fontFamily: d.headingFont || 'inherit',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: d.pillarDescColor || d.mutedTextColor || '#94A3B8' }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Key Metrics / Stats Section */}
        {sec.stats !== false && config.stats && config.stats.length > 0 && (
          <section
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 rounded-3xl border"
            style={{
              backgroundColor: d.statsContainerBg || '#0B0D16',
              borderColor: d.statsContainerBorder || 'rgba(255, 255, 255, 0.08)',
            }}
          >
            {config.stats.map((st, i) => (
              <div key={i} className="text-center space-y-1">
                <div
                  className="text-2xl sm:text-4xl font-black tracking-tight"
                  style={{
                    color: d.statNumberColor || d.accentColor,
                    fontFamily: d.headingFont || 'inherit',
                  }}
                >
                  {st.value}
                </div>
                <div className="text-xs font-medium" style={{ color: d.statLabelColor || '#94A3B8' }}>
                  {st.label}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 5. Custom User HTML Sections */}
        {sec.customSections !== false &&
          config.customSections
            ?.filter((s) => s.enabled)
            ?.map((customSec) => (
              <section
                key={customSec.id}
                className="w-full rounded-3xl p-6 sm:p-10 border overflow-hidden"
                style={{
                  backgroundColor: customSec.backgroundColor || d.pillarCardBg || '#0E111C',
                  borderColor: d.pillarCardBorder || 'rgba(255,255,255,0.08)',
                }}
              >
                {customSec.title && (
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-4"
                    style={{
                      color: d.pillarSectionTitleColor || '#FFFFFF',
                      fontFamily: d.headingFont || 'inherit',
                    }}
                  >
                    {customSec.title}
                  </h2>
                )}
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: customSec.html }}
                />
              </section>
            ))}

        {/* 6. Direct Concierge CTA Section */}
        {sec.cta !== false && (
          <section
            className="p-8 sm:p-12 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: d.ctaBannerBg || 'linear-gradient(135deg, #111422, #1A1320)',
              borderColor: d.ctaBannerBorder || 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="space-y-2 text-center sm:text-left">
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{
                  color: d.ctaBannerTitleColor || '#FFFFFF',
                  fontFamily: d.headingFont || 'inherit',
                }}
              >
                Experience {storeName} In Person
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: d.ctaBannerTextColor || '#94A3B8' }}>
                Schedule a bespoke consultation or private viewing with our master stylists.
              </p>
            </div>

            <Link
              href={`/contact?tenant=${tenantSlug}`}
              className="px-6 py-3.5 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
              style={{
                background: d.ctaButtonBg || `linear-gradient(135deg, ${d.accentColor}, #B45309)`,
                color: d.ctaButtonTextColor || '#000000',
                fontWeight: 800,
              }}
            >
              <span>{d.ctaButtonText || 'Book Private Salon Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
