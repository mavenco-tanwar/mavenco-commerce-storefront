import { apiClient } from './client';
import { mapCmsCategoryToStorefrontCategory } from './adapters';
import { Category, Collection } from '@/types/category';

export class CategoryApiService {
  private static cachedCategories: Category[] | null = null;
  private static cachedCollections: Collection[] | null = null;

  /**
   * Retrieves all active store categories strictly from database API.
   * Never falls back to static categories arrays.
   */
  public static async getCategories(department?: 'women' | 'kids'): Promise<{ data: Category[] }> {
    try {
      const res = await apiClient.get<any[]>('/api/v1/categories');
      const allCms = res.data || [];
      if (allCms.length > 0) {
        const parentCategories = allCms.filter((c: any) => !c.parentId);
        const categories: Category[] = parentCategories.map((p) =>
          mapCmsCategoryToStorefrontCategory(p, allCms)
        );
        this.cachedCategories = categories;

        if (department) {
          return { data: categories.filter((c) => c.department === department) };
        }
        return { data: categories };
      }
    } catch (err) {
      console.warn('[CategoryApiService] Category API fetch error:', err);
    }

    if (this.cachedCategories) {
      if (department) {
        return { data: this.cachedCategories.filter((c) => c.department === department) };
      }
      return { data: this.cachedCategories };
    }

    // Zero fallback rule: Return empty array when unconfigured
    return { data: [] };
  }

  /**
   * Retrieves a single category by slug strictly from API.
   */
  public static async getCategoryBySlug(slug: string): Promise<{ data: Category | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/categories/slug/${encodeURIComponent(slug)}`);
      if (res.data) {
        return { data: mapCmsCategoryToStorefrontCategory(res.data) };
      }
    } catch {
      // Zero fallback rule
    }
    return { data: null };
  }

  /**
   * Retrieves lookbook collections strictly from API.
   */
  public static async getCollections(): Promise<{ data: Collection[] }> {
    try {
      const res = await apiClient.get<any[]>('/api/v1/collections');
      if (res.data && res.data.length > 0) {
        const collections: Collection[] = res.data.map((c: any) => ({
          id: c.id,
          name: c.title || c.name,
          slug: c.slug,
          subtitle: 'Studio Exclusive Lookbook',
          description: c.description || '',
          bannerImage: c.imageUrl || '',
          badge: 'Lookbook',
          productIds: Array.isArray(c.productIds) ? c.productIds : [],
        }));

        this.cachedCollections = collections;
        return { data: collections };
      }
    } catch (err) {
      console.warn('[CategoryApiService] Collection API fetch error:', err);
    }

    if (this.cachedCollections) {
      return { data: this.cachedCollections };
    }

    // Zero fallback rule: Return empty list
    return { data: [] };
  }

  /**
   * Retrieves a single collection by slug strictly from API.
   */
  public static async getCollectionBySlug(slug: string): Promise<{ data: Collection | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/collections/slug/${encodeURIComponent(slug)}`);
      if (res.data) {
        const c = res.data;
        return {
          data: {
            id: c.id,
            name: c.title || c.name,
            slug: c.slug,
            subtitle: 'Studio Exclusive Lookbook',
            description: c.description || '',
            bannerImage: c.imageUrl || '',
            badge: 'Lookbook',
            productIds: Array.isArray(c.productIds) ? c.productIds : [],
          },
        };
      }
    } catch {
      // Zero fallback rule
    }
    return { data: null };
  }

  public static clearCache(): void {
    this.cachedCategories = null;
    this.cachedCollections = null;
  }
}
