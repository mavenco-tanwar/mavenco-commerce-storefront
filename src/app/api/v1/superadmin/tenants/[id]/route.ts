import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('platform_tenants_registry').findOne({ tenantId: id.toLowerCase() });
      if (doc) {
        const { _id, ...clean } = doc;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tenantId: id,
          slug: id,
          name: `${id.toUpperCase()} Atelier`,
          status: 'active',
          databaseIdentifier: `tenant_${id}`,
          planId: 'plan_growth',
          planName: 'Enterprise SaaS Tier',
          storesCount: 1,
          customDomainsCount: 1,
          mrrMinor: 29900,
          health: 'healthy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
