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
  addItem: (product: Product, color: string, size: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'jq_trends_cart_v1';
const COUPON_STORAGE_KEY = 'jq_trends_coupon_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('JQTRENDS10'); // Default demo coupon active!
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { showToast } = useToast();

  // Load from local storage
  useEffect(() => {
    try {
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
    (product: Product, color: string, size: string, quantity: number = 1) => {
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

      showToast(
        'Added to Bag!',
        `${product.name} (${size} • ${color})`,
        'success'
      );
      setIsDrawerOpen(true);
    },
    [showToast]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((i) => i.id === itemId);
        if (itemToRemove) {
          showToast('Removed from Bag', itemToRemove.product.name, 'info');
        }
        return prev.filter((i) => i.id !== itemId);
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
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
    },
    [removeItem]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      const res = await CartService.validateCoupon(code, summary.subtotal);
      if (res.data.valid && res.data.coupon) {
        setCouponCode(res.data.coupon.code);
        showToast('Coupon Applied!', res.data.message, 'success');
        return { success: true, message: res.data.message };
      } else {
        showToast('Coupon Not Applied', res.data.message, 'error');
        return { success: false, message: res.data.message };
      }
    },
    [summary.subtotal, showToast]
  );

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    showToast('Coupon Removed', undefined, 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

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
