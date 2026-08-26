import { StoreConfig } from '@/types/store';
import { defaultStoreConfig } from '@/data/storeConfig';
import { ApiClient, ApiResponse } from './api';

export class StoreService {
  public static async getStoreConfig(): Promise<ApiResponse<StoreConfig>> {
    // In production, this would do: fetch(`/api/store/config`, { headers: { 'x-tenant-id': ApiClient.getTenant() } })
    return ApiClient.simulateRequest<StoreConfig>(defaultStoreConfig, 50);
  }

  public static async getAnnouncements() {
    const config = await this.getStoreConfig();
    return config.data.announcements;
  }
}
