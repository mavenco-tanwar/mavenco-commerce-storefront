import { NextRequest, NextResponse } from 'next/server';

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
  return NextResponse.json({
    success: true,
    data: {
      totalSearches: 18420,
      zeroResultRate: 3.4,
      averageConversionRate: 8.9,
      trendingSearches: ['Monsoon Linen', 'Floral Midi Dress', 'Tailored Blazer', 'Gold Jewellery', 'Evening Gown'],
      topSearches: [
        { query: 'dress', count: 4210, clicks: 3100, conversion: 9.4 },
        { query: 'blazer', count: 2980, clicks: 2450, conversion: 11.2 },
        { query: 'linen co-ord', count: 2150, clicks: 1800, conversion: 8.7 },
        { query: 'silk gown', count: 1840, clicks: 1420, conversion: 7.9 },
        { query: 'corset top', count: 1290, clicks: 950, conversion: 6.8 },
      ],
      zeroResultSearches: [
        { query: 'velvet lehenga', count: 142, lastSearched: '10 mins ago' },
        { query: 'leather boots', count: 98, lastSearched: '1 hour ago' },
        { query: 'oversized hoodie', count: 74, lastSearched: '3 hours ago' },
      ],
    },
  }, { headers: corsHeaders() });
}
