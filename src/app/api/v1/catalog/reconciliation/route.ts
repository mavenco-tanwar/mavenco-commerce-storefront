import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { CatalogGovernanceService } from '@/server/pim/catalog-governance.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const catalogs = PimService.getCatalogs(tenantSlug);
    const masterCatalog = catalogs[0];
    const { products } = await PimService.getProducts(tenantSlug, { limit: 500 });
    const publications = PimService.getPublications(tenantSlug);

    const report = CatalogGovernanceService.reconcileCatalog(
      tenantSlug,
      masterCatalog,
      products,
      publications
    );

    return NextResponse.json({ success: true, data: report }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
