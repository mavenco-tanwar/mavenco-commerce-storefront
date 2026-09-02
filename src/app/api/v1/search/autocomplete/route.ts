import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/products';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        query,
        suggestions: [],
      }, { headers: corsHeaders() });
    }

    const prodsRes = await ProductService.getAllProducts();
    const allProducts = prodsRes.data || [];

    const suggestions: any[] = [];

    // Matching products
    const matchingProds = allProducts
      .filter((p: any) => p.name?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query))
      .slice(0, 4);

    for (const p of matchingProds) {
      suggestions.push({
        type: 'product',
        id: p.id,
        label: p.name,
        category: p.category,
        price: p.price,
        image: Array.isArray(p.images) ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url) : '',
        url: `/products/${p.slug || p.id}`,
      });
    }

    // Matching categories
    const categories = ['Dresses', 'Blazers', 'Co-ords', 'Tops', 'Linen', 'Evening Wear'];
    const matchingCats = categories.filter((c) => c.toLowerCase().includes(query)).slice(0, 2);
    for (const c of matchingCats) {
      suggestions.push({
        type: 'category',
        label: `Explore in ${c}`,
        url: `/search?q=${encodeURIComponent(c)}`,
      });
    }

    return NextResponse.json({
      success: true,
      query,
      suggestions,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
