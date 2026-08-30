import { apiClient } from './client';
import { mapCmsCategoryToStorefrontCategory } from './adapters';
import { Category, Collection } from '@/types/category';
import { categoriesData, collectionsData } from '@/data/categories';

export class CategoryApiService {
  private static cachedCategories: Category[] | null = null;
  private static cachedCollections: Collection[] | null = null;

  /**
   * Retrieves all active store categories.
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
      console.warn('[CategoryApiService] Using fallback categories:', err);
    }

    const fallback = this.cachedCategories || categoriesData;
    if (department) {
      return { data: fallback.filter((c) => c.department === department) };
    }
    return { data: fallback };
  }

  /**
   * Retrieves a single category by slug.
   */
  public static async getCategoryBySlug(slug: string): Promise<{ data: Category | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/categories/slug/${encodeURIComponent(slug)}`);
      if (res.data) {
        return { data: mapCmsCategoryToStorefrontCategory(res.data) };
      }
    } catch {
      // Fallback
    }
    const fallback = categoriesData.find((c) => c.slug === slug) || null;
    return { data: fallback };
  }

  /**
   * Retrieves lookbook collections.
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
          bannerImage: c.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
          badge: 'Lookbook',
          productIds: [],
        }));

        this.cachedCollections = collections;
        return { data: collections };
      }
    } catch (err) {
      console.warn('[CategoryApiService] Using fallback collections:', err);
    }

    return { data: this.cachedCollections || collectionsData };
  }

  /**
   * Retrieves a single collection by slug.
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
            bannerImage: c.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
            badge: 'Lookbook',
            productIds: [],
          },
        };
      }
    } catch {
      // Fallback
    }
    const fallback = collectionsData.find((c) => c.slug === slug) || null;
    return { data: fallback };
  }
}
