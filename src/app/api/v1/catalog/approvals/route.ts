import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { CatalogGovernanceService } from '@/server/pim/catalog-governance.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-role, x-user-name',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400, headers: corsHeaders() });
    }

    const product = await PimService.getProductById(tenantSlug, productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: product.approvalState }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const operator = req.headers.get('x-user-name') || 'Curator Lead';
    const body = await req.json();

    const product = await PimService.getProductById(tenantSlug, body.productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders() });
    }

    const result = CatalogGovernanceService.transitionApproval(
      product,
      body.action || 'approve',
      operator,
      body.comments
    );

    await PimService.upsertProduct(tenantSlug, result.updatedProduct, operator);

    return NextResponse.json(
      {
        success: true,
        data: {
          product: result.updatedProduct,
          approvalRecord: result.approvalRecord,
        },
        message: `Approval transition [${body.action}] processed successfully`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
