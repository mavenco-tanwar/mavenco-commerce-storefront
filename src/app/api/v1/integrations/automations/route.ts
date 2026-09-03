import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let WORKFLOWS = [
  {
    id: 'wf_01',
    tenantId: 'tenant_lumina',
    name: 'High-Value Order &rarr; NetSuite ERP Sales Order & VIP Concierge Alert',
    description: 'When an order exceeds $500, immediately sync to NetSuite and send VIP Concierge WhatsApp note.',
    status: 'published',
    version: 3,
    trigger: {
      event: 'order.paid',
      label: 'Order Payment Confirmed',
    },
    conditions: [
      { field: 'order.totalAmountMinor', operator: 'greater_than', value: '50000' },
    ],
    actions: [
      { id: 'act_01', type: 'call_integration', target: 'Oracle NetSuite Global ERP', payloadSummary: 'Create Sales Order' },
      { id: 'act_02', type: 'send_notification', target: 'VIP Concierge WhatsApp', payloadSummary: 'Notify client manager' },
    ],
    executionsCount24h: 38,
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'wf_02',
    tenantId: 'tenant_lumina',
    name: 'Low Stock Safeguard &rarr; Pause External Amazon Marketplace Listing',
    description: 'When inventory on-hand drops below 3 units, temporarily unpublish Amazon channel listing to avoid overselling.',
    status: 'published',
    version: 1,
    trigger: {
      event: 'inventory.low',
      label: 'Stock Below Threshold',
    },
    conditions: [
      { field: 'inventory.available', operator: 'less_than', value: '3' },
    ],
    actions: [
      { id: 'act_03', type: 'call_integration', target: 'Amazon Marketplace Connector', payloadSummary: 'Pause SKU Listing' },
    ],
    executionsCount24h: 12,
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'wf_03',
    tenantId: 'tenant_lumina',
    name: 'Large Refund Approval Gate &rarr; Accounting Ledger Audit',
    description: 'Require superadmin/finance approval for any customer refund above $1,000 before posting to ledger.',
    status: 'published',
    version: 2,
    trigger: {
      event: 'refund.created',
      label: 'Refund Initiated',
    },
    conditions: [
      { field: 'refund.amountMinor', operator: 'greater_than', value: '100000' },
    ],
    actions: [
      { id: 'act_04', type: 'request_approval', target: 'Finance Director', payloadSummary: 'Manual sign-off required' },
      { id: 'act_05', type: 'call_integration', target: 'QuickBooks Online Sales Ledger', payloadSummary: 'Record Credit Memo' },
    ],
    executionsCount24h: 3,
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

let EXECUTIONS = [
  {
    id: 'exec_9918',
    workflowId: 'wf_01',
    workflowName: 'High-Value Order &rarr; NetSuite ERP Sales Order',
    triggerEvent: 'order.paid ($1,250.00)',
    status: 'completed',
    durationMs: 340,
    stepsSummary: 'Trigger &rarr; Condition (True) &rarr; NetSuite 200 OK &rarr; WhatsApp Dispatched',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'exec_9917',
    workflowId: 'wf_02',
    workflowName: 'Low Stock Safeguard',
    triggerEvent: 'inventory.low (SKU-SILK-01: 2 units)',
    status: 'completed',
    durationMs: 180,
    stepsSummary: 'Trigger &rarr; Condition (True) &rarr; Amazon SKU Paused',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'exec_9916',
    workflowId: 'wf_03',
    workflowName: 'Large Refund Approval Gate',
    triggerEvent: 'refund.created ($1,400.00)',
    status: 'waiting_approval',
    durationMs: 40,
    stepsSummary: 'Trigger &rarr; Condition (True) &rarr; Awaiting Finance Sign-Off',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        workflows: WORKFLOWS,
        executions: EXECUTIONS,
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, workflow } = body;

    if (action === 'test_dry_run') {
      return NextResponse.json({
        success: true,
        data: {
          simulatedSteps: [
            { step: '1. Event Ingested', output: 'order.paid (Total: $850.00)', status: 'PASSED' },
            { step: '2. Condition Evaluation', output: 'order.total > $500 &rarr; TRUE', status: 'PASSED' },
            { step: '3. Integration Call', output: 'Oracle NetSuite (Dry Run Mock: 200 OK)', status: 'PASSED' },
          ],
          totalDurationMs: 64,
        },
        message: 'Dry run execution completed with 0 errors! Production data untouched.',
      }, { headers: corsHeaders() });
    }

    const newWf = {
      id: `wf_${Date.now()}`,
      tenantId: 'tenant_lumina',
      name: workflow.name || 'New Custom Automation Workflow',
      description: workflow.description || '',
      status: 'published',
      version: 1,
      trigger: workflow.trigger || { event: 'order.paid', label: 'Order Paid' },
      conditions: workflow.conditions || [],
      actions: workflow.actions || [{ id: 'act_new', type: 'send_notification', target: 'Slack Channel', payloadSummary: 'Post message' }],
      executionsCount24h: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    WORKFLOWS.unshift(newWf);

    return NextResponse.json({
      success: true,
      data: newWf,
      message: 'Automation workflow created and activated!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
