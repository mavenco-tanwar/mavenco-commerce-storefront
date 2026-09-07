import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { BuilderPageService } from '@/server/governance/builder-page.service';
import { ReusableComponent } from '@/types/builder.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-tenant-slug, x-tenant-id, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;

    const items = await BuilderPageService.getComponents(tenantId);
    return NextResponse.json({ success: true, data: items }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;
    const body = await req.json();

    if (!body.name || !body.elementTree) {
      return NextResponse.json(
        { success: false, error: 'Component name and elementTree are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const now = new Date().toISOString();
    const newComponent: ReusableComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      name: body.name,
      category: body.category || 'Sections',
      description: body.description || '',
      thumbnailUrl: body.thumbnailUrl || '',
      elementTree: body.elementTree,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await BuilderPageService.saveComponent(tenantId, newComponent);
    return NextResponse.json(
      { success: true, data: saved, message: 'Reusable component saved' },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Component ID is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const context = TenantDatabaseResolver.resolveContext(req);
    const tenantId = context.tenantId;

    await BuilderPageService.deleteComponent(tenantId, id);
    return NextResponse.json(
      { success: true, message: 'Component deleted' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
