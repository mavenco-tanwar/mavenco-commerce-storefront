import { apiClient } from './client';
import { mapCmsProductToStorefrontProduct } from './adapters';
import { Product, ProductQueryParams, ProductListResponse } from '@/types/product';

export class ProductApiService {
  /**
   * Retrieves products list strictly from API / DB with filtering, sorting, pagination, and search.
   * Never falls back to static mock arrays.
   */
  public static async getProducts(params: ProductQueryParams = {}): Promise<ProductListResponse> {
    try {
      const qs = new URLSearchParams();

      if (params.page) qs.append('page', params.page.toString());
      if (params.limit) qs.append('limit', params.limit.toString());
      if (params.search) qs.append('search', params.search);

      // Storefront must only query published products by default
      qs.append('status', params.status || 'published');

      // Scope to store tenant if available in params or current storefront path
      let resolvedTenant = params.tenant;
      if (!resolvedTenant && typeof window !== 'undefined') {
        const storeMatch = window.location.pathname.match(/^\/stores\/([a-zA-Z0-9_-]+)/);
        if (storeMatch && storeMatch[1]) {
          resolvedTenant = storeMatch[1];
        }
      }
      if (resolvedTenant) {
        qs.append('tenant', resolvedTenant);
      }

      // Sort translation
      if (params.sort) {
        if (params.sort === 'price-asc') qs.append('sort', 'price');
        else if (params.sort === 'price-desc') qs.append('sort', '-price');
        else if (params.sort === 'newest') qs.append('sort', '-created_at');
        else if (params.sort === 'rating') qs.append('sort', '-price');
      }

      if (params.category && params.category !== 'all') {
        qs.append('category', params.category);
      }

      const queryString = qs.toString() ? `?${qs.toString()}` : '';
      const res = await apiClient.get<any[]>(`/api/v1/products${queryString}`);

      let products: Product[] = (res.data || []).map((p) => mapCmsProductToStorefrontProduct(p));

      // Guard: Customers on public storefront must NEVER see draft or archived items
      products = products.filter((p) => p.status !== 'draft' && p.status !== 'archived');

      // Client-side refinement for fine-grained options (sizes, colors, price range) if needed
      if (params.department) {
        products = products.filter((p) => p.department === params.department);
      }

      if (params.category && params.category !== 'all') {
        products = products.filter((p) => p.category === params.category || p.slug.includes(params.category!));
      }

      if (params.minPrice !== undefined) {
        products = products.filter((p) => p.price >= params.minPrice!);
      }

      if (params.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= params.maxPrice!);
      }

      if (params.isSale) {
        products = products.filter((p) => p.isSale);
      }

      if (params.isNewArrival) {
        products = products.filter((p) => p.isNewArrival || p.badge?.toLowerCase().includes('drop'));
      }

      if (params.sizes && params.sizes.length > 0) {
        products = products.filter((p) =>
          p.sizes.some((s) => params.sizes!.includes(s.size))
        );
      }

      if (params.colors && params.colors.length > 0) {
        products = products.filter((p) =>
          p.colors.some((c) => params.colors!.includes(c.name))
        );
      }

      const total = products.length;
      const page = params.page || 1;
      const limit = params.limit || 20;

      return {
        data: {
          products,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch {
      // Zero fallback rule: Return empty list on failure or missing records
      return {
        data: {
          products: [],
          total: 0,
          page: 1,
          limit: params.limit || 20,
          totalPages: 1,
        },
      };
    }
  }

  /**
   * Retrieves a single product by its URL slug strictly from API.
   */
  public static async getProductBySlug(slug: string): Promise<{ data: Product | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/products/${encodeURIComponent(slug)}`);
      if (res.data) {
        const mapped = mapCmsProductToStorefrontProduct(res.data);
        if (mapped.status === 'draft' || mapped.status === 'archived') {
          return { data: null };
        }
        return { data: mapped };
      }
    } catch {
      // Zero fallback rule: Return null
    }
    return { data: null };
  }

  /**
   * Retrieves a single product by its unique ID strictly from API.
   */
  public static async getProductById(id: string): Promise<{ data: Product | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/products/${encodeURIComponent(id)}`);
      if (res.data) {
        const mapped = mapCmsProductToStorefrontProduct(res.data);
        if (mapped.status === 'draft' || mapped.status === 'archived') {
          return { data: null };
        }
        return { data: mapped };
      }
    } catch {
      // Zero fallback rule: Return null
    }
    return { data: null };
  }

  /**
   * Searches products by text query with debouncing support.
   */
  public static async search(query: string, limit: number = 8, tenant?: string): Promise<{ data: Product[] }> {
    if (!query.trim()) return { data: [] };
    const res = await this.getProducts({ search: query.trim(), limit, tenant });
    return { data: res.data.products.slice(0, limit) };
  }

  /**
   * Retrieves trending showcase products.
   */
  public static async getTrending(department?: 'women' | 'kids', limit: number = 8, tenant?: string): Promise<{ data: Product[] }> {
    const res = await this.getProducts({ department, limit, tenant });
    return { data: res.data.products.slice(0, limit) };
  }

  /**
   * Retrieves new arrivals.
   */
  public static async getNewArrivals(limit: number = 6, tenant?: string): Promise<{ data: Product[] }> {
    const res = await this.getProducts({ isNewArrival: true, limit, tenant });
    return { data: res.data.products.slice(0, limit) };
  }

  /**
   * Retrieves best seller products.
   */
  public static async getBestSellers(limit: number = 4, tenant?: string): Promise<{ data: Product[] }> {
    const res = await this.getProducts({ limit: 12, tenant });
    const best = res.data.products.filter((p) => p.isBestSeller);
    return { data: (best.length > 0 ? best : res.data.products).slice(0, limit) };
  }

  /**
   * Retrieves related products for a given product ID.
   */
  public static async getRelatedProducts(productId: string, limit: number = 4, tenant?: string): Promise<{ data: Product[] }> {
    const res = await this.getProducts({ limit: 10, tenant });
    const related = res.data.products.filter((p) => p.id !== productId);
    return { data: related.slice(0, limit) };
  }
}
