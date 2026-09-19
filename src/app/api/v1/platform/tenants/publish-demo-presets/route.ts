import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase, getPlatformDatabase, getTenantDatabase } from '@/lib/mongodb';
import { DEMO_PRESETS } from './presets-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  return handlePublish(request);
}

export async function POST(request: NextRequest) {
  return handlePublish(request);
}

async function handlePublish(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetSlug = searchParams.get('tenant') || searchParams.get('slug');

  const results: any[] = [];
  const errors: any[] = [];

  const presetsToProcess = targetSlug
    ? DEMO_PRESETS.filter((p) => p.slug === targetSlug.toLowerCase().trim())
    : DEMO_PRESETS;

  if (presetsToProcess.length === 0) {
    return NextResponse.json(
      { error: `No presets found matching ${targetSlug}` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const platformDb = await getPlatformDatabase();
  const now = new Date().toISOString();

  for (const preset of presetsToProcess) {
    const slug = preset.slug;
    try {
      // 1. Connect to isolated tenant database: tenant_<slug>
      const tenantDb = await getTenantDatabase(slug);
      if (!tenantDb) {
        throw new Error(`Could not connect to tenant database for ${slug}`);
      }

      // 2. Publish Homepage CMS Document in tenant DB
      const cmsDoc = {
        tenantSlug: slug,
        type: 'homepage',
        version: Date.now(),
        status: 'published',
        sections: preset.sections,
        config: { sections: preset.sections },
        styles: preset.themeStyles || {},
        themeStyles: preset.themeStyles || {},
        updatedAt: now,
        publishedAt: now,
      };

      await tenantDb.collection('cms_pages').updateOne(
        { tenantSlug: slug, type: 'homepage' },
        { $set: cmsDoc },
        { upsert: true }
      );

      // 3. Save Tenant Brand Configuration in tenant DB
      const brandDoc = {
        id: `store_${slug}`,
        tenantId: slug,
        slug: slug,
        name: preset.name,
        tagline: preset.tagline,
        description: preset.description,
        status: 'active',
        currency: preset.currency || 'USD',
        currencySymbol: preset.currencySymbol || '$',
        theme: preset.theme,
        contact: preset.contact,
        announcements: preset.announcements,
        navLinks: preset.navLinks,
        footerShopLinks: preset.footerShopLinks,
        footerCareLinks: preset.footerCareLinks,
        updatedAt: now,
      };

      await tenantDb.collection('tenants').updateOne(
        { $or: [{ slug }, { id: slug }, { id: `store_${slug}` }] },
        { $set: brandDoc, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );

      // 4. Seed / Update Niche Products in tenant DB
      if (preset.products && preset.products.length > 0) {
        await tenantDb.collection('products').deleteMany({
          $or: [{ tenantSlug: slug }, { storeSlug: slug }],
        });

        const productsToInsert = preset.products.map((prod, idx) => ({
          ...prod,
          id: `prod_${slug}_${idx + 1}`,
          slug: `${prod.slug || `product-${idx + 1}`}`,
          tenantSlug: slug,
          storeSlug: slug,
          status: 'published',
          createdAt: now,
          updatedAt: now,
        }));

        await tenantDb.collection('products').insertMany(productsToInsert);
      }

      // 5. Seed / Update Niche Categories in tenant DB
      if (preset.categories && preset.categories.length > 0) {
        await tenantDb.collection('categories').deleteMany({ tenantSlug: slug });
        const categoriesToInsert = preset.categories.map((cat, idx) => ({
          ...cat,
          id: `cat_${slug}_${idx + 1}`,
          tenantSlug: slug,
          createdAt: now,
        }));
        await tenantDb.collection('categories').insertMany(categoriesToInsert);
      }

      // 6. Synchronize with Platform Registry in mavenco_platform
      if (platformDb) {
        const platformRecord = {
          id: `store_${slug}`,
          tenantId: slug,
          slug: slug,
          name: preset.name,
          tagline: preset.tagline,
          description: preset.description,
          status: 'active',
          planId: 'plan_scale',
          planName: 'Enterprise Flagship',
          databaseName: `tenant_${slug}`,
          databaseIdentifier: `tenant_${slug}`,
          currency: preset.currency || 'USD',
          theme: preset.theme,
          ownerName: `${preset.name} Curator`,
          ownerEmail: `concierge@${slug}.mavenco.com`,
          primaryDomain: `${slug}.mavenco-storefront.vercel.app`,
          updatedAt: now,
        };

        await Promise.allSettled([
          platformDb.collection('platform_tenants_registry').updateOne(
            { $or: [{ slug }, { tenantId: slug }, { id: `store_${slug}` }] },
            { $set: platformRecord, $setOnInsert: { createdAt: now } },
            { upsert: true }
          ),
          platformDb.collection('tenants').updateOne(
            { $or: [{ slug }, { id: slug }, { id: `store_${slug}` }] },
            { $set: platformRecord, $setOnInsert: { createdAt: now } },
            { upsert: true }
          ),
          // Also save published homepage in platform db as backup
          platformDb.collection('cms_pages').updateOne(
            { tenantSlug: slug, type: 'homepage' },
            { $set: cmsDoc },
            { upsert: true }
          ),
        ]);
      }

      // 7. Revalidate Cache Paths
      try {
        revalidatePath('/');
        revalidatePath(`/stores/${slug}`);
        revalidatePath(`/stores/${slug}/`);
        revalidatePath(`/tenant/${slug}`);
      } catch {}

      results.push({
        slug,
        name: preset.name,
        status: 'published',
        sectionsCount: preset.sections.length,
        productsCount: preset.products?.length || 0,
        categoriesCount: preset.categories?.length || 0,
        theme: preset.theme?.primaryColor,
      });
    } catch (err: any) {
      console.error(`Error publishing preset for ${slug}:`, err);
      errors.push({ slug, error: err.message || String(err) });
    }
  }

  return NextResponse.json(
    {
      success: errors.length === 0,
      totalProcessed: presetsToProcess.length,
      publishedCount: results.length,
      publishedTenants: results,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders() }
  );
}
