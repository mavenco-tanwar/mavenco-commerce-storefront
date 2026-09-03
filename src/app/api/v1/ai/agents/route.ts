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

let AGENTS = [
  {
    id: 'agt_analytics',
    name: 'Executive BI & Analytics Copilot',
    role: 'analytics_copilot',
    description: 'Monitors GMV trajectory, conversion anomalies, and channel attribution insights.',
    status: 'active',
    allowedTools: ['analytics.query', 'orders.read', 'marketing.read'],
    requiresApprovalForWrites: false,
    lastExecutionAt: new Date(Date.now() - 1800000).toISOString(),
    totalExecutions: 342,
  },
  {
    id: 'agt_merchandising',
    name: 'Merchandising & Catalog Optimizer',
    role: 'merchandising_agent',
    description: 'Diagnoses high-view low-conversion SKUs and recommends collection reordering.',
    status: 'active',
    allowedTools: ['products.read', 'categories.read', 'collection.simulate_reorder'],
    requiresApprovalForWrites: true,
    lastExecutionAt: new Date(Date.now() - 7200000).toISOString(),
    totalExecutions: 128,
  },
  {
    id: 'agt_inventory',
    name: 'Autonomous Replenishment Planner',
    role: 'inventory_planner',
    description: 'Calculates safety stocks, lead times, and submits draft purchase orders.',
    status: 'active',
    allowedTools: ['inventory.read', 'warehouses.read', 'purchase_order.draft'],
    requiresApprovalForWrites: true,
    lastExecutionAt: new Date(Date.now() - 14400000).toISOString(),
    totalExecutions: 89,
  },
];

let TOOL_EXECUTIONS = [
  {
    id: 'exec_001',
    agentId: 'agt_merchandising',
    agentName: 'Merchandising & Catalog Optimizer',
    toolName: 'collection.simulate_reorder',
    riskLevel: 'medium_write',
    status: 'pending_approval',
    inputSummary: 'Simulate reordering "Silk Collection" prioritizing LUM-DR-001 by conversion rate',
    outputSummary: 'Lift projected +4.2% in collection revenue',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'exec_002',
    agentId: 'agt_analytics',
    agentName: 'Executive BI & Analytics Copilot',
    toolName: 'analytics.query',
    riskLevel: 'low_read',
    status: 'completed',
    inputSummary: 'Query trailing 7-day conversion rate by sales channel',
    outputSummary: 'Meta Ads conversion 4.42%, Google PMax 4.64%',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: { agents: AGENTS, executions: TOOL_EXECUTIONS },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { executionId, action } = body;
    const exec = TOOL_EXECUTIONS.find((e) => e.id === executionId);
    if (exec) {
      if (action === 'approve') exec.status = 'completed';
      if (action === 'reject') exec.status = 'rejected';
    }

    return NextResponse.json({
      success: true,
      data: exec,
      message: `Tool execution marked as '${exec?.status}'!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
