import { NextRequest, NextResponse } from 'next/server';
import { StorefrontPageService } from '@/server/governance/storefront-page.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const { id, pageId } = await params;
    const page = await StorefrontPageService.getPageById(id, pageId);
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404, headers: corsHeaders() });
    }
    return NextResponse.json({ success: true, data: page }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const { id, pageId } = await params;
    const body = await req.json();
    const updated = await StorefrontPageService.savePageDraft(
      id,
      pageId,
      body.sections || [],
      body.seo
    );
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Draft changes saved successfully.',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const { id, pageId } = await params;
    const published = await StorefrontPageService.publishPage(id, pageId, 'superadmin');
    return NextResponse.json({
      success: true,
      data: published,
      message: `Page '${published.title}' published successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
