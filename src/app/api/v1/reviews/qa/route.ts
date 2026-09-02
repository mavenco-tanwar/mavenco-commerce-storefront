import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_QUESTIONS = [
  {
    id: 'q_1',
    tenantId: 'lumina',
    productId: 'prod_1',
    productTitle: 'Pure Mulberry Silk Banarasi Saree',
    customerName: 'Pooja Verma',
    question: 'Does this Banarasi saree come with an unstitched blouse piece in matching pure silk?',
    status: 'published',
    helpfulCount: 19,
    answers: [
      {
        id: 'ans_1',
        body: 'Yes, absolutely! It includes an unstitched 0.8-meter matching pure Mulberry silk blouse piece with matching zari border.',
        authorType: 'merchant',
        authorName: 'Lumina Concierge (Official)',
        answeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'q_2',
    tenantId: 'lumina',
    productId: 'prod_2',
    productTitle: 'Handcrafted Cashmere Pashmina Shawl',
    customerName: 'Sanjay Malhotra',
    question: 'What is the recommended dry-cleaning care protocol for this delicate cashmere weave?',
    status: 'published',
    helpfulCount: 14,
    answers: [
      {
        id: 'ans_2',
        body: 'We strongly recommend professional specialized dry cleaning only. A complimentary cedarwood preservation box is included with every delivery.',
        authorType: 'merchant',
        authorName: 'Atelier Care Specialist',
        answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const productId = searchParams.get('productId');

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('product_questions');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_QUESTIONS.map((q) => ({ ...q, tenantId: tenantSlug })));
      }

      const query: any = { tenantId: tenantSlug };
      if (productId) query.productId = productId;

      const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    let results = DEFAULT_QUESTIONS.filter((q) => q.tenantId === tenantSlug);
    if (productId) results = results.filter((q) => q.productId === productId);

    return NextResponse.json({ success: true, data: results }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
    const db = await getDatabase();

    if (body.questionId && body.answerBody) {
      // Adding an answer
      const newAnswer = {
        id: `ans_${Date.now()}`,
        body: body.answerBody,
        authorType: body.authorType || 'merchant',
        authorName: body.authorName || 'Lumina Concierge',
        answeredAt: new Date().toISOString(),
      };

      if (db) {
        await db.collection('product_questions').updateOne(
          { id: body.questionId },
          { $push: { answers: newAnswer } as any }
        );
      }

      return NextResponse.json({
        success: true,
        data: newAnswer,
        message: 'Answer posted successfully!',
      }, { headers: corsHeaders() });
    }

    // Creating a new question
    const newQuestion = {
      ...body,
      id: body.id || `q_${Date.now()}`,
      tenantId: tenantSlug,
      status: 'published',
      helpfulCount: 0,
      answers: [],
      createdAt: new Date().toISOString(),
    };

    if (db) {
      await db.collection('product_questions').insertOne(newQuestion);
    }

    return NextResponse.json({
      success: true,
      data: newQuestion,
      message: 'Question submitted successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
