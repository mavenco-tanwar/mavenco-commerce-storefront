import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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
  const tenantSlug = (
    searchParams.get('tenant') ||
    request.headers.get('x-tenant-slug') ||
    'lumina'
  )
    .toLowerCase()
    .trim();

  try {
    const db = await getDatabase();
    if (db) {
      const versions = await db
        .collection('cms_versions')
        .find({
          tenantSlug: tenantSlug,
          builderType: 'footer',
        })
        .sort({ version: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json(
        {
          data: versions,
          status: 'success',
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.warn('Failed to fetch footer versions:', err);
  }

  return NextResponse.json({ data: [] }, { headers: corsHeaders() });
}
