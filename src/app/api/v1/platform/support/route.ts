import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let SUPPORT_CASES = [
  {
    id: 'case_8892',
    tenantId: 'lumina',
    tenantName: 'Lumina Luxury Group',
    subject: 'Assistance required for custom domain SSL renewal on shop.luminaluxury.com',
    description: 'We updated our DNS nameservers and need validation that the ACM certificate is auto-renewing.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Support Tier 2',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'case_8891',
    tenantId: 'elysium',
    tenantName: 'Elysium Haute Horlogerie',
    subject: 'Request to increase GraphQL API throughput limits for Autumn Couture drop',
    description: 'Anticipating 20,000 req/sec during our high-jewelry collection launch.',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'Infrastructure Team',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SUPPORT_CASES,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
