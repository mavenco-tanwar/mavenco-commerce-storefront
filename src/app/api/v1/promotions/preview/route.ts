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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      code = '',
      subtotal = 1000,
      customerType = 'all',
    } = body;

    const normalizedCode = code.trim().toUpperCase();
    const db = await getDatabase();

    let promo: any = null;
    if (db) {
      promo = await db.collection('promotions').findOne({
        tenantId: tenant,
        $or: [
          { 'coupon.code': normalizedCode },
          { id: normalizedCode.toLowerCase() },
        ],
      });
    }

    if (!promo) {
      return NextResponse.json({
        success: true,
        data: {
          isEligible: false,
          reasonCode: 'PROMOTION_NOT_FOUND',
          message: `Coupon code "${code}" was not found or is invalid for this store.`,
          originalSubtotal: subtotal,
          discountAmount: 0,
          shippingDiscount: 0,
          finalSubtotal: subtotal,
          auditTrace: [
            { rule: 'Coupon Existence', passed: false, details: `Code "${normalizedCode}" not registered` },
          ],
        },
      }, { headers: corsHeaders() });
    }

    const auditTrace = [];

    // 1. Check Active Status
    const isActive = promo.status === 'active';
    auditTrace.push({
      rule: 'Promotion Active Status',
      passed: isActive,
      details: `Status is "${promo.status.toUpperCase()}"`,
    });

    if (!isActive) {
      return NextResponse.json({
        success: true,
        data: {
          isEligible: false,
          reasonCode: 'PROMOTION_INACTIVE',
          message: 'This promotion is currently paused or inactive.',
          originalSubtotal: subtotal,
          discountAmount: 0,
          shippingDiscount: 0,
          finalSubtotal: subtotal,
          auditTrace,
        },
      }, { headers: corsHeaders() });
    }

    // 2. Check Min Spend Threshold
    const minOrder = promo.conditions?.minOrderValue || 0;
    const meetsMinSpend = subtotal >= minOrder;
    auditTrace.push({
      rule: 'Minimum Order Value Requirement',
      passed: meetsMinSpend,
      details: `Required: $${minOrder} | Provided: $${subtotal}`,
    });

    if (!meetsMinSpend) {
      return NextResponse.json({
        success: true,
        data: {
          isEligible: false,
          reasonCode: 'MINIMUM_ORDER_NOT_MET',
          message: `Minimum order subtotal of $${minOrder} required. (Current: $${subtotal})`,
          originalSubtotal: subtotal,
          discountAmount: 0,
          shippingDiscount: 0,
          finalSubtotal: subtotal,
          auditTrace,
        },
      }, { headers: corsHeaders() });
    }

    // 3. Check Customer Segment Eligibility
    const requiredCust = promo.conditions?.customerEligibility || 'all';
    const customerPassed = requiredCust === 'all' || requiredCust === customerType;
    auditTrace.push({
      rule: 'Customer Segment Eligibility',
      passed: customerPassed,
      details: `Required: ${requiredCust.toUpperCase()} | Customer: ${customerType.toUpperCase()}`,
    });

    if (!customerPassed) {
      return NextResponse.json({
        success: true,
        data: {
          isEligible: false,
          reasonCode: 'CUSTOMER_NOT_ELIGIBLE',
          message: `This coupon is exclusively reserved for ${requiredCust.replace('_', ' ').toUpperCase()} members.`,
          originalSubtotal: subtotal,
          discountAmount: 0,
          shippingDiscount: 0,
          finalSubtotal: subtotal,
          auditTrace,
        },
      }, { headers: corsHeaders() });
    }

    // Calculate Discount
    let discountAmount = 0;
    const action = promo.actions || {};
    if (action.discountType === 'percentage') {
      discountAmount = (subtotal * (action.discountValue || 10)) / 100;
      if (action.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, action.maxDiscountAmount);
      }
    } else if (action.discountType === 'fixed_amount') {
      discountAmount = Math.min(subtotal, action.discountValue || 0);
    }

    auditTrace.push({
      rule: 'Discount Calculation',
      passed: true,
      details: `Calculated discount of $${discountAmount.toLocaleString()} (${promo.name})`,
    });

    const finalSubtotal = Math.max(0, subtotal - discountAmount);

    return NextResponse.json({
      success: true,
      data: {
        isEligible: true,
        message: `Promotion "${promo.name}" applied successfully! You save $${discountAmount.toLocaleString()}`,
        originalSubtotal: subtotal,
        discountAmount,
        shippingDiscount: promo.promotionType === 'free_shipping' ? 50 : 0,
        finalSubtotal,
        auditTrace,
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
