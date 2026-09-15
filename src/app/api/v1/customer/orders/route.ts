import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getTenantDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const email = searchParams.get('email');

    const tenantSlug = (
      searchParams.get('tenant') || searchParams.get('store') ||
      req.headers.get('x-tenant-slug') || req.headers.get('x-tenant') || 'jq-trends'
    ).replace(/^store_/, '').toLowerCase().trim();
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const query: any = { tenantId: tenant };
      if (email) {
        query.email = email;
      }

      const docs = await db
        .collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return NextResponse.json({
        success: true,
        data: docs,
      });
    }

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error('Error in GET /api/v1/customer/orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
