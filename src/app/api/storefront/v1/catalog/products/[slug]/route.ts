import { NextRequest, NextResponse } from 'next/server';
import { ExperienceAPIService } from '@/server/experience/experience-api.service';
import { PimService } from '@/server/pim/pim.service';
import { normalizeProduct } from '@/lib/product-adapter';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-channel-code, x-market-code, x-currency, x-locale, x-session-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const ctx = ExperienceAPIService.resolveContext(req);
    const tenantSlug = (req.headers.get('x-tenant-slug') || ctx.tenantId || 'lumina').toLowerCase();

    // Check PIM authoritative store
    const pimProduct = await PimService.getProductById(tenantSlug, slug);

    if (pimProduct) {
      // Critical Storefront Rule: Only serve published products. Never leak drafts, costs, supplier data.
      if (pimProduct.status !== 'published') {
        return NextResponse.json(
          { success: false, error: 'Product unavailable or pending publication review' },
          { status: 404, headers: corsHeaders() }
        );
      }

      // Check active market/channel publication
      const pubs = PimService.getPublications(tenantSlug, pimProduct.id);
      const isPublishedInChannel = pubs.length === 0 || pubs.some((p) => p.status === 'published');

      if (!isPublishedInChannel) {
        return NextResponse.json(
          { success: false, error: 'Product not published in this market or channel catalog' },
          { status: 403, headers: corsHeaders() }
        );
      }

      const normalized = normalizeProduct(pimProduct, { marketId: ctx.marketId, channelId: ctx.channelId });

      return NextResponse.json(
        {
          success: true,
          data: normalized,
          meta: {
            channel: ctx.channelId,
            currency: ctx.currency,
            locale: ctx.locale,
            market: ctx.marketId,
            timestamp: new Date().toISOString(),
          },
        },
        { headers: corsHeaders() }
      );
    }

    // Fallback to legacy catalog resolution if not yet in PIM store
    const legacyProduct = ExperienceAPIService.getProductBySlug(ctx, slug);

    if (!legacyProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found in active channel catalog' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: legacyProduct,
        meta: {
          channel: ctx.channelId,
          currency: ctx.currency,
          locale: ctx.locale,
          timestamp: new Date().toISOString(),
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
