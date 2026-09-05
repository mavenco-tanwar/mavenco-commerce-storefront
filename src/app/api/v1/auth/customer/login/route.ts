import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';
import { generateCustomerToken } from '@/lib/server/auth-token';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = body.password || '';

    if (!email) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Email address is required.' } },
        { status: 400, headers: corsHeaders() }
      );
    }

    const db = await getDatabase();
    const rawResolved =
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-store-slug') ||
      body.tenantId ||
      body.storeSlug ||
      body.tenantSlug ||
      (await resolveRequestTenantSlug(req, undefined, db));

    const tenantSlug = (rawResolved || 'demo').replace(/^store_/, '').toLowerCase().trim();

    let customer: any = null;

    if (db) {
      const collection = db.collection('customers');
      // Case-insensitive email query scoped to tenant or global
      customer = await collection.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') },
        $or: [
          { tenantSlug: tenantSlug },
          { storeSlug: tenantSlug },
          { tenantId: tenantSlug },
          { tenantId: `store_${tenantSlug}` },
          { tenantSlug: 'all' },
        ],
      });

      // If not found for this tenant, search globally across all tenants
      if (!customer) {
        customer = await collection.findOne({
          email: { $regex: new RegExp(`^${email.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') },
        });
      }
    }

    // If customer doesn't exist yet, seamlessly provision a new customer account
    if (!customer) {
      const firstName = email.split('@')[0] || 'Valued';
      const lastName = 'Customer';
      const now = new Date().toISOString();

      customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email,
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName,
        phone: body.phone || '',
        password,
        tenantId: `store_${tenantSlug}`,
        tenantSlug,
        storeSlug: tenantSlug,
        addresses: [
          {
            id: 'addr_default',
            fullName: `${firstName} ${lastName}`.trim(),
            email,
            phone: body.phone || '',
            addressLine1: 'Main Street',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
            isDefault: true,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      if (db) {
        try {
          await db.collection('customers').insertOne(customer);
        } catch (insertErr) {
          console.warn('[CustomerLogin] DB insert warning:', insertErr);
        }
      }
    }

    const { _id, password: _, ...safeCustomer } = customer;
    const token = generateCustomerToken({
      id: safeCustomer.id,
      email: safeCustomer.email,
      tenantSlug: safeCustomer.tenantSlug || tenantSlug,
    });

    return NextResponse.json(
      {
        data: {
          token,
          customer: safeCustomer,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('[CustomerLogin] Error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Login failed.' } },
      { status: 500, headers: corsHeaders() }
    );
  }
}
