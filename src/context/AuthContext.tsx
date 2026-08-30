'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Address } from '@/types/auth';
import { AuthService } from '@/services/auth';
import { CustomerApiService } from '@/services/api/customers';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'jq_trends_auth_user_v2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function initAuth() {
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Validate session with CMS backend
        const me = await AuthService.getCurrentUser();
        if (me) {
          setUser(me);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(me));
        }
      } catch (e) {
        console.error('Failed to initialize customer auth:', e);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password?: string) => {
      setIsLoading(true);
      try {
        const res = await AuthService.login({ email, password: password || 'demo123' });
        setUser(res.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        showToast('Welcome Back!', `Signed in as ${res.user.name}`, 'success');
        return true;
      } catch (err: any) {
        showToast('Login Failed', err.message || 'Please check your credentials', 'error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const register = useCallback(
    async (name: string, email: string, phone: string, password?: string) => {
      setIsLoading(true);
      try {
        const res = await AuthService.register({ name, email, phone, password: password || 'welcome123' });
        setUser(res.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        showToast('Account Created!', `Welcome to JQ Trends, ${name}`, 'success');
        return true;
      } catch (err: any) {
        showToast('Registration Error', err.message || 'Unable to create account', 'error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('Logged Out', 'You have been safely signed out', 'info');
  }, [showToast]);

  const addAddress = useCallback(
    async (address: Omit<Address, 'id'>) => {
      if (!user) return;
      try {
        const updated = await CustomerApiService.addAddress(user, address);
        setUser(updated);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
        showToast('Address Saved', 'New delivery address added', 'success');
      } catch (e: any) {
        showToast('Failed to Save Address', e.message || 'Please try again', 'error');
      }
    },
    [user, showToast]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!user) return;
      try {
        const updated = await CustomerApiService.deleteAddress(user, addressId);
        setUser(updated);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
        showToast('Address Removed', 'Delivery address deleted', 'info');
      } catch (e: any) {
        showToast('Failed to Delete Address', e.message || 'Please try again', 'error');
      }
    },
    [user, showToast]
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      if (!user) return;
      try {
        const updated = await CustomerApiService.setDefaultAddress(user, addressId);
        setUser(updated);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
        showToast('Default Address Set', 'Default shipping address updated', 'success');
      } catch (e: any) {
        showToast('Failed to Update', e.message || 'Please try again', 'error');
      }
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
