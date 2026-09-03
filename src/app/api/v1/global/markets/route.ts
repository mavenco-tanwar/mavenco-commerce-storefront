import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const market = GlobalCommerceService.getMarket(id);
      if (!market) {
        return NextResponse.json({ success: false, error: 'Market not found' }, { status: 404 });
      }
      const readiness = GlobalCommerceService.evaluateMarketReadiness(id);
      return NextResponse.json({ success: true, data: { ...market, readiness } });
    }

    const markets = GlobalCommerceService.listMarkets();
    const withReadiness = markets.map((m) => ({
      ...m,
      readiness: GlobalCommerceService.evaluateMarketReadiness(m.id),
    }));

    return NextResponse.json({
      success: true,
      data: withReadiness,
      meta: { total: markets.length, active: markets.filter((m) => m.status === 'active').length },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.code || !body.defaultCurrency || !body.defaultLocale) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, code, defaultCurrency, defaultLocale)' },
        { status: 400 }
      );
    }

    const created = GlobalCommerceService.createMarket({
      tenantId: body.tenantId || 'tenant-demo',
      storeId: body.storeId || 'store-main',
      name: body.name,
      code: body.code.toUpperCase(),
      status: body.status || 'draft',
      description: body.description,
      countries: body.countries || [],
      regions: body.regions || [],
      defaultLocale: body.defaultLocale,
      supportedLocales: body.supportedLocales || [body.defaultLocale],
      defaultCurrency: body.defaultCurrency,
      supportedCurrencies: body.supportedCurrencies || [body.defaultCurrency],
      catalogId: body.catalogId,
      priceListId: body.priceListId,
      taxConfigurationId: body.taxConfigurationId,
      shippingConfigurationId: body.shippingConfigurationId,
      paymentConfigurationId: body.paymentConfigurationId,
      domainConfiguration: body.domainConfiguration,
      seoConfiguration: body.seoConfiguration,
      customerEligibility: body.customerEligibility,
      metrics: {
        activeCustomers: 0,
        monthlyGmvMinorUnits: 0,
        orderCount: 0,
        conversionRate: 0,
      },
      healthScore: 100,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Market ID is required' }, { status: 400 });
    }

    const updated = GlobalCommerceService.updateMarket(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
