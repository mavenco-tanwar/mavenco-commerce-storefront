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

const DEFAULT_SYNONYMS = [
  {
    id: 'syn_1',
    tenantId: 'lumina',
    primaryTerm: 'dress',
    synonyms: ['gown', 'frock', 'midi', 'maxi'],
    direction: 'two_way',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'syn_2',
    tenantId: 'lumina',
    primaryTerm: 'blazer',
    synonyms: ['jacket', 'suit', 'coat'],
    direction: 'two_way',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'syn_3',
    tenantId: 'lumina',
    primaryTerm: 'shirt',
    synonyms: ['tee', 't-shirt', 'top', 'blouse'],
    direction: 'two_way',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('search_synonyms');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_SYNONYMS.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_SYNONYMS }, { headers: corsHeaders() });
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
    const newSyn = {
      ...body,
      id: body.id || `syn_${Date.now()}`,
      tenantId: tenantSlug,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('search_synonyms').insertOne(newSyn);
    }

    return NextResponse.json({ success: true, data: newSyn, message: 'Synonym group created' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const db = await getDatabase();
    if (db && id) {
      await db.collection('search_synonyms').deleteOne({ id });
    }
    return NextResponse.json({ success: true, message: 'Synonym group deleted' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
