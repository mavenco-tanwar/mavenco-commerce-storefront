import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_DOMAINS = [
  {
    id: 'dom_001',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    hostname: 'shop.luminaluxury.com',
    normalizedHostname: 'shop.luminaluxury.com',
    type: 'custom_domain',
    status: 'active',
    isPrimary: true,
    verificationStatus: 'verified',
    verificationToken: 'txt_lum_verify_88392019',
    sslStatus: 'active',
    dnsStatus: 'verified',
    redirectToPrimary: false,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dom_002',
    tenantId: 'lumina',
    storeId: 'store_outlet_002',
    hostname: 'outlet.luminaluxury.com',
    normalizedHostname: 'outlet.luminaluxury.com',
    type: 'custom_subdomain',
    status: 'active',
    isPrimary: true,
    verificationStatus: 'verified',
    verificationToken: 'txt_lum_verify_7719202',
    sslStatus: 'active',
    dnsStatus: 'verified',
    redirectToPrimary: false,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dom_003',
    tenantId: 'lumina',
    storeId: 'store_flagship_001',
    hostname: 'lumina-flagship.platform.com',
    normalizedHostname: 'lumina-flagship.platform.com',
    type: 'platform_subdomain',
    status: 'active',
    isPrimary: false,
    verificationStatus: 'verified',
    sslStatus: 'active',
    dnsStatus: 'verified',
    redirectToPrimary: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let domains = DEFAULT_DOMAINS;

    if (db) {
      const collection = db.collection('store_domains');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_DOMAINS.map((d) => ({ ...d, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ isPrimary: -1 }).toArray();
      domains = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      domains = domains.filter((d) => d.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: domains,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const normalizedHostname = (body.hostname || '').toLowerCase().trim().replace(/\.$/, '');

    const newDomain = {
      id: `dom_${Date.now()}`,
      tenantId: tenantSlug,
      storeId: body.storeId || 'store_flagship_001',
      hostname: body.hostname,
      normalizedHostname,
      type: body.type || 'custom_domain',
      status: 'pending_verification',
      isPrimary: body.isPrimary || false,
      verificationStatus: 'pending',
      verificationToken: `txt_${tenantSlug}_${Date.now()}`,
      sslStatus: 'pending',
      dnsStatus: 'pending',
      redirectToPrimary: body.redirectToPrimary || false,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('store_domains').insertOne(newDomain);
    }

    return NextResponse.json({
      success: true,
      data: newDomain,
      message: 'Domain connected! Please configure DNS TXT record for verification.',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
