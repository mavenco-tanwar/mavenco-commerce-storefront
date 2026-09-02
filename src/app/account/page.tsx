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
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Printer,
  X,
  Plus,
  ShieldCheck,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  productSnapshot?: {
    title: string;
    image: string;
    sku: string;
  };
  variantSnapshot?: {
    name: string;
  };
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  email: string;
  phone: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discountTotal: number;
    shippingFee: number;
    grandTotal: number;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'orders' | 'addresses' | 'profile') || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>(initialTab);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();
  const { addItem } = useCart();

  // Load customer orders from server
  useEffect(() => {
    async function loadOrders() {
      try {
        const email = user?.email || 'aanya.kapoor@example.com';
        const res = await fetch(`/api/v1/customer/orders?tenant=lumina&email=${encodeURIComponent(email)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrders(json.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user?.email]);

  const handlePrintInvoice = (order: OrderRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = (order.items || [])
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #EFE8E2; font-size: 12px;">
          <td style="padding: 10px 4px;">${idx + 1}</td>
          <td style="padding: 10px 4px;">
            <strong>${it.productSnapshot?.title || 'Luxury Garment'}</strong>
            <div style="color: #666; font-size: 10px;">${it.variantSnapshot?.name || 'Standard'} • SKU: ${it.productSnapshot?.sku || 'SKU'}</div>
          </td>
          <td style="padding: 10px 4px; text-align: center;">${it.quantity}</td>
          <td style="padding: 10px 4px; text-align: right;">$${it.unitPrice.toLocaleString()}</td>
          <td style="padding: 10px 4px; text-align: right; font-weight: bold;">$${(it.unitPrice * it.quantity).toLocaleString()}</td>
        </tr>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px; }
            .badge { display: inline-block; padding: 4px 8px; font-size: 11px; font-weight: bold; background: #e6f4ea; color: #137333; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">MAVENCO COMMERCE</h1>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">Tax Invoice &amp; Order Summary</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 16px; font-mono; font-weight: bold;">${order.orderNumber}</h2>
              <span class="badge">${(order.orderStatus || 'CONFIRMED').toUpperCase()}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 28px; font-size: 12px;">
            <div>
              <strong style="text-transform: uppercase; color: #888; font-size: 10px;">Billed &amp; Shipped To:</strong>
              <div style="font-weight: bold; margin-top: 4px;">${order.shippingAddress?.fullName}</div>
              <div>${order.shippingAddress?.addressLine1}</div>
              <div>${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</div>
              <div>Phone: ${order.shippingAddress?.phone}</div>
            </div>
            <div style="text-align: right;">
              <strong style="text-transform: uppercase; color: #888; font-size: 10px;">Payment Information:</strong>
              <div style="margin-top: 4px;">Method: <strong style="text-transform: uppercase;">${order.paymentMethod}</strong></div>
              <div>Status: <strong style="color: #137333; text-transform: uppercase;">${order.paymentStatus}</strong></div>
              <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 2px solid #EFE8E2; font-size: 11px; text-transform: uppercase; color: #666;">
                <th style="padding: 8px 4px; text-align: left;">#</th>
                <th style="padding: 8px 4px; text-align: left;">Item Description</th>
                <th style="padding: 8px 4px; text-align: center;">Qty</th>
                <th style="padding: 8px 4px; text-align: right;">Price</th>
                <th style="padding: 8px 4px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-left: auto; width: 280px; font-size: 12px; border-top: 2px solid #111; padding-top: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <strong style="font-family: monospace;">$${(order.pricing?.subtotal || 0).toLocaleString()}</strong>
            </div>
            ${
              order.pricing?.discountTotal
                ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #c98282;">
                    <span>Discount:</span>
                    <strong style="font-family: monospace;">-$${order.pricing.discountTotal.toLocaleString()}</strong>
                  </div>`
                : ''
            }
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Shipping:</span>
              <strong>${order.pricing?.shippingFee === 0 ? 'FREE' : `$${order.pricing?.shippingFee}`}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
              <span>Grand Total:</span>
              <span style="font-family: monospace;">$${(order.pricing?.grandTotal || 0).toLocaleString()}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleReorder = async (order: OrderRecord) => {
    for (const it of order.items) {
      const mockProduct: any = {
        id: it.productId,
        name: it.productSnapshot?.title || 'Product',
        slug: 'product',
        price: it.unitPrice,
        images: [it.productSnapshot?.image || ''],
        sku: it.productSnapshot?.sku || 'SKU',
      };
      await addItem(mockProduct, 'Rose', 'M', it.quantity);
    }
    showToast(`Items from Order ${order.orderNumber} added to your bag!`, 'success');
  };

  return (
    <div className="bg-[#FFFDFC] py-8 sm:py-12 select-none min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'My Account' }]} className="mb-2" />

        {/* Customer Header Info */}
        <div className="p-6 sm:p-8 bg-[#FAF7F5] border border-[#EFE8E2] rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
              {user ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                Hello, {user ? user.name : 'Aanya Kapoor'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {user?.email || 'aanya.kapoor@example.com'} • Verified Customer Member
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/wishlist"
              className="text-xs px-4 py-2.5 bg-white border border-[#EFE8E2] text-slate-900 font-bold rounded-xl flex items-center gap-1.5 hover:border-rose-300 transition-colors shadow-2xs"
            >
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>

            <button
              onClick={logout}
              className="text-xs px-4 py-2.5 bg-white border border-[#EFE8E2] text-rose-600 font-bold rounded-xl flex items-center gap-1.5 hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-1.5 bg-[#FAF7F5] border border-[#EFE8E2] p-3 rounded-2xl shadow-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Package className="w-4 h-4 text-rose-500" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <User className="w-4 h-4 text-rose-500" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Main Content Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
                  <h2 className="text-xl font-serif font-bold text-slate-900">
                    Order History
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    Showing {orders.length} orders
                  </span>
                </div>

                {isLoadingOrders ? (
                  <div className="py-12 text-center text-slate-400">Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">No Orders Placed Yet</h3>
                    <p className="text-xs text-slate-500">Explore our luxury fashion collections to place your first order.</p>
                    <Link
                      href="/collections"
                      className="inline-block px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EFE8E2]">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-black text-sm text-slate-900">
                                {order.orderNumber}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {order.orderStatus || 'CONFIRMED'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Placed on {dateFormatted}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-3.5 py-2 rounded-xl bg-white border border-[#EFE8E2] text-xs font-bold text-slate-800 hover:border-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePrintInvoice(order)}
                              className="px-3.5 py-2 rounded-xl bg-white border border-[#EFE8E2] text-xs font-bold text-slate-800 hover:border-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-500" />
                              <span>Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Buy Again</span>
                            </button>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-3">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-15 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                                  {it.productSnapshot?.image && (
                                    <img
                                      src={it.productSnapshot.image}
                                      alt={it.productSnapshot.title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{it.productSnapshot?.title}</h4>
                                  <p className="text-[11px] text-slate-500">
                                    Qty: {it.quantity} • {it.variantSnapshot?.name || 'Standard'}
                                  </p>
                                </div>
                              </div>

                              <span className="font-mono font-bold text-slate-900">
                                ${(it.unitPrice * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Total Footer */}
                        <div className="pt-3 border-t border-[#EFE8E2] flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Shipping to: <strong className="text-slate-800">{order.shippingAddress?.city}, {order.shippingAddress?.state}</strong>
                          </span>
                          <span className="font-bold text-slate-900">
                            Total: <strong className="font-mono text-sm font-black">${(order.pricing?.grandTotal || 0).toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
                  <h3 className="text-base font-serif font-bold text-slate-900">Saved Addresses</h3>
                  <button
                    type="button"
                    onClick={() => showToast('Address form ready', 'info')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-rose-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EFE8E2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Aanya Kapoor (Default)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Villa 14, Palm Meadows, Indiranagar, 100 Feet Road, Near Metro Station
                    <br />
                    Bengaluru, Karnataka - 560038
                  </p>
                  <p className="text-xs text-slate-500 font-mono">Phone: +91 9876543210</p>
                </div>
              </div>
            )}

            {/* TAB 3: PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-6 shadow-xs">
                <h3 className="text-base font-serif font-bold text-slate-900 pb-3 border-b border-[#EFE8E2]">
                  Personal Profile &amp; Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Aanya Kapoor'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'aanya.kapoor@example.com'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Profile details updated successfully!', 'success')}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ORDER DETAILS MODAL WITH LIVE TIMELINE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#FFFDFC] text-slate-900 rounded-3xl border border-[#EFE8E2] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#FAF7F5] border-b border-[#EFE8E2] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span>Order Details</span>
                  <span className="font-mono text-rose-600">({selectedOrder.orderNumber})</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Live Tracking Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-600" />
                  <span>Shipment &amp; Delivery Progress</span>
                </h4>

                <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] space-y-4">
                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Order Confirmed &amp; Verified</strong>
                      <span className="text-slate-500 text-[11px]">Payment received via {selectedOrder.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">In Transit - BlueDart Air Express</strong>
                      <span className="text-slate-500 text-[11px]">Tracking ID: BLUEDART-847291-BLR</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs opacity-60">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Out for Delivery</strong>
                      <span className="text-slate-500 text-[11px]">Estimated by tomorrow afternoon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="text-xs space-y-1 p-4 rounded-xl bg-[#FAF7F5] border border-[#EFE8E2]">
                <strong className="text-slate-900 font-bold block">Delivery Address:</strong>
                <p className="text-slate-600 leading-relaxed">
                  {selectedOrder.shippingAddress?.fullName}
                  <br />
                  {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}
                  <br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Items Purchased:</strong>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-2 border-b border-[#EFE8E2]">
                    <div>
                      <span className="font-bold text-slate-900">{it.productSnapshot?.title}</span>
                      <span className="text-slate-500 text-[11px] block">Qty: {it.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ${(it.unitPrice * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-rose-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Account...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
