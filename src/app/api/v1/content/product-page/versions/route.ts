import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getTenantDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = (searchParams.get('tenant') || 'lumina').toLowerCase().trim();
    const templateId = searchParams.get('template') || 'default_fashion';

    const tenantSlug = (
      searchParams.get('tenant') || searchParams.get('store') ||
      req.headers.get('x-tenant-slug') || req.headers.get('x-tenant') || 'jq-trends'
    ).replace(/^store_/, '').toLowerCase().trim();
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const versions = await db
        .collection('product_page_versions')
        .find({
          templateId: templateId,
          $or: [
            { tenantSlug: tenant },
            { tenantId: tenant },
            { storeSlug: tenant },
            { tenantId: `store_${tenant}` },
          ],
        })
        .sort({ publishedAt: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json(
        {
          success: true,
          data: versions,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: [],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Failed to fetch PDP versions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
