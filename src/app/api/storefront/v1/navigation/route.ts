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
    const nav = ExperienceAPIService.getNavigation(ctx);

    return NextResponse.json({
      success: true,
      data: nav,
      meta: {
        channel: ctx.channelId,
        locale: ctx.locale,
        timestamp: new Date().toISOString(),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
