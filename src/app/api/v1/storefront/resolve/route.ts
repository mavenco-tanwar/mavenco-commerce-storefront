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
        ],
      });

      if (store) {
        return NextResponse.json(
          {
            success: true,
            data: {
              id: store.id || store._id,
              slug: store.slug,
              name: store.name,
              brandColor: store.theme?.accentColor || store.brandColor || '#E11D48',
              theme: store.theme || defaultTenant.theme,
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
        slug: defaultTenant.slug,
        name: defaultTenant.name,
        brandColor: defaultTenant.theme?.accentColor || '#E11D48',
        theme: defaultTenant.theme,
      },
    },
    { headers: corsHeaders() }
  );
}
