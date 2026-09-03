import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get('marketId');

    const markets = GlobalCommerceService.listMarkets();
    const targetMarkets = marketId ? markets.filter((m) => m.id === marketId) : markets;

    const reports = targetMarkets.map((market) => {
      const readiness = GlobalCommerceService.evaluateMarketReadiness(market.id);
      return {
        marketId: market.id,
        marketName: market.name,
        marketCode: market.code,
        status: market.status,
        overallScore: readiness.scorePercentage,
        isReadyToPublish: readiness.isReady,
        checks: readiness.checklist,
        blockers: readiness.blockers,
        warnings: readiness.warnings,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalMarkets: targetMarkets.length,
        fullyReadyCount: reports.filter((r) => r.isReadyToPublish).length,
        averageHealthScore: Math.round(
          reports.reduce((acc, r) => acc + r.overallScore, 0) / (reports.length || 1)
        ),
        reports,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
