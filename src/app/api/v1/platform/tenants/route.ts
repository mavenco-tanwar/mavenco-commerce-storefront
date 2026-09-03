import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

const DEFAULT_TENANTS = [
  {
    tenantId: 'lumina',
    slug: 'lumina',
    name: 'Lumina Luxury Group',
    status: 'active',
    databaseIdentifier: 'db_tenant_lumina_prod',
    planId: 'plan_growth',
    planName: 'Growth Commerce Tier',
    storesCount: 2,
    customDomainsCount: 3,
    mrrMinor: 29900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'elysium',
    slug: 'elysium',
    name: 'Elysium Haute Horlogerie',
    status: 'active',
    databaseIdentifier: 'db_tenant_elysium_prod',
    planId: 'plan_scale',
    planName: 'Scale Enterprise Tier',
    storesCount: 4,
    customDomainsCount: 6,
    mrrMinor: 79900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'aurora',
    slug: 'aurora',
    name: 'Aurora Botanical Cosmetics',
    status: 'active',
    databaseIdentifier: 'db_tenant_aurora_prod',
    planId: 'plan_starter',
    planName: 'Starter Tier',
    storesCount: 1,
    customDomainsCount: 1,
    mrrMinor: 9900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'vanguard',
    slug: 'vanguard',
    name: 'Vanguard Audio Atelier',
    status: 'suspended',
    databaseIdentifier: 'db_tenant_vanguard_prod',
    planId: 'plan_growth',
    planName: 'Growth Commerce Tier',
    storesCount: 2,
    customDomainsCount: 2,
    mrrMinor: 29900,
    health: 'warning',
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const db = await getDatabase();
    let tenants = DEFAULT_TENANTS;

    if (db) {
      const collection = db.collection('platform_tenants_registry');
      const count = await collection.countDocuments({});
      if (count === 0) {
        await collection.insertMany(DEFAULT_TENANTS);
      }
      const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
      tenants = docs.map(({ _id, ...rest }) => rest as any);
    }

    return NextResponse.json({
      success: true,
      data: tenants,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const now = new Date().toISOString();
    const tenantId = body.slug || `tenant_${Date.now()}`;

    const newTenant = {
      tenantId,
      slug: body.slug || `tenant-${Date.now()}`,
      name: body.name || 'New Enterprise Tenant',
      status: 'active',
      databaseIdentifier: `db_tenant_${tenantId}_prod`,
      planId: body.planId || 'plan_growth',
      planName: body.planName || 'Growth Commerce Tier',
      storesCount: 1,
      customDomainsCount: 1,
      mrrMinor: body.mrrMinor || 29900,
      health: 'healthy',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('platform_tenants_registry').insertOne(newTenant);
    }

    return NextResponse.json({
      success: true,
      data: newTenant,
      message: `Tenant '${newTenant.name}' provisioned and registered successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, action, reason } = body;
    const db = await getDatabase();

    const updateStatus = action === 'suspend' ? 'suspended' : action === 'restore' ? 'active' : 'maintenance';

    if (db) {
      await db.collection('platform_tenants_registry').updateOne(
        { tenantId },
        { $set: { status: updateStatus, updatedAt: new Date().toISOString() } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tenant status updated to '${updateStatus}' (Reason: ${reason || 'Operator Action'})`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
