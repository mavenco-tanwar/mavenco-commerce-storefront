import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { BuilderPageService } from '@/server/governance/builder-page.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-tenant-slug, x-tenant-id, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;

    const versions = await BuilderPageService.getVersions(tenantId, id);
    return NextResponse.json({ success: true, data: versions }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
