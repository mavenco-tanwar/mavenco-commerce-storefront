import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { CatalogGovernanceService } from '@/server/pim/catalog-governance.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;

    const versions = PimService.getVersions(tenantSlug, productId);
    return NextResponse.json({ success: true, data: versions }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const operator = req.headers.get('x-user-name') || 'Release Lead';
    const body = await req.json();

    const { productId, versionId } = body;
    if (!productId || !versionId) {
      return NextResponse.json({ success: false, error: 'productId and versionId are required' }, { status: 400, headers: corsHeaders() });
    }

    const currentProduct = await PimService.getProductById(tenantSlug, productId);
    if (!currentProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders() });
    }

    const versions = PimService.getVersions(tenantSlug, productId);
    const targetVersion = versions.find((v) => v.id === versionId || String(v.version) === String(versionId));

    if (!targetVersion) {
      return NextResponse.json({ success: false, error: 'Target version not found' }, { status: 404, headers: corsHeaders() });
    }

    // Rollback creates a new forward version snapshot
    const rollbackResult = CatalogGovernanceService.rollbackToVersion(currentProduct, targetVersion, operator);

    // Save updated product
    await PimService.upsertProduct(tenantSlug, rollbackResult.rolledBackProduct, operator);

    return NextResponse.json(
      {
        success: true,
        data: {
          product: rollbackResult.rolledBackProduct,
          newVersion: rollbackResult.newVersionRecord,
        },
        message: `Successfully rolled back to v${targetVersion.version}`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
