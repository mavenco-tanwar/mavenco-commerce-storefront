import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const usageData = {
      totalTokensUsed: 1420500,
      monthlyTokenBudget: 3500000,
      aiRevenueAttributedMinor: 3480000, // $34,800.00
      forecastAccuracyPercentage: 94.2,
      activeAgentsCount: 3,
      supportDeflectionRate: 68.4,
      estimatedCostMinor: 4260, // $42.60
      currency: 'USD',
    };

    const models = [
      { id: 'mod_01', provider: 'anthropic', modelKey: 'claude-3-5-sonnet', displayName: 'Claude 3.5 Sonnet (Primary Intelligence)', taskTypes: ['agents', 'content', 'assistant'], status: 'active', contextLimitTokens: 200000, costPer1kTokensMinor: 30 },
      { id: 'mod_02', provider: 'openai', modelKey: 'gpt-4o-mini', displayName: 'GPT-4o Mini (High-Speed Classification)', taskTypes: ['moderation', 'search', 'recommendations'], status: 'active', contextLimitTokens: 128000, costPer1kTokensMinor: 15 },
      { id: 'mod_03', provider: 'google', modelKey: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro (Demand Forecasting)', taskTypes: ['forecasting', 'merchandising'], status: 'standby', contextLimitTokens: 1000000, costPer1kTokensMinor: 35 },
    ];

    return NextResponse.json({
      success: true,
      data: { stats: usageData, models },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
