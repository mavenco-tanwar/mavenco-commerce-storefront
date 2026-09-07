import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { BuilderPageService } from '@/server/governance/builder-page.service';
import { PageBuilderDocument } from '@/types/builder.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-tenant-slug, x-tenant-id, X-Store-ID, X-API-Key',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

/**
 * GET /api/v1/content/builder/pages/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;

    const page = await BuilderPageService.getPageById(tenantId, id);
    if (!page) {
      return NextResponse.json(
        { success: false, error: `Page "${id}" not found for tenant "${tenantId}"` },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json({ success: true, data: page }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

/**
 * PUT /api/v1/content/builder/pages/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;
    const body: PageBuilderDocument = await req.json();

    const saved = await BuilderPageService.saveDraft(tenantId, {
      ...body,
      id: id || body.id,
    });

    try {
      revalidatePath(`/${saved.slug}`);
      revalidatePath(`/stores/${tenantId}/${saved.slug}`);
    } catch {}

    return NextResponse.json(
      { success: true, data: saved, message: 'Draft saved successfully' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

/**
 * DELETE /api/v1/content/builder/pages/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;

    await BuilderPageService.deletePage(tenantId, id);
    return NextResponse.json(
      { success: true, message: 'Page deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
