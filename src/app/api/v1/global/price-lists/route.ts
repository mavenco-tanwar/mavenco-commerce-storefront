import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get('marketId');

    let priceLists = GlobalCommerceService.listPriceLists();
    if (marketId) {
      priceLists = priceLists.filter((p) => p.marketId === marketId);
    }

    return NextResponse.json({
      success: true,
      data: priceLists,
      meta: { total: priceLists.length },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
