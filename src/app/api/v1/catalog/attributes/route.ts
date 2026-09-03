import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const attributes = PimService.getAttributes(tenantSlug);
    const groups = PimService.getAttributeGroups(tenantSlug);

    return NextResponse.json(
      {
        success: true,
        data: {
          attributes,
          groups,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newAttr = {
      id: body.id || `attr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      name: body.name || 'Custom Attribute',
      code: (body.code || 'attr_custom').toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      type: body.type || 'text',
      group: body.group || 'General',
      required: Boolean(body.required),
      filterable: Boolean(body.filterable),
      searchable: Boolean(body.searchable),
      sortable: Boolean(body.sortable),
      facetable: Boolean(body.facetable),
      localized: Boolean(body.localized),
      marketSpecific: Boolean(body.marketSpecific),
      channelSpecific: Boolean(body.channelSpecific),
      validationRules: body.validationRules || {},
      options: body.options,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = PimService.upsertAttribute(tenantSlug, newAttr as any);
    return NextResponse.json({ success: true, data: saved, message: 'Attribute saved successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
