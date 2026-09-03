'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatTenantHref } from '@/lib/tenant-config';
import { CartItemList } from '@/components/cart/CartItemList';
import { CartSummary } from '@/components/cart/CartSummary';
import { FreeShippingBar } from '@/components/cart/FreeShippingBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product } from '@/types/product';
import { ProductService } from '@/services/products';

export default function CartPage() {
  const { items, summary } = useCart();
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    ProductService.getTrending().then((res) => {
      setRecommended(res.data.slice(0, 4));
    });
  }, []);

  return (
    <div className="bg-[#FFFDFC] py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} className="mb-4" />

        <div className="flex items-baseline justify-between pb-6 border-b border-[#E8DED8] mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
            Your Shopping Bag
          </h1>
          {items.length > 0 && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#B77A68]">
              {summary.totalItemCount} Items Selected
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={ShoppingBag}
              title="Your Bag is Waiting for Something Beautiful"
              description="Explore our latest summer arrivals, festive ethnic wear, and adorable kids collections."
              actionText="Explore New Arrivals"
              actionHref={formatTenantHref('/new-arrivals')}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <FreeShippingBar
              subtotal={summary.subtotal}
              threshold={summary.freeShippingThreshold}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List (7 cols on lg) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CartItemList items={items} />
              </div>

              {/* Order Summary (5 cols on lg) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <CartSummary summary={summary} />
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommended.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8DED8]">
            <div className="text-center max-w-md mx-auto mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
                Pairs Well With Your Bag
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#111111] mt-1">
                Trending Recommendations
              </h3>
            </div>

            <ProductGrid products={recommended} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
