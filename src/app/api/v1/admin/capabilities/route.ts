import { NextRequest, NextResponse } from 'next/server';
import { PermissionService } from '@/server/governance/permission.service';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id, x-store-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const userId = req.headers.get('x-user-id') || 'usr_tenant_owner';

    const capabilities = await PermissionService.getTenantCapabilities(
      context.tenantId,
      context.storeId,
      userId
    );

    return NextResponse.json({
      success: true,
      data: capabilities,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
