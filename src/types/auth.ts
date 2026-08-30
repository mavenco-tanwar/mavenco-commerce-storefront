import { ShippingAddress } from './order';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  defaultAddressId?: string;
  savedAddresses: (ShippingAddress & { id: string })[];
  createdAt?: string;
}

export type User = UserProfile;
export type Address = ShippingAddress & { id: string };

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
}
