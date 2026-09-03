import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { CatalogGovernanceService } from '@/server/pim/catalog-governance.service';

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
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;

    const pubs = PimService.getPublications(tenantSlug, productId);
    return NextResponse.json({ success: true, data: pubs }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const product = await PimService.getProductById(tenantSlug, body.productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders() });
    }

    // If publishing, validate publication readiness
    if (body.status === 'published') {
      const validation = CatalogGovernanceService.validateForPublish(product);
      if (!validation.canPublish) {
        return NextResponse.json(
          {
            success: false,
            error: 'Product failed publication validation rules',
            validationErrors: validation.errors,
            warnings: validation.warnings,
          },
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    const existingPubs = PimService.getPublications(tenantSlug, body.productId);
    const existing = existingPubs.find((p) => p.marketId === body.marketId && p.channelId === body.channelId) || null;

    const updatedPub = CatalogGovernanceService.createOrUpdatePublication(existing, {
      tenantId: tenantSlug,
      productId: body.productId,
      catalogId: body.catalogId || 'cat_master',
      marketId: body.marketId || 'US',
      channelId: body.channelId || 'web',
      status: body.status || 'published',
      publishAt: body.publishAt,
      unpublishAt: body.unpublishAt,
    });

    if (!existing) {
      const allPubs = PimService.getPublications(tenantSlug);
      allPubs.push(updatedPub);
    } else {
      Object.assign(existing, updatedPub);
    }

    // If published in at least one market/channel, promote product status to published
    if (body.status === 'published') {
      product.status = 'published';
      await PimService.upsertProduct(tenantSlug, product, 'Publication Manager');
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedPub,
        message: `Product ${body.status === 'published' ? 'published' : 'publication updated'} successfully`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
