import { apiClient } from './client';
import { mapCmsCustomerToStorefrontUser } from './adapters';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

export class AuthApiService {
  /**
   * Logs in customer with email and password.
   */
  public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<{ token: string; customer: any }>(
        '/api/v1/auth/customer/login',
        {
          email: credentials.email.trim(),
          password: credentials.password,
        }
      );

      if (res.data?.token && res.data?.customer) {
        apiClient.setAuthToken(res.data.token);
        const user = mapCmsCustomerToStorefrontUser(res.data.customer);
        return {
          user,
          token: res.data.token,
        };
      }
    } catch (err: any) {
      console.error('[AuthApiService] Login error:', err);
      throw new Error(err.message || 'Invalid email or password.');
    }

    throw new Error('Authentication failed. Please check your credentials.');
  }

  /**
   * Registers a new customer account.
   */
  public static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const names = data.name.trim().split(' ');
      const firstName = names[0] || 'Customer';
      const lastName = names.slice(1).join(' ') || '';

      const res = await apiClient.post<{ token: string; customer: any }>(
        '/api/v1/auth/customer/register',
        {
          email: data.email.trim(),
          password: data.password || 'welcome123',
          firstName,
          lastName,
          phone: data.phone,
          acceptsMarketing: true,
        }
      );

      if (res.data?.token && res.data?.customer) {
        apiClient.setAuthToken(res.data.token);
        const user = mapCmsCustomerToStorefrontUser(res.data.customer);
        return {
          user,
          token: res.data.token,
        };
      }
    } catch (err: any) {
      console.error('[AuthApiService] Registration error:', err);
      throw new Error(err.message || 'Registration failed. Email might already be registered.');
    }

    throw new Error('Failed to create account.');
  }

  /**
   * Fetches currently authenticated customer profile.
   */
  public static async getCurrentUser(): Promise<User | null> {
    const token = apiClient.getAuthToken();
    if (!token) return null;

    try {
      const res = await apiClient.get<any>('/api/v1/auth/customer/me');
      if (res.data) {
        return mapCmsCustomerToStorefrontUser(res.data);
      }
    } catch (err) {
      console.warn('[AuthApiService] Stale or invalid customer session');
      apiClient.setAuthToken(null);
    }
    return null;
  }

  /**
   * Logs out the customer and clears session tokens.
   */
  public static async logout(): Promise<void> {
    apiClient.setAuthToken(null);
  }
}
