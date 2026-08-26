import { Product, SortOption, Department } from '@/types/product';
import { productsData } from '@/data/products';
import { ApiClient, ApiResponse } from './api';

export interface ProductQueryParams {
  department?: Department;
  category?: string;
  subcategories?: string[];
  sort?: SortOption;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  minRating?: number;
  limit?: number;
  offset?: number;
}

export interface ProductQueryResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export class ProductService {
  public static async getProducts(params?: ProductQueryParams): Promise<ApiResponse<ProductQueryResult>> {
    let filtered = [...productsData];

    if (!params) {
      return ApiClient.simulateRequest<ProductQueryResult>({
        products: filtered,
        total: filtered.length,
        hasMore: false,
      });
    }

    if (params.department) {
      filtered = filtered.filter((p) => p.department === params.department || p.department === 'unisex');
    }

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category === params.category || p.department === params.category
      );
    }

    if (params.isFeatured) {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (params.isNewArrival) {
      filtered = filtered.filter((p) => p.isNewArrival);
    }

    if (params.isBestSeller) {
      filtered = filtered.filter((p) => p.isBestSeller);
    }

    if (params.isSale) {
      filtered = filtered.filter((p) => p.isSale || p.discountPercent > 0);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.sizes && params.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => params.sizes!.includes(s.size) && s.inStock)
      );
    }

    if (params.colors && params.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((c) => params.colors!.includes(c.name))
      );
    }

    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= params.minRating!);
    }

    // Sorting
    switch (params.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'popular':
      case 'recommended':
      default:
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    const total = filtered.length;
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const paginated = filtered.slice(offset, offset + limit);

    return ApiClient.simulateRequest<ProductQueryResult>({
      products: paginated,
      total,
      hasMore: offset + limit < total,
    });
  }

  public static async getProductBySlug(slug: string): Promise<ApiResponse<Product | null>> {
    const product = productsData.find((p) => p.slug === slug) || null;
    return ApiClient.simulateRequest<Product | null>(product, 60);
  }

  public static async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    const product = productsData.find((p) => p.id === id) || null;
    return ApiClient.simulateRequest<Product | null>(product, 50);
  }

  public static async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const current = productsData.find((p) => p.id === productId);
    let related = productsData.filter((p) => p.id !== productId);

    if (current) {
      related = related.filter(
        (p) => p.department === current.department || p.category === current.category
      );
    }

    return ApiClient.simulateRequest<Product[]>(related.slice(0, limit), 60);
  }

  public static async getTrending(): Promise<ApiResponse<Product[]>> {
    const products = productsData.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 8);
    return ApiClient.simulateRequest<Product[]>(products, 50);
  }

  public static async getNewArrivals(limit: number = 8): Promise<ApiResponse<Product[]>> {
    const products = productsData.filter((p) => p.isNewArrival).slice(0, limit);
    return ApiClient.simulateRequest<Product[]>(products, 50);
  }

  public static async getBestSellers(limit: number = 8): Promise<ApiResponse<Product[]>> {
    const products = productsData.filter((p) => p.isBestSeller).slice(0, limit);
    return ApiClient.simulateRequest<Product[]>(products, 50);
  }

  public static async search(query: string): Promise<ApiResponse<Product[]>> {
    if (!query.trim()) {
      return ApiClient.simulateRequest<Product[]>([]);
    }
    const q = query.toLowerCase().trim();
    const matches = productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
    return ApiClient.simulateRequest<Product[]>(matches.slice(0, 8), 100);
  }
}
