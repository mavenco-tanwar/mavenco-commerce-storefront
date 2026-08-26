'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  MapPin,
  User,
  Heart,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { OrderService } from '@/services/orders';
import { Order } from '@/types/order';
import { OrderCard } from '@/components/account/OrderCard';
import { AddressManager } from '@/components/account/AddressManager';
import { ProfileForm } from '@/components/account/ProfileForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'orders' | 'addresses' | 'profile') || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await OrderService.getUserOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="bg-[#FFFDFC] py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'My Account' }]} className="mb-4" />

        {/* Customer Header Info */}
        <div className="p-6 sm:p-8 bg-[#FAF6F2] border border-[#E8DED8] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#111111] text-[#FFFDFC] flex items-center justify-center font-serif text-xl font-bold">
              {user ? user.name.charAt(0).toUpperCase() : 'J'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
                Hello, {user ? user.name : 'Fashion Lover'}
              </h1>
              <p className="text-xs text-[#777777] font-sans mt-0.5">
                {user?.email || 'Logged in to JQ Trends VIP'} • Member since 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/wishlist"
              className="text-xs px-3.5 py-2 bg-[#FFFDFC] border border-[#E8DED8] text-[#111111] font-semibold flex items-center gap-1.5 hover:border-[#B77A68] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#B77A68]" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>

            <button
              onClick={logout}
              className="text-xs px-3.5 py-2 bg-[#FFFDFC] border border-[#E8DED8] text-[#C98282] font-semibold flex items-center gap-1.5 hover:bg-[#F7EBEA] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard: Tabs Navigation (Desktop Left) + Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tab Buttons (3 cols) */}
          <div className="lg:col-span-3 space-y-1 bg-[#FAF6F2] border border-[#E8DED8] p-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-sm'
                  : 'text-[#777777] hover:text-[#111111] hover:bg-[#FFFDFC]'
              }`}
            >
              <Package className="w-4 h-4 text-[#B77A68]" />
              <span>My Orders &amp; Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-sm'
                  : 'text-[#777777] hover:text-[#111111] hover:bg-[#FFFDFC]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#B77A68]" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-sm'
                  : 'text-[#777777] hover:text-[#111111] hover:bg-[#FFFDFC]'
              }`}
            >
              <User className="w-4 h-4 text-[#B77A68]" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Tab Content Display (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#111111]">
                    Your Order History
                  </h3>
                  <p className="text-xs text-[#777777] font-sans">
                    Track current parcels, review past invoices, and manage returns.
                  </p>
                </div>

                {isLoadingOrders ? (
                  <div className="py-12 text-center text-xs text-[#777777]">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No Orders Placed Yet"
                    description="When you place orders, their real-time BlueDart & Delhivery tracking milestones will appear right here."
                    actionText="Start Shopping"
                    actionHref="/new-arrivals"
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && <AddressManager />}

            {activeTab === 'profile' && <ProfileForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-[#777777]">Loading account...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
