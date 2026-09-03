import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

const DEFAULT_ENVIRONMENTS = [
  {
    id: 'env_prod_001',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Live Production',
    type: 'production',
    status: 'active',
    activeVersion: 'v2.4.0 (Published Aug 28, 2026)',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'env_stage_002',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Staging & QA',
    type: 'staging',
    status: 'active',
    activeVersion: 'v2.5.0-rc1 (Draft Autumn Collection)',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'env_prev_003',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Visual Builder Live Preview',
    type: 'preview',
    status: 'active',
    activeVersion: 'v2.5.0-dev (Headless Hot-Reload)',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let environments = DEFAULT_ENVIRONMENTS;

    if (db) {
      const collection = db.collection('store_environments');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_ENVIRONMENTS.map((e) => ({ ...e, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: 1 }).toArray();
      environments = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      environments = environments.filter((e) => e.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: environments,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
