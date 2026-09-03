import { NextRequest, NextResponse } from 'next/server';
import { ModuleCatalogService } from '@/server/governance/module-catalog.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entitlements = await ModuleCatalogService.getTenantEntitlements(id);
    const allModules = await ModuleCatalogService.getPlatformModules();

    const enriched = allModules.map((m) => {
      const ent = entitlements.find((e) => e.moduleKey === m.key);
      return {
        ...m,
        entitlement: ent || {
          status: 'disabled',
          source: 'none',
        },
      };
    });

    return NextResponse.json({ success: true, data: enriched }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { moduleKey, action, storeId = 'store_primary' } = body;

    if (!moduleKey) {
      return NextResponse.json({ success: false, error: 'moduleKey is required' }, { status: 400, headers: corsHeaders() });
    }

    if (action === 'enable') {
      const ent = await ModuleCatalogService.enableModule(id, storeId, moduleKey, 'manual', 'superadmin');
      return NextResponse.json({ success: true, data: ent, message: `Module '${moduleKey}' enabled.` }, { headers: corsHeaders() });
    } else if (action === 'disable') {
      const ent = await ModuleCatalogService.disableModule(id, storeId, moduleKey, 'superadmin');
      return NextResponse.json({ success: true, data: ent, message: `Module '${moduleKey}' disabled (historical data preserved).` }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: false, error: 'Invalid action. Supported: enable, disable' }, { status: 400, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
