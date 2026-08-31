import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const db = await getDatabase();
    if (db) {
      const tenants = await db
        .collection('tenants')
        .find({ status: { $nin: ['deleted', 'archived'] } })
        .sort({ createdAt: -1 })
        .toArray();

      const clean = tenants.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ data: clean, count: clean.length, source: 'mongodb_atlas' }, { headers: corsHeaders() });
    }
  } catch (err) {
    console.error('MongoDB storefront platform tenants query error:', err);
  }

  return NextResponse.json({ data: [], count: 0, source: 'mongodb_empty' }, { headers: corsHeaders() });
}
