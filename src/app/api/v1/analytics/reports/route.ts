import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let CUSTOM_REPORTS = [
  {
    id: 'rep_001',
    name: 'Executive Monthly GMV & Channel P&L',
    description: 'Comprehensive gross revenue, returns, discounts and channel margins.',
    metrics: ['Gross Revenue', 'Net Sales', 'AOV', 'Refund Rate', 'Gross Margin'],
    dimensions: ['Channel', 'Payment Tender', 'Country'],
    dateRange: 'Month-to-Date',
    format: 'csv',
    lastGeneratedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'rep_002',
    name: 'Top SKU Velocity & Inventory Turnover Report',
    description: 'Sell-through rates, stock on hand, and revenue contribution per collection.',
    metrics: ['Units Sold', 'Cart Adds', 'Conversion Rate', 'Stockout Risk'],
    dimensions: ['SKU', 'Category', 'Warehouse'],
    dateRange: 'Last 30 Days',
    format: 'json',
    lastGeneratedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: CUSTOM_REPORTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newReport = {
      id: `rep_${Date.now()}`,
      name: body.name || 'Custom Executive Report',
      description: body.description || 'Custom generated business intelligence dataset.',
      metrics: body.metrics || ['Gross Revenue', 'Orders'],
      dimensions: body.dimensions || ['Channel'],
      dateRange: body.dateRange || 'Last 30 Days',
      format: body.format || 'csv',
      lastGeneratedAt: new Date().toISOString(),
    };

    CUSTOM_REPORTS.unshift(newReport);

    return NextResponse.json({
      success: true,
      data: newReport,
      message: `Report '${newReport.name}' generated successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
