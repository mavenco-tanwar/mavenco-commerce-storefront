import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const market = searchParams.get('market') || undefined;
    const country = searchParams.get('country') || undefined;
    const locale = searchParams.get('locale') || undefined;
    const path = searchParams.get('path') || undefined;
    const host = req.headers.get('host') || undefined;

    const resolvedContext = GlobalCommerceService.resolveMarket({
      explicitMarketCode: market,
      countryCode: country,
      requestedLocale: locale,
      urlPath: path,
      hostname: host,
    });

    return NextResponse.json({ success: true, data: resolvedContext });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resolvedContext = GlobalCommerceService.resolveMarket({
      explicitMarketCode: body.marketCode,
      countryCode: body.countryCode,
      requestedLocale: body.locale,
      urlPath: body.urlPath,
      hostname: body.hostname,
    });

    const response = NextResponse.json({ success: true, data: resolvedContext });

    // Set cookies for client session persistence
    response.cookies.set('mavenco_market', resolvedContext.marketCode, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set('mavenco_country', resolvedContext.countryCode, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set('mavenco_locale', resolvedContext.locale, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set('mavenco_currency', resolvedContext.currency, { path: '/', maxAge: 60 * 60 * 24 * 30 });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
