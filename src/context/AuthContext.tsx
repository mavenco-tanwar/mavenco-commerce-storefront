'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile } from '@/types/auth';
import { ShippingAddress } from '@/types/order';
import { AuthService } from '@/services/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<ShippingAddress, 'isDefault'> & { isDefault?: boolean }) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'jq_trends_auth_user_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Initialize with demo user for smooth ecommerce testing
        AuthService.getCurrentUser().then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data));
          }
        });
      }
    } catch (e) {
      console.error('Failed to initialize auth', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password?: string) => {
      setIsLoading(true);
      try {
        const res = await AuthService.login(email, password);
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        showToast('Welcome Back!', `Logged in as ${res.data.user.name}`, 'success');
        return true;
      } catch {
        showToast('Login Failed', 'Please check your credentials', 'error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const register = useCallback(
    async (name: string, email: string, phone: string) => {
      setIsLoading(true);
      try {
        const res = await AuthService.register({ name, email, phone });
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        showToast('Account Created!', `Welcome to JQ Trends, ${name}`, 'success');
        return true;
      } catch {
        showToast('Registration Error', 'Unable to create account', 'error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('Logged Out', 'You have been safely signed out', 'info');
  }, [showToast]);

  const addAddress = useCallback(
    (address: Omit<ShippingAddress, 'isDefault'> & { isDefault?: boolean }) => {
      if (!user) return;
      const newAddressId = 'addr-' + Date.now();
      const updatedSavedAddresses = [
        ...user.savedAddresses.map((a) => (address.isDefault ? { ...a, isDefault: false } : a)),
        { ...address, id: newAddressId, isDefault: !!address.isDefault },
      ];
      const updatedUser: UserProfile = {
        ...user,
        savedAddresses: updatedSavedAddresses,
        defaultAddressId: address.isDefault ? newAddressId : user.defaultAddressId || newAddressId,
      };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      showToast('Address Saved', 'New delivery address added', 'success');
    },
    [user, showToast]
  );

  const deleteAddress = useCallback(
    (addressId: string) => {
      if (!user) return;
      const updatedSavedAddresses = user.savedAddresses.filter((a) => a.id !== addressId);
      const updatedUser: UserProfile = {
        ...user,
        savedAddresses: updatedSavedAddresses,
      };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      showToast('Address Deleted', undefined, 'info');
    },
    [user, showToast]
  );

  const setDefaultAddress = useCallback(
    (addressId: string) => {
      if (!user) return;
      const updatedSavedAddresses = user.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      const updatedUser: UserProfile = {
        ...user,
        savedAddresses: updatedSavedAddresses,
        defaultAddressId: addressId,
      };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      showToast('Default Address Updated', undefined, 'success');
    },
    [user, showToast]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
