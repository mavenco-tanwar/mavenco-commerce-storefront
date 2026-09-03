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

export const INITIAL_SAAS_REVIEWS = [
  {
    id: 'rev_saas_1',
    type: 'saas',
    author: 'Aarav Singhania',
    role: 'Founder & CEO',
    company: 'Vedic Luxe Botanicals',
    location: 'Bengaluru, India',
    rating: 5,
    highlight: 'Saved ₹3.8L in First 6 Months',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    comment: 'Migrating from Shopify Plus to Mavenco was the best decision for our balance sheet. 0% revenue cut, sub-40ms edge speeds, and our mobile conversion jumped from 1.9% to 3.4%.',
    badge: 'D2C Brand Founder',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev_saas_2',
    type: 'saas',
    author: 'Elena Rostova',
    role: 'VP of E-Commerce',
    company: 'Nordic Atelier',
    location: 'London & Dubai',
    rating: 5,
    highlight: 'Instant Visual CMS Freedom',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    comment: 'Our marketing team creates high-converting seasonal lookbooks in minutes without touching code or paying for 8 different Shopify plugins. The multi-currency engine works flawlessly across GCC and Europe.',
    badge: 'Enterprise Scale',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev_saas_3',
    type: 'saas',
    author: 'Rohan Deshmukh',
    role: 'Co-Founder & CTO',
    company: 'Apex Athletics',
    location: 'Mumbai, India',
    rating: 5,
    highlight: 'Handled 14,000 Concurrent Drops',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    comment: 'During our festive drop, the flash sale surge mode handled 14k concurrent checkouts on Next.js 16 Edge without a single glitch or timeout. Complete database isolation gives us peace of mind.',
    badge: 'High-Volume D2C',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev_saas_4',
    type: 'saas',
    author: 'Meera Nambiar',
    role: 'Creative Director',
    company: 'Samyukta Couture',
    location: 'Delhi NCR',
    rating: 5,
    highlight: 'Bespoke Editorial Aesthetics',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    comment: 'Mavenco gave our luxury brand the couture digital storefront it deserved. The typography, smooth page transitions, and WhatsApp order flow provide a true VIP white-glove experience.',
    badge: 'Luxury Brand Director',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
];

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
];

let memorySaasReviews = [...INITIAL_SAAS_REVIEWS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'product';
    const status = searchParams.get('status');

    const db = await getDatabase();

    // =========================================================================
    // 1. SAAS FOUNDER TESTIMONIALS (Landing Page Showcase)
    // =========================================================================
    if (type === 'saas') {
      let saasDocs: any[] = [];
      if (db) {
        const collection = db.collection('saas_reviews');
        const count = await collection.countDocuments({});
        if (count === 0) {
          await collection.insertMany(INITIAL_SAAS_REVIEWS.map(r => ({ ...r })));
        }
        const query: any = {};
        if (status && status !== 'all') {
          query.status = status;
        }
        const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
        saasDocs = docs.map(({ _id, ...rest }) => rest as any);
        memorySaasReviews = saasDocs;
      } else {
        saasDocs = status && status !== 'all' ? memorySaasReviews.filter(r => r.status === status) : memorySaasReviews;
      }

      return NextResponse.json({
        success: true,
        data: saasDocs,
        count: saasDocs.length,
      }, { headers: corsHeaders() });
    }

    // =========================================================================
    // 2. PRODUCT STORE REVIEWS (Customer Reviews & UGC)
    // =========================================================================
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const productId = searchParams.get('productId');

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
    const type = body.type || 'product';
    const db = await getDatabase();
    const now = new Date().toISOString();

    if (type === 'saas') {
      const newSaasReview = {
        id: body.id || `rev_saas_${Date.now()}`,
        type: 'saas',
        author: body.author || 'Anonymous Founder',
        role: body.role || 'Founder & CEO',
        company: body.company || 'D2C Brand',
        location: body.location || 'Global',
        rating: Number(body.rating) || 5,
        highlight: body.highlight || 'Fast Growth',
        image: body.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        comment: body.comment || '',
        badge: body.badge || 'Verified Merchant',
        status: body.status || 'published',
        createdAt: now,
        updatedAt: now,
      };

      if (db) {
        await db.collection('saas_reviews').insertOne(newSaasReview);
      }
      memorySaasReviews.unshift(newSaasReview);

      return NextResponse.json({
        success: true,
        data: newSaasReview,
        message: 'SaaS Testimonial saved successfully!',
      }, { headers: corsHeaders() });
    }

    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
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

export async function PUT(req: NextRequest) {
  return PATCH(req);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type || 'product';
    const db = await getDatabase();
    const now = new Date().toISOString();

    if (type === 'saas') {
      const { id, ...updates } = body;
      updates.updatedAt = now;
      if (db) {
        await db.collection('saas_reviews').updateOne({ id }, { $set: updates });
      }
      const idx = memorySaasReviews.findIndex(r => r.id === id);
      if (idx >= 0) {
        memorySaasReviews[idx] = { ...memorySaasReviews[idx], ...updates };
      }

      return NextResponse.json({
        success: true,
        message: 'SaaS Testimonial updated successfully!',
      }, { headers: corsHeaders() });
    }

    const { id, status, merchantReply } = body;
    const updateFields: any = { updatedAt: now };
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'product';
    const db = await getDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400, headers: corsHeaders() });
    }

    if (type === 'saas') {
      if (db) {
        await db.collection('saas_reviews').deleteOne({ id });
      }
      memorySaasReviews = memorySaasReviews.filter(r => r.id !== id);

      return NextResponse.json({
        success: true,
        message: 'SaaS Testimonial deleted successfully!',
      }, { headers: corsHeaders() });
    }

    if (db) {
      await db.collection('product_reviews').deleteOne({ id });
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
