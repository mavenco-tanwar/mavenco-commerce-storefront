import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
  const templateId = searchParams.get('template') || 'default_fashion';

  try {
    const db = await getDatabase();
    if (db) {
      const versions = await db
        .collection('collection_page_versions')
        .find({ tenantId: tenantSlug, templateId })
        .sort({ version: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json(
        { success: true, data: versions },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.warn('Error loading collection page versions:', err);
  }

  return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (
    searchParams.get('tenant') ||
    request.headers.get('x-tenant-slug') ||
    'lumina'
  )
    .toLowerCase()
    .trim();

  try {
    const { version, templateId = 'default_fashion' } = await request.json();
    const db = await getDatabase();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    const targetVersion = await db.collection('collection_page_versions').findOne({
      tenantId: tenantSlug,
      templateId,
      version: Number(version),
    });

    if (!targetVersion || !targetVersion.config) {
      return NextResponse.json(
        { success: false, error: 'Version not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Restore to draft
    await db.collection('collection_page_configs').updateOne(
      { tenantId: tenantSlug, templateId },
      {
        $set: {
          draft: {
            ...targetVersion.config,
            status: 'draft',
            updatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Version ${version} restored to draft successfully`,
        data: targetVersion.config,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to restore version' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
