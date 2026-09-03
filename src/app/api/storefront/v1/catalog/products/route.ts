import { NextRequest, NextResponse } from 'next/server';
import { ExperienceAPIService } from '@/server/experience/experience-api.service';

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

export async function GET(req: NextRequest) {
  try {
    const ctx = ExperienceAPIService.resolveContext(req);
    const url = new URL(req.url);

    const category = url.searchParams.get('category') || undefined;
    const collection = url.searchParams.get('collection') || undefined;
    const search = url.searchParams.get('search') || url.searchParams.get('q') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);

    const result = ExperienceAPIService.getCatalogProducts(ctx, {
      category,
      collection,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        channel: ctx.channelId,
        currency: ctx.currency,
        locale: ctx.locale,
        timestamp: new Date().toISOString(),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
