'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, CartSummary } from '@/types/cart';
import { Product } from '@/types/product';
import { CartService } from '@/services/cart';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  couponCode: string;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, color: string, size: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lumina_cart_session_v1';
const COUPON_STORAGE_KEY = 'lumina_coupon_code_v1';
const SESSION_ID_KEY = 'lumina_cart_session_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('LUMINA10');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('sess_guest_default');
  const { showToast } = useToast();

  // Load or generate session & cached cart
  useEffect(() => {
    try {
      let currentSessionId = localStorage.getItem(SESSION_ID_KEY);
      if (!currentSessionId) {
        currentSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem(SESSION_ID_KEY, currentSessionId);
      }
      setSessionId(currentSessionId);

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon !== null) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, couponCode, isInitialized]);

  const summary = CartService.calculateSummary(items, couponCode);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addItem = useCallback(
    async (product: Product, color: string, size: string, quantity: number = 1) => {
      const itemId = `${product.id}-${color.replace(/\s+/g, '-')}-${size}`;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            totalPrice: newQty * product.price,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
            unitPrice: product.price,
            totalPrice: quantity * product.price,
          };
          return [newItem, ...prevItems];
        }
      });

      // Auto open Mini Cart drawer and show toast
      setIsDrawerOpen(true);
      showToast(`Added ${product.name} (${color} / ${size}) to your bag!`, 'success');

      // Sync with server cart API
      try {
        await fetch('/api/v1/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant: 'lumina',
            sessionId,
            productId: product.id,
            color,
            size,
            quantity,
          }),
        });
      } catch (err) {
        console.warn('Server cart sync notice:', err);
      }
    },
    [sessionId, showToast]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      showToast('Item removed from shopping bag.', 'info');

      try {
        await fetch(`/api/v1/cart/items?tenant=lumina&sessionId=${sessionId}&itemId=${itemId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Server cart sync notice:', err);
      }
    },
    [sessionId, showToast]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity,
              totalPrice: quantity * item.unitPrice,
            };
          }
          return item;
        })
      );

      try {
        await fetch('/api/v1/cart/items', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant: 'lumina',
            sessionId,
            itemId,
            quantity,
          }),
        });
      } catch (err) {
        console.warn('Server cart sync notice:', err);
      }
    },
    [sessionId, removeItem]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      const clean = code.trim().toUpperCase();
      if (!clean) {
        return { success: false, message: 'Please enter a coupon code.' };
      }

      const res = await CartService.validateCoupon(clean, summary.subtotal);
      if (res.data.valid) {
        setCouponCode(clean);
        showToast(res.data.message, 'success');
        return { success: true, message: res.data.message };
      } else {
        showToast(res.data.message, 'error');
        return { success: false, message: res.data.message };
      }
    },
    [summary.subtotal, showToast]
  );

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    showToast('Coupon code removed.', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      fetch(`/api/v1/cart?tenant=lumina&sessionId=${sessionId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Server clear cart notice:', err);
    }
  }, [sessionId]);

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        couponCode,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
