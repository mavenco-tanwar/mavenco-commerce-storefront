import { UserProfile, AuthState } from '@/types/auth';
import { ShippingAddress } from '@/types/order';
import { ApiClient, ApiResponse } from './api';

const mockDefaultUser: UserProfile = {
  id: 'usr-demo-01',
  name: 'Aanya Kapoor',
  email: 'aanya.kapoor@example.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  defaultAddressId: 'addr-01',
  savedAddresses: [
    {
      id: 'addr-01',
      fullName: 'Aanya Kapoor',
      email: 'aanya.kapoor@example.com',
      phone: '+91 98765 43210',
      addressLine1: 'Villa 14, Palm Meadows, Whitefield',
      addressLine2: 'Near Prestige Tech Park',
      landmark: 'Opposite Oakridge School',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      isDefault: true,
    },
    {
      id: 'addr-02',
      fullName: 'Aanya Kapoor (Office)',
      email: 'aanya.kapoor@workplace.com',
      phone: '+91 98765 43210',
      addressLine1: 'Level 5, Tower B, Global Cyber City',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: false,
    },
  ],
  createdAt: '2026-01-10T10:00:00Z',
};

export class AuthService {
  public static async getCurrentUser(): Promise<ApiResponse<UserProfile | null>> {
    return ApiClient.simulateRequest<UserProfile | null>(mockDefaultUser, 50);
  }

  public static async login(email: string, password?: string): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const user: UserProfile = {
      ...mockDefaultUser,
      email: email || mockDefaultUser.email,
    };
    return ApiClient.simulateRequest({
      user,
      token: 'jwt_mock_session_token_' + Date.now(),
    }, 120);
  }

  public static async register(data: { name: string; email: string; phone: string }): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      savedAddresses: [],
      createdAt: new Date().toISOString(),
    };
    return ApiClient.simulateRequest({
      user: newUser,
      token: 'jwt_mock_session_token_' + Date.now(),
    }, 150);
  }

  public static async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const updated = { ...mockDefaultUser, ...profile };
    return ApiClient.simulateRequest<UserProfile>(updated, 100);
  }
}
