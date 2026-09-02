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

const DEFAULT_PROVIDERS = [
  {
    id: 'prov_resend',
    tenantId: 'lumina',
    channel: 'email',
    providerName: 'resend',
    status: 'active',
    senderEmail: 'concierge@lumina-haute.com',
    senderName: 'Lumina Haute Couture',
    isPrimary: true,
    successRate: 99.8,
    avgLatencyMs: 140,
  },
  {
    id: 'prov_twilio_sms',
    tenantId: 'lumina',
    channel: 'sms',
    providerName: 'twilio',
    status: 'active',
    senderPhone: '+18005550199',
    isPrimary: true,
    successRate: 99.4,
    avgLatencyMs: 220,
  },
  {
    id: 'prov_whatsapp_meta',
    tenantId: 'lumina',
    channel: 'whatsapp',
    providerName: 'meta_whatsapp',
    status: 'active',
    senderPhone: '+919876543210',
    isPrimary: true,
    successRate: 98.9,
    avgLatencyMs: 310,
  },
  {
    id: 'prov_firebase_push',
    tenantId: 'lumina',
    channel: 'push',
    providerName: 'firebase',
    status: 'active',
    isPrimary: true,
    successRate: 97.5,
    avgLatencyMs: 95,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('notification_providers');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_PROVIDERS.map((p) => ({ ...p, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_PROVIDERS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
