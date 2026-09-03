import { NextRequest, NextResponse } from 'next/server';
import { TenantIntegrationInstance } from '@/types/integration-hub.types';

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

let INSTANCES: TenantIntegrationInstance[] = [
  {
    id: 'inst_netsuite_01',
    tenantId: 'tenant_lumina',
    providerId: 'prov_netsuite',
    name: 'Oracle NetSuite Global ERP',
    status: 'connected',
    credentialsRef: 'sec_vault_ns_8819',
    configuration: {
      accountId: '7842109-PROD',
      subsidiaryId: 1,
      warehouseLocationId: 'WH_CENTRAL_01',
    },
    lastConnectedAt: new Date(Date.now() - 3600000).toISOString(),
    lastSyncAt: new Date(Date.now() - 300000).toISOString(),
    rateLimitUsagePercent: 24.5,
    healthStatus: 'healthy',
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
  },
  {
    id: 'inst_quickbooks_01',
    tenantId: 'tenant_lumina',
    providerId: 'prov_quickbooks',
    name: 'QuickBooks Online Sales Ledger',
    status: 'connected',
    credentialsRef: 'sec_vault_qbo_4129',
    configuration: {
      realmId: '46208163651982',
      defaultSalesAccount: '4000',
    },
    lastConnectedAt: new Date(Date.now() - 7200000).toISOString(),
    lastSyncAt: new Date(Date.now() - 900000).toISOString(),
    rateLimitUsagePercent: 12.0,
    healthStatus: 'healthy',
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
  },
  {
    id: 'inst_shipstation_01',
    tenantId: 'tenant_lumina',
    providerId: 'prov_shipstation',
    name: 'ShipStation 3PL Logistics Hub',
    status: 'connected',
    credentialsRef: 'sec_vault_ss_9918',
    configuration: {
      defaultCarrier: 'FedEx Luxury Express',
      dimensionUnit: 'inches',
    },
    lastConnectedAt: new Date(Date.now() - 1800000).toISOString(),
    lastSyncAt: new Date(Date.now() - 60000).toISOString(),
    rateLimitUsagePercent: 41.2,
    healthStatus: 'healthy',
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'inst_square_01',
    tenantId: 'tenant_lumina',
    providerId: 'prov_square_pos',
    name: 'Square POS Madison Ave Flagship',
    status: 'connected',
    credentialsRef: 'sec_vault_sq_5514',
    configuration: {
      locationId: 'LOC_NYC_MADISON_01',
    },
    lastConnectedAt: new Date(Date.now() - 3600000).toISOString(),
    lastSyncAt: new Date(Date.now() - 1200000).toISOString(),
    rateLimitUsagePercent: 8.5,
    healthStatus: 'healthy',
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: INSTANCES,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, providerId, name, configuration } = body;

    if (action === 'test_connection') {
      return NextResponse.json({
        success: true,
        data: {
          latencyMs: Math.floor(Math.random() * 60) + 40,
          authenticated: true,
          scopesAcknowledged: ['products:read', 'orders:write', 'inventory:sync'],
        },
        message: 'Connection Test Successful! Remote API acknowledged ping in 48ms.',
      }, { headers: corsHeaders() });
    }

    const newInst: TenantIntegrationInstance = {
      id: `inst_${Date.now()}`,
      tenantId: 'tenant_lumina',
      providerId: providerId || 'prov_netsuite',
      name: name || 'New Integration Connection',
      status: 'connected',
      credentialsRef: `sec_vault_${Math.random().toString(36).substring(2, 8)}`,
      configuration: configuration || {},
      lastConnectedAt: new Date().toISOString(),
      lastSyncAt: null,
      rateLimitUsagePercent: 0,
      healthStatus: 'healthy',
      createdAt: new Date().toISOString(),
    };

    INSTANCES.unshift(newInst);

    return NextResponse.json({
      success: true,
      data: newInst,
      message: 'Integration instance successfully provisioned and connected!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const inst = INSTANCES.find((i) => i.id === id);
    if (inst && status) {
      inst.status = status;
    }

    return NextResponse.json({
      success: true,
      data: inst,
      message: `Integration status updated to '${status}'!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
