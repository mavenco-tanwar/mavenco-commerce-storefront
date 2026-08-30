export interface ApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
  tenantId?: string;
  authToken?: string;
  timeoutMs?: number;
  retries?: number;
}

export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details?: any;

  constructor(message: string, status: number = 500, code: string = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiResponseEnvelope<T> {
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    version?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private tenantId: string;
  private authToken: string | null = null;
  private timeoutMs: number;
  private retries: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (
      config.baseUrl ||
      process.env.NEXT_PUBLIC_CMS_API_URL ||
      'http://localhost:4000'
    ).replace(/\/+$/, '');

    this.apiKey =
      config.apiKey ||
      process.env.NEXT_PUBLIC_CMS_API_KEY ||
      'pk_live_jq_trends_2026';

    this.tenantId =
      config.tenantId ||
      process.env.NEXT_PUBLIC_DEFAULT_TENANT ||
      'store_jq_trends';

    this.timeoutMs = config.timeoutMs || 10000;
    this.retries = config.retries || 1;

    // In browser environment, restore customer token if present
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('jq_auth_token') || null;
    }
  }

  public setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('jq_auth_token', token);
      } else {
        localStorage.removeItem('jq_auth_token');
      }
    }
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponseEnvelope<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-Store-ID': this.tenantId,
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    let attempt = 0;
    while (attempt <= this.retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const res = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const errMsg =
            json?.error?.message ||
            `HTTP ${res.status}: Failed to communicate with store services.`;
          const errCode = json?.error?.code || 'SERVER_ERROR';

          // On 401 Unauthorized for authenticated customer calls, clear stale token
          if (res.status === 401 && this.authToken && endpoint.includes('/auth/customer/me')) {
            this.setAuthToken(null);
          }

          throw new ApiClientError(errMsg, res.status, errCode, json?.error?.details);
        }

        return json as ApiResponseEnvelope<T>;
      } catch (err: any) {
        attempt++;
        if (err.name === 'ApiClientError' || attempt > this.retries) {
          if (err.name === 'AbortError') {
            throw new ApiClientError('Connection timeout to store services. Please try again.', 408, 'TIMEOUT');
          }
          throw err;
        }
        // Exponential retry delay
        await new Promise((r) => setTimeout(r, 150 * Math.pow(2, attempt)));
      }
    }

    throw new ApiClientError('Unable to connect to store services.', 500, 'MAX_RETRIES_EXCEEDED');
  }

  public get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public patch<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
