import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { resolveTenant } from '@/lib/tenant-config';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain') || '';
  const queryTenant = searchParams.get('tenant') || '';
  const defaultTenant = resolveTenant();

  try {
    const db = await getDatabase();
    if (db) {
      const cleanHost = domain.replace(/^https?:\/\//, '').split(':')[0].toLowerCase().trim();
      const store = await db.collection('tenants').findOne({
        $or: [
          { 'domains.domain': cleanHost },
          { primaryDomain: cleanHost },
          { slug: cleanHost.split('.')[0] },
          { slug: queryTenant },
          { id: queryTenant },
        ],
      });

      if (store) {
        const storeId = store.id || String(store._id);
        const storeSlug = store.slug || 'lumina';
        const storeName = store.name || 'Lumina Atelier';
        return NextResponse.json(
          {
            success: true,
            data: {
              id: storeId,
              storeId: storeId,
              slug: storeSlug,
              storeSlug: storeSlug,
              name: storeName,
              storeName: storeName,
              storeCode: store.code || storeSlug.toUpperCase(),
              defaultCurrency: store.currency || 'USD',
              defaultLocale: 'en-US',
              supportedLocales: ['en-US', 'en-IN'],
              brandColor: store.theme?.accentColor || store.brandColor || '#E11D48',
              theme: store.theme || defaultTenant.theme,
              domain: store.primaryDomain || cleanHost,
              status: store.status || 'active',
              features: store.features || {},
            },
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.warn('Tenant resolve error:', err);
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        id: defaultTenant.id,
        storeId: defaultTenant.id,
        slug: defaultTenant.slug,
        storeSlug: defaultTenant.slug,
        name: defaultTenant.name,
        storeName: defaultTenant.name,
        storeCode: defaultTenant.slug.toUpperCase(),
        defaultCurrency: 'USD',
        defaultLocale: 'en-US',
        supportedLocales: ['en-US', 'en-IN'],
        brandColor: defaultTenant.theme?.accentColor || '#E11D48',
        theme: defaultTenant.theme,
        domain: domain,
        status: 'active',
      },
    },
    { headers: corsHeaders() }
  );
}
