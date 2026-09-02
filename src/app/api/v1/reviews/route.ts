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

const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    tenantId: 'lumina',
    productId: 'prod_1',
    productTitle: 'Pure Mulberry Silk Banarasi Saree',
    reviewerName: 'Aanya Kapoor',
    reviewerEmail: 'aanya.kapoor@example.com',
    reviewerLocation: 'Mumbai, India',
    rating: 5,
    title: 'Exquisite Drape and Unrivaled Craftsmanship',
    body: 'The gold zari weave is astonishingly supple and lightweight. Wore it to a high-society wedding and received non-stop compliments all evening.',
    status: 'published',
    verificationStatus: 'verified_purchase',
    media: [
      {
        id: 'med_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      },
    ],
    helpfulCount: 42,
    reportCount: 0,
    merchantReply: {
      id: 'rep_1',
      body: 'Thank you immensely, Aanya! Our master weavers in Varanasi spend over 120 hours on each saree.',
      repliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      authorName: 'Lumina Concierge',
    },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'rev_2',
    tenantId: 'lumina',
    productId: 'prod_2',
    productTitle: 'Handcrafted Cashmere Pashmina Shawl',
    reviewerName: 'Devika Singhania',
    reviewerEmail: 'devika.singhania@example.com',
    reviewerLocation: 'New Delhi, India',
    rating: 5,
    title: 'Featherlight warmth and divine texture',
    body: 'Unbelievably soft pure Ladakhi cashmere. The custom monogram embroidery added such a bespoke regal touch.',
    status: 'published',
    verificationStatus: 'verified_purchase',
    media: [
      {
        id: 'med_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
      },
    ],
    helpfulCount: 28,
    reportCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'rev_3',
    tenantId: 'lumina',
    productId: 'prod_3',
    productTitle: 'Royal Velvet Sherwani with Zardozi Crest',
    reviewerName: 'Rohan Mehra',
    reviewerEmail: 'rohan.mehra@example.com',
    reviewerLocation: 'Bangalore, India',
    rating: 5,
    title: 'The bespoke fitting was flawless',
    body: 'The virtual atelier fitting was surprisingly accurate. The jacket fits like a second skin.',
    status: 'pending_moderation',
    verificationStatus: 'verified_purchase',
    helpfulCount: 5,
    reportCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    const db = await getDatabase();
    let reviews = DEFAULT_REVIEWS;

    if (db) {
      const collection = db.collection('product_reviews');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_REVIEWS.map((r) => ({ ...r, tenantId: tenantSlug })));
      }

      const query: any = { tenantId: tenantSlug };
      if (productId) query.productId = productId;
      if (status && status !== 'all') query.status = status;
      else if (!status) query.status = 'published';

      const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
      reviews = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      reviews = reviews.filter((r) => r.tenantId === tenantSlug);
      if (productId) reviews = reviews.filter((r) => r.productId === productId);
      if (status && status !== 'all') reviews = reviews.filter((r) => r.status === status);
      else if (!status) reviews = reviews.filter((r) => r.status === 'published');
    }

    // Calculate Summary Histogram
    const publishedOnly = reviews.filter((r) => r.status === 'published' || !r.status);
    const totalCount = publishedOnly.length;
    const verifiedCount = publishedOnly.filter((r) => r.verificationStatus === 'verified_purchase').length;
    const avgRating = totalCount > 0 ? Number((publishedOnly.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)) : 5.0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedOnly.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
    });

    const summary = {
      tenantId: tenantSlug,
      productId: productId || 'all',
      averageRating: avgRating,
      reviewCount: totalCount,
      verifiedReviewCount: verifiedCount,
      ratingDistribution: distribution,
    };

    return NextResponse.json({
      success: true,
      data: reviews,
      summary,
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
    const newReview = {
      ...body,
      id: body.id || `rev_${Date.now()}`,
      tenantId: tenantSlug,
      rating: Number(body.rating) || 5,
      status: body.status || 'published',
      verificationStatus: body.verificationStatus || 'verified_purchase',
      helpfulCount: 0,
      reportCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('product_reviews').insertOne(newReview);
    }

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, merchantReply } = body;

    const db = await getDatabase();
    const updateFields: any = { updatedAt: new Date().toISOString() };
    if (status) updateFields.status = status;
    if (merchantReply) updateFields.merchantReply = merchantReply;

    if (db) {
      await db.collection('product_reviews').updateOne({ id }, { $set: updateFields });
    }

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
