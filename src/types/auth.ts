import { ShippingAddress } from './order';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  defaultAddressId?: string;
  savedAddresses: (ShippingAddress & { id: string })[];
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
}
