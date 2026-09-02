import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_PROMOTIONS = [
  {
    id: 'promo_welcome10',
    tenantId: 'lumina',
    name: 'First Order Welcome Voucher',
    internalName: 'Q3 New User Acquisition',
    description: '10% discount on first couture order with no minimum spend.',
    status: 'active',
    promotionType: 'percentage_discount',
    triggerType: 'coupon_code',
    priority: 10,
    isStackable: false,
    isExclusive: false,
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 90).toISOString(),
    conditions: {
      minOrderValue: 0,
      customerEligibility: 'all',
    },
    actions: {
      discountType: 'percentage',
      discountValue: 10,
      maxDiscountAmount: 2000,
    },
    coupon: {
      code: 'WELCOME10',
      usageLimit: 5000,
      usageCount: 142,
      perCustomerLimit: 1,
    },
    analytics: {
      totalRedemptions: 142,
      totalDiscountGiven: 21300,
      attributedRevenue: 213000,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo_festive20',
    tenantId: 'lumina',
    name: 'Royal Heritage Festive 20% Off',
    internalName: 'Festive Drop Promotion',
    description: '20% off on orders exceeding $1500.',
    status: 'active',
    promotionType: 'percentage_discount',
    triggerType: 'coupon_code',
    priority: 20,
    isStackable: true,
    isExclusive: false,
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    conditions: {
      minOrderValue: 1500,
      customerEligibility: 'all',
    },
    actions: {
      discountType: 'percentage',
      discountValue: 20,
      maxDiscountAmount: 5000,
    },
    coupon: {
      code: 'FESTIVE20',
      usageLimit: 1000,
      usageCount: 88,
      perCustomerLimit: 2,
    },
    analytics: {
      totalRedemptions: 88,
      totalDiscountGiven: 31680,
      attributedRevenue: 158400,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo_vip500',
    tenantId: 'lumina',
    name: 'Atelier Gold Member Flat $500 Off',
    internalName: 'VIP Exclusive Discount',
    description: 'Flat $500 discount for VIP customers on orders above $3000.',
    status: 'active',
    promotionType: 'fixed_amount_discount',
    triggerType: 'coupon_code',
    priority: 30,
    isStackable: false,
    isExclusive: true,
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 60).toISOString(),
    conditions: {
      minOrderValue: 3000,
      customerEligibility: 'vip_only',
    },
    actions: {
      discountType: 'fixed_amount',
      discountValue: 500,
    },
    coupon: {
      code: 'VIP500',
      usageLimit: 250,
      usageCount: 34,
      perCustomerLimit: 1,
    },
    analytics: {
      totalRedemptions: 34,
      totalDiscountGiven: 17000,
      attributedRevenue: 119000,
    },
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
      const collection = db.collection('promotions');
      const count = await collection.countDocuments({ tenantId: tenantSlug });

      if (count === 0) {
        await collection.insertMany(
          DEFAULT_PROMOTIONS.map((p) => ({ ...p, tenantId: tenantSlug }))
        );
      }

      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_PROMOTIONS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve promotions' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newPromotion = {
      ...body,
      id: body.id || `promo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      status: body.status || 'active',
      analytics: {
        totalRedemptions: 0,
        totalDiscountGiven: 0,
        attributedRevenue: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('promotions').insertOne(newPromotion);
    }

    return NextResponse.json(
      { success: true, data: newPromotion, message: 'Promotion created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
