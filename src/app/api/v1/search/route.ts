import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ProductService } from '@/services/products';

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const query = (searchParams.get('q') || '').trim();
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
    const inStockOnly = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'relevance';

    const db = await getDatabase();

    // 1. Check for Query Redirects in Merchandising
    if (db && query) {
      const redirectRule = await db.collection('search_merchandising').findOne({
        tenantId: tenantSlug,
        action: 'redirect',
        status: 'active',
        query: { $regex: new RegExp(`^${query}$`, 'i') },
      });
      if (redirectRule && redirectRule.targetUrl) {
        return NextResponse.json({
          success: true,
          redirectUrl: redirectRule.targetUrl,
        }, { headers: corsHeaders() });
      }
    }

    // 2. Fetch all products for tenant
    const prodsRes = await ProductService.getAllProducts();
    let allProducts = prodsRes.data || [];

    // 3. Synonym Expansion (e.g. "gown" -> "dress", "tee" -> "t-shirt")
    let searchTerms = [query.toLowerCase()];
    if (db && query) {
      const synDoc = await db.collection('search_synonyms').findOne({
        tenantId: tenantSlug,
        status: 'active',
        $or: [
          { primaryTerm: { $regex: new RegExp(`^${query}$`, 'i') } },
          { synonyms: { $in: [new RegExp(`^${query}$`, 'i')] } },
        ],
      });
      if (synDoc) {
        searchTerms.push(synDoc.primaryTerm.toLowerCase());
        if (Array.isArray(synDoc.synonyms)) {
          searchTerms.push(...synDoc.synonyms.map((s: string) => s.toLowerCase()));
        }
      }
    }

    // 4. Text Match & Scoring
    let hits = allProducts.map((p: any) => {
      let score = 0;
      let matchReason = '';
      const title = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();

      if (!query) {
        score = 100;
      } else {
        for (const term of searchTerms) {
          if (!term) continue;
          if (title === term) {
            score += 100;
            matchReason = 'Exact Title Match';
          } else if (title.includes(term)) {
            score += 60;
            matchReason = 'Title Match';
          } else if (cat.includes(term)) {
            score += 40;
            matchReason = 'Category Match';
          } else if (sku.includes(term)) {
            score += 50;
            matchReason = 'SKU Match';
          } else if (desc.includes(term)) {
            score += 20;
            matchReason = 'Description Match';
          }
        }
      }

      const inStock = (p.stock ?? 25) > 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        images: Array.isArray(p.images) ? p.images.map((img: any) => typeof img === 'string' ? img : img.url) : [],
        category: p.category || 'Women',
        sku: p.sku || 'SKU',
        rating: p.rating || 4.9,
        reviewCount: p.reviewCount || 18,
        inStock,
        score,
        matchReason,
        isPinned: false,
      };
    });

    // Filter by score > 0 if query provided
    if (query) {
      hits = hits.filter((h: any) => h.score > 0);
    }

    // 5. Apply Merchandising Pins & Boosts
    if (db && query) {
      const pinRule = await db.collection('search_merchandising').findOne({
        tenantId: tenantSlug,
        action: 'pin',
        status: 'active',
        query: { $regex: new RegExp(`^${query}$`, 'i') },
      });

      if (pinRule && pinRule.targetProductId) {
        const pinnedIdx = hits.findIndex((h: any) => h.id === pinRule.targetProductId);
        if (pinnedIdx > -1) {
          const [pinned] = hits.splice(pinnedIdx, 1);
          pinned.isPinned = true;
          pinned.matchReason = 'Pinned by Merchandiser';
          hits.unshift(pinned);
        }
      }
    }

    // 6. Facet Filtering
    if (category && category !== 'all') {
      hits = hits.filter((h: any) => h.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice !== null) {
      hits = hits.filter((h: any) => h.price >= minPrice);
    }
    if (maxPrice !== null) {
      hits = hits.filter((h: any) => h.price <= maxPrice);
    }
    if (inStockOnly) {
      hits = hits.filter((h: any) => h.inStock);
    }

    // 7. Sorting
    if (sort === 'price_asc') {
      hits.sort((a: any, b: any) => a.price - b.price);
    } else if (sort === 'price_desc') {
      hits.sort((a: any, b: any) => b.price - a.price);
    } else if (sort === 'rating') {
      hits.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      hits.reverse();
    } else {
      // Relevance
      hits.sort((a: any, b: any) => {
        if (a.isPinned) return -1;
        if (b.isPinned) return 1;
        return (b.score || 0) - (a.score || 0);
      });
    }

    // 8. Generate Dynamic Facets
    const categoryCounts: Record<string, number> = {};
    for (const prod of allProducts) {
      const cat = prod.category || 'Women';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    const facets = [
      {
        id: 'category',
        name: 'Garment Category',
        type: 'category' as const,
        options: Object.entries(categoryCounts).map(([label, count]) => ({
          label,
          value: label.toLowerCase(),
          count,
        })),
      },
      {
        id: 'price',
        name: 'Price Range',
        type: 'price' as const,
        options: [
          { label: 'Under $1,000', value: '0-1000', count: allProducts.filter((p: any) => p.price < 1000).length },
          { label: '$1,000 - $2,000', value: '1000-2000', count: allProducts.filter((p: any) => p.price >= 1000 && p.price <= 2000).length },
          { label: 'Above $2,000', value: '2000-99999', count: allProducts.filter((p: any) => p.price > 2000).length },
        ],
      },
      {
        id: 'availability',
        name: 'Stock Status',
        type: 'availability' as const,
        options: [
          { label: 'In Stock Only', value: 'in_stock', count: allProducts.filter((p: any) => (p.stock ?? 25) > 0).length },
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      query,
      total: hits.length,
      products: hits,
      facets,
      sort,
      suggestions: query ? ['Floral Dress', 'Silk Blazer', 'Linen Co-ord', 'Evening Gown'] : [],
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
