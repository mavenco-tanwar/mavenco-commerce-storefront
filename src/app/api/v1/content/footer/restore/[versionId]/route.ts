import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ versionId: string }> }
) {
  const { versionId } = await params;
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
      const verDoc = await db.collection('cms_versions').findOne({
        tenantSlug: tenantSlug,
        builderType: 'footer',
        $or: [{ versionId: versionId }, { version: Number(versionId) }],
      });

      if (!verDoc || !verDoc.snapshot) {
        return NextResponse.json(
          { success: false, error: 'Version snapshot not found' },
          { status: 404, headers: corsHeaders() }
        );
      }

      // Restore to cms_pages
      await db.collection('cms_pages').updateOne(
        { tenantSlug: tenantSlug, type: 'footer' },
        {
          $set: {
            ...verDoc.snapshot,
            restoredFromVersion: verDoc.version,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/stores/${tenantSlug}`, 'layout');
      } catch {}

      return NextResponse.json(
        {
          success: true,
          data: verDoc.snapshot,
          message: `Version ${verDoc.version} successfully restored.`,
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }

  return NextResponse.json({ success: false, error: 'DB unavailable' }, { status: 503, headers: corsHeaders() });
}
