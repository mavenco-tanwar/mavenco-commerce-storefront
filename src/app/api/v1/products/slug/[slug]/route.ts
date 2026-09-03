import { NextRequest, NextResponse } from 'next/server';
import { GET as getProductHandler, OPTIONS as optionsHandler } from '../../[slug]/route';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return optionsHandler();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return getProductHandler(request, context);
}
