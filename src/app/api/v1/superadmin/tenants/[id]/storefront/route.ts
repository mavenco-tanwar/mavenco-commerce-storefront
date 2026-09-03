import { NextRequest, NextResponse } from 'next/server';
import { StorefrontPageService } from '@/server/governance/storefront-page.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const storefront = await StorefrontPageService.getStorefront(id);
    const pages = await StorefrontPageService.getPages(id, storefront.id);
    const history = await StorefrontPageService.getVersionHistory(id, storefront.id);

    return NextResponse.json({
      success: true,
      data: {
        storefront,
        pagesCount: pages.length,
        versionsCount: history.length,
        versionHistory: history,
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, storefrontId, targetVersion, changelog } = body;

    if (action === 'publish') {
      const ver = await StorefrontPageService.publishStorefront(
        id,
        storefrontId || `sf_${id}`,
        'superadmin',
        changelog || 'Superadmin published storefront changes'
      );
      return NextResponse.json({
        success: true,
        data: ver,
        message: `Storefront published as Version ${ver.version}!`,
      }, { headers: corsHeaders() });
    }

    if (action === 'rollback') {
      if (!targetVersion) {
        return NextResponse.json({ success: false, error: 'targetVersion is required for rollback' }, { status: 400, headers: corsHeaders() });
      }
      const ver = await StorefrontPageService.rollbackStorefront(
        id,
        storefrontId || `sf_${id}`,
        Number(targetVersion),
        'superadmin'
      );
      return NextResponse.json({
        success: true,
        data: ver,
        message: `Storefront safely rolled back. New Version ${ver.version} created from Version ${targetVersion}.`,
      }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: false, error: 'Supported actions: publish, rollback' }, { status: 400, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
