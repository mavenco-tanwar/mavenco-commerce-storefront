/**
 * Base API Client Service
 * 
 * Supports multi-tenant context resolution (subdomain / headers),
 * realistic mock simulated async latencies, and standardized error responses.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  tenantId?: string;
}

export class ApiClient {
  private static tenantId: string = 'jq-trends-main';

  public static setTenant(tenantId: string) {
    this.tenantId = tenantId;
  }

  public static getTenant(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If subdomain format like fashion.example.com
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        return parts[0];
      }
    }
    return this.tenantId;
  }

  /**
   * Helper that simulates network latency and returns typed data
   */
  public static async simulateRequest<T>(data: T, delayMs: number = 80): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
          tenantId: this.getTenant(),
        });
      }, delayMs);
    });
  }
}
