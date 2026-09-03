import { NextRequest, NextResponse } from 'next/server';
import { ModuleCatalogService } from '@/server/governance/module-catalog.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const modules = await ModuleCatalogService.getPlatformModules();
    return NextResponse.json({
      success: true,
      data: modules,
      total: modules.length,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const selected = body.selectedModules || [];
    const resolution = ModuleCatalogService.resolveDependencies(selected);

    return NextResponse.json({
      success: true,
      data: resolution,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
