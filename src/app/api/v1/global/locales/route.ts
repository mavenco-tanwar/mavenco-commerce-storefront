import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const direction = searchParams.get('direction');

    let locales = GlobalCommerceService.listLocales();
    if (direction) {
      locales = locales.filter((l) => l.direction === direction);
    }

    return NextResponse.json({
      success: true,
      data: locales,
      meta: {
        total: locales.length,
        rtlLocales: locales.filter((l) => l.direction === 'rtl').map((l) => l.code),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
