import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PREBUILT_TEMPLATES } from '@/components/page-builder/TemplatesPanel';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();

  try {
    const db = await getDatabase();
    let tenantTemplates: any[] = [];
    if (db) {
      tenantTemplates = await db
        .collection('cms_templates')
        .find({
          $or: [{ tenantId: tenantSlug }, { tenantId: 'platform' }, { isPlatform: true }],
        })
        .sort({ createdAt: -1 })
        .toArray();
    }

    const cleanTenant = tenantTemplates.map((t) => {
      const { _id, ...rest } = t;
      return rest;
    });

    const allTemplates = [...PREBUILT_TEMPLATES, ...cleanTenant];
    return NextResponse.json({ data: allTemplates, status: 'success' }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ data: PREBUILT_TEMPLATES, status: 'success' }, { headers: corsHeaders() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
    const body = await request.json();

    const template = {
      id: `tmpl_${Date.now().toString(36)}`,
      tenantId: tenantSlug,
      type: body.type || 'section',
      name: body.name || 'Custom Saved Template',
      category: body.category || 'Custom',
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_templates').insertOne(template);
    }

    return NextResponse.json(
      { success: true, data: template, message: 'Template saved successfully' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
