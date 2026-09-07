import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { BuilderPageService } from '@/server/governance/builder-page.service';
import { PageTemplate } from '@/types/builder.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    const templates = await BuilderPageService.getTemplates(tenantId);
    return NextResponse.json({ success: true, data: templates }, { headers: corsHeaders() });
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

    if (!body.name || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Template name and content are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const newTemplate: PageTemplate = {
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      name: body.name,
      category: body.category || 'Landing Pages',
      description: body.description || '',
      thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
      content: body.content,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };

    const saved = await BuilderPageService.saveTemplate(tenantId, newTemplate);
    return NextResponse.json(
      { success: true, data: saved, message: 'Custom template saved' },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
