import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyCustomerToken } from '@/lib/server/auth-token';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const payload = verifyCustomerToken(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Session expired or invalid token.' } },
        { status: 401, headers: corsHeaders() }
      );
    }

    const db = await getDatabase();
    let customer: any = null;

    if (db) {
      customer = await db.collection('customers').findOne({
        $or: [{ id: payload.id }, { email: payload.email }],
      });
    }

    if (!customer) {
      // Return decoded payload as fallback customer profile
      customer = {
        id: payload.id,
        email: payload.email,
        firstName: payload.email.split('@')[0] || 'Customer',
        lastName: '',
        tenantSlug: payload.tenantSlug,
        addresses: [],
      };
    }

    const { _id, password: _, ...safeCustomer } = customer;

    return NextResponse.json(
      {
        data: safeCustomer,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('[CustomerMe] Error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch customer.' } },
      { status: 500, headers: corsHeaders() }
    );
  }
}
