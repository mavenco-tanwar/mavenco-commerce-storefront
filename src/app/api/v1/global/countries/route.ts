import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService, DEFAULT_REGIONS } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');
    const supportedOnly = searchParams.get('supported') === 'true';

    let countries = GlobalCommerceService.listCountries();
    if (region) {
      countries = countries.filter((c) => c.region.toLowerCase() === region.toLowerCase());
    }
    if (supportedOnly) {
      countries = countries.filter((c) => c.supported && c.status === 'active');
    }

    return NextResponse.json({
      success: true,
      data: {
        countries,
        regions: DEFAULT_REGIONS,
        meta: { total: countries.length, supported: countries.filter((c) => c.supported).length },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
