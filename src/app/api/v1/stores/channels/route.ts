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

const DEFAULT_CHANNELS = [
  {
    id: 'chan_web_001',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Online Flagship Web',
    code: 'WEB-PRIMARY',
    type: 'web',
    status: 'active',
    configuration: {
      currency: 'USD',
      locale: 'en-US',
      catalogVisibility: 'all',
      customerAuth: 'shared',
    },
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_mobile_002',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'iOS & Android Native Luxury App',
    code: 'MOBILE-APP',
    type: 'mobile',
    status: 'active',
    configuration: {
      currency: 'USD',
      locale: 'en-US',
      catalogVisibility: 'all',
      customerAuth: 'shared',
    },
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_pos_003',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Madison Avenue Flagship Boutique POS',
    code: 'POS-MADISON',
    type: 'pos',
    status: 'active',
    configuration: {
      currency: 'USD',
      locale: 'en-US',
      catalogVisibility: 'all',
      customerAuth: 'shared',
    },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_headless_004',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    name: 'Headless GraphQL B2B Commerce API',
    code: 'API-HEADLESS',
    type: 'headless',
    status: 'active',
    configuration: {
      currency: 'USD',
      locale: 'en-US',
      catalogVisibility: 'curated',
      customerAuth: 'isolated',
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let channels = DEFAULT_CHANNELS;

    if (db) {
      const collection = db.collection('sales_channels');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_CHANNELS.map((c) => ({ ...c, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: 1 }).toArray();
      channels = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      channels = channels.filter((c) => c.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: channels,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
