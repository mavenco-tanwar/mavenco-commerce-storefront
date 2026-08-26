import { Category, Collection } from '@/types/category';
import { categoriesData, collectionsData } from '@/data/categories';
import { ApiClient, ApiResponse } from './api';

export class CategoryService {
  public static async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return ApiClient.simulateRequest<Category[]>(categoriesData, 60);
  }

  public static async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    const cat = categoriesData.find((c) => c.slug === slug) || null;
    return ApiClient.simulateRequest<Category | null>(cat, 50);
  }

  public static async getAllCollections(): Promise<ApiResponse<Collection[]>> {
    return ApiClient.simulateRequest<Collection[]>(collectionsData, 60);
  }

  public static async getCollectionBySlug(slug: string): Promise<ApiResponse<Collection | null>> {
    const col = collectionsData.find((c) => c.slug === slug) || null;
    return ApiClient.simulateRequest<Collection | null>(col, 50);
  }
}
