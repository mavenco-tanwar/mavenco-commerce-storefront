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
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Crown,
  Gift,
  CreditCard,
  Mail,
  Sparkles,
  Star,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';
import { ReturnRequest } from '@/types/returns-commerce.types';

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
  const initialTab = (searchParams.get('tab') as 'orders' | 'returns' | 'addresses' | 'profile' | 'loyalty' | 'giftcards' | 'reviews' | 'inbox' | 'preferences') || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'addresses' | 'profile' | 'loyalty' | 'giftcards' | 'reviews' | 'inbox' | 'preferences'>(initialTab);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<OrderRecord | null>(null);

  // Loyalty State
  const [pointsBalance, setPointsBalance] = useState(1450);
  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);

  // Gift Card State
  const [giftCardCodeInput, setGiftCardCodeInput] = useState('');
  const [checkedBalance, setCheckedBalance] = useState<number | null>(null);

  // Marketing Preferences State
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [smsMarketing, setSmsMarketing] = useState(true);
  const [whatsappMarketing, setWhatsappMarketing] = useState(false);

  // Return Request Modal State
  const [returnOrder, setReturnOrder] = useState<OrderRecord | null>(null);
  const [returnType, setReturnType] = useState<'refund' | 'exchange' | 'store_credit'>('exchange');
  const [returnReason, setReturnReason] = useState('wrong_size');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();
  const { addItem } = useCart();

  const loadData = async () => {
    setIsLoadingOrders(true);
    try {
      const email = user?.email || 'aanya.kapoor@example.com';
      // Load orders
      const res = await fetch(`/api/v1/customer/orders?tenant=lumina&email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json.success && json.data) setOrders(json.data);

      // Load returns
      const retRes = await fetch(`/api/v1/customer/returns?tenant=lumina&email=${encodeURIComponent(email)}`);
      const retJson = await retRes.json();
      if (retJson.success && retJson.data) setReturns(retJson.data);
    } catch (err) {
      console.error('Failed to load customer data:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadData();
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

  // Submit Return Request
  const handleSubmitReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrder) return;

    setIsSubmittingReturn(true);
    try {
      const it = returnOrder.items[0];
      const res = await fetch('/api/v1/customer/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 'lumina',
          orderNumber: returnOrder.orderNumber,
          orderId: returnOrder.id,
          customerName: user?.name || returnOrder.shippingAddress?.fullName || 'Customer',
          customerEmail: user?.email || returnOrder.email,
          customerPhone: returnOrder.phone,
          type: returnType,
          reason: returnReason === 'wrong_size' ? `Size Exchange to ${exchangeSize}` : returnReason,
          customerNote: customerNotes,
          items: [
            {
              orderItemId: it.id,
              productId: it.productId,
              variantId: `${it.productId}_${exchangeSize}`,
              sku: `${it.productSnapshot?.sku || 'SKU'}-${exchangeSize}`,
              title: it.productSnapshot?.title || 'Luxury Garment',
              image: it.productSnapshot?.image,
              unitPrice: it.unitPrice,
              quantityOrdered: it.quantity,
              quantityRequested: 1,
              reason: returnReason,
              customerNotes,
              refundAmount: returnType === 'refund' ? it.unitPrice : 0,
              exchangeVariantTitle: returnType === 'exchange' ? `Rose / Size ${exchangeSize}` : undefined,
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Return request registered!', 'success');
        setReturnOrder(null);
        setActiveTab('returns');
        loadData();
      } else {
        showToast(json.error || 'Failed to submit return', 'error');
      }
    } catch {
      showToast('Error submitting request', 'error');
    } finally {
      setIsSubmittingReturn(false);
    }
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
              onClick={() => setActiveTab('returns')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'returns'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>Returns &amp; Exchanges ({returns.length})</span>
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

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'loyalty'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>VIP Loyalty &amp; Rewards</span>
            </button>

            <button
              onClick={() => setActiveTab('giftcards')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'giftcards'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Gift className="w-4 h-4 text-rose-500" />
              <span>Gift Cards &amp; Credit</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>My Reviews &amp; Q&amp;A</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Bell className="w-4 h-4 text-rose-500" />
              <span>Inbox &amp; Alerts (2)</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left rounded-xl transition-all cursor-pointer ${
                activeTab === 'preferences'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-500" />
              <span>Marketing &amp; Privacy</span>
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

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setTrackingOrder(order)}
                              className="px-3.5 py-2 rounded-xl bg-slate-950 text-white hover:bg-indigo-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-rose-400" />
                              <span>Live Courier Tracking</span>
                            </button>

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
                              onClick={() => setReturnOrder(order)}
                              className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                              <span>Return / Exchange</span>
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

            {/* TAB 2: RETURNS & EXCHANGES */}
            {activeTab === 'returns' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
                  <h2 className="text-xl font-serif font-bold text-slate-900">
                    Returns &amp; Exchange Requests
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    {returns.length} active requests
                  </span>
                </div>

                {returns.length === 0 ? (
                  <div className="p-8 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl text-center space-y-3">
                    <RotateCcw className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">No Return or Exchange Requests</h3>
                    <p className="text-xs text-slate-500">Need to exchange a garment for another size? Click &quot;Return / Exchange&quot; on any order.</p>
                  </div>
                ) : (
                  returns.map((ret) => (
                    <div
                      key={ret.id}
                      className="p-5 sm:p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8E2]">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-black text-sm text-slate-900">{ret.returnNumber}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              {ret.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {ret.type.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">Original Order: {ret.orderNumber}</span>
                        </div>
                      </div>

                      {/* Return Items */}
                      <div className="space-y-2">
                        {ret.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div>
                              <strong className="block text-slate-900">{it.title}</strong>
                              <span className="text-[11px] text-slate-500">
                                Reason: {it.reason} {it.exchangeVariantTitle && `• Exchange for: ${it.exchangeVariantTitle}`}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-slate-900">
                              {ret.type === 'refund' ? `$${it.unitPrice}` : 'Exchange'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Pickup Info */}
                      {ret.pickupTrackingNumber && (
                        <div className="p-3.5 rounded-xl bg-white border border-[#EFE8E2] text-xs space-y-1">
                          <strong className="text-slate-900 font-bold block">📦 Reverse Pickup Scheduled:</strong>
                          <p className="text-slate-600">
                            Carrier: <strong>{ret.pickupCarrier}</strong> • Tracking: <strong className="font-mono text-rose-600">{ret.pickupTrackingNumber}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500">{ret.pickupScheduledDate}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
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

            {/* TAB 4: PROFILE */}
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

            {/* TAB: VIP LOYALTY CLUB & REWARDS */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                {/* Hero Loyalty Card */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl border border-rose-900/30 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                          Gold Couture VIP Tier
                        </span>
                      </div>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/10 text-rose-200 border border-white/20">
                        1.5x Points Multiplier Active
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <span className="text-xs text-slate-400 block">Available Balance</span>
                        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
                          <span>{pointsBalance.toLocaleString()}</span>
                          <span className="text-xs font-normal text-rose-300 uppercase tracking-widest">Couture Coins</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-300">
                        Worth <strong className="text-emerald-400 font-mono text-sm">${(pointsBalance / 20).toFixed(2)}</strong> at checkout
                      </div>
                    </div>

                    {/* Progress to Platinum */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                        <span>Progress to Platinum Haute Royale</span>
                        <span>$6,420 / $10,000 (64%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redeemable Rewards Catalog */}
                <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
                    <div>
                      <h3 className="text-base font-serif font-bold text-slate-900">Exchange Coins for Vouchers</h3>
                      <p className="text-xs text-slate-500">Redeem points for instant checkout coupon discounts.</p>
                    </div>
                  </div>

                  {redeemedCoupon && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                      <div>
                        <strong className="block text-emerald-800">Reward Voucher Claimed!</strong>
                        <span>Your promo code: <strong className="font-mono text-sm">{redeemedCoupon}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(redeemedCoupon);
                          showToast('Voucher code copied to clipboard!', 'info');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                      >
                        Copy Code
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <strong className="block text-slate-900 font-bold">$25 Boutique Voucher</strong>
                        <span className="text-[11px] text-slate-500">Cost: 500 Couture Coins</span>
                      </div>
                      <button
                        type="button"
                        disabled={pointsBalance < 500}
                        onClick={async () => {
                          const code = `REW25-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                          setPointsBalance(pointsBalance - 500);
                          setRedeemedCoupon(code);
                          showToast('Redeemed 500 points for $25 voucher!', 'success');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-rose-600 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Redeem (500 pts)
                      </button>
                    </div>

                    <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <strong className="block text-slate-900 font-bold">$50 Luxury Voucher</strong>
                        <span className="text-[11px] text-slate-500">Cost: 1,000 Couture Coins</span>
                      </div>
                      <button
                        type="button"
                        disabled={pointsBalance < 1000}
                        onClick={async () => {
                          const code = `REW50-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                          setPointsBalance(pointsBalance - 1000);
                          setRedeemedCoupon(code);
                          showToast('Redeemed 1000 points for $50 voucher!', 'success');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-rose-600 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Redeem (1,000 pts)
                      </button>
                    </div>

                    <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <strong className="block text-slate-900 font-bold">Free Express Courier</strong>
                        <span className="text-[11px] text-slate-500">Cost: 300 Couture Coins</span>
                      </div>
                      <button
                        type="button"
                        disabled={pointsBalance < 300}
                        onClick={async () => {
                          const code = `FREESHIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                          setPointsBalance(pointsBalance - 300);
                          setRedeemedCoupon(code);
                          showToast('Redeemed 300 points for Free Shipping voucher!', 'success');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-rose-600 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Redeem (300 pts)
                      </button>
                    </div>
                  </div>

                  {/* Points Ledger & Activity History */}
                  <div className="pt-4 border-t border-[#EFE8E2] space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Points Ledger Activity</h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block font-bold">Gold VIP 1.5x Order Reward</strong>
                          <span className="text-slate-500 text-[10px]">Order #LUM-100234 • 10 days ago</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600">+750 pts</span>
                      </div>

                      <div className="p-3 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block font-bold">Verified Photo Review Reward</strong>
                          <span className="text-slate-500 text-[10px]">Pure Mulberry Silk Banarasi Saree • 4 days ago</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600">+100 pts</span>
                      </div>

                      <div className="p-3 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block font-bold">VIP Referral Qualification</strong>
                          <span className="text-slate-500 text-[10px]">Invited Priya Sharma • 1 day ago</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600">+600 pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Refer a Friend & Viral Growth */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <strong className="text-slate-900 text-xs font-bold block">✨ Refer Friends &amp; Earn 600 Couture Coins</strong>
                      <p className="text-[11px] text-slate-600">
                        Give your friends $25 off their first order and receive 600 Couture Coins when they complete their purchase.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText('AANYA-VIP50');
                        showToast('Referral code AANYA-VIP50 copied to clipboard!', 'success');
                      }}
                      className="px-4 py-2 bg-slate-950 text-white rounded-xl font-bold font-mono text-xs hover:bg-rose-600 transition-colors shrink-0 cursor-pointer"
                    >
                      Copy: AANYA-VIP50
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GIFT CARDS & STORE CREDIT */}
            {activeTab === 'giftcards' && (
              <div className="space-y-6">
                {/* Store Credit Balance Banner */}
                <div className="p-6 bg-white border border-[#EFE8E2] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available Store Credit</span>
                    <div className="text-3xl font-extrabold font-mono text-slate-900">$200.00</div>
                    <p className="text-xs text-slate-500">Automatically applied as tender discount at checkout.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                    ✓ Ready to Use
                  </span>
                </div>

                {/* My Active Gift Cards */}
                <div className="p-6 bg-gradient-to-r from-slate-950 to-slate-900 text-white rounded-2xl space-y-4 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-serif font-bold text-white">Active Digital Gift Cards</h3>
                      <p className="text-xs text-slate-400">Gift vouchers assigned to your customer profile.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                      1 Active Card
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">GC-9821-4402-9182</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">"Complimentary Haute Couture shopping voucher."</p>
                      <span className="text-[10px] text-slate-400 font-mono block">Expires: Dec 31, 2026</span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <div className="text-lg font-bold font-mono text-white">$500.00</div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('GC-9821-4402-9182');
                          showToast('Gift card code copied to clipboard!', 'success');
                        }}
                        className="px-3 py-1 bg-white text-slate-950 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                </div>

                {/* Available Digital Vouchers */}
                <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                  <div className="pb-3 border-b border-[#EFE8E2]">
                    <h3 className="text-base font-serif font-bold text-slate-900">Available Digital Vouchers</h3>
                    <p className="text-xs text-slate-500">Apply these voucher codes during checkout for instant reductions.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 font-mono font-bold text-sm block">WELCOME50</strong>
                        <span className="text-slate-500 text-[11px]">$50 off first order over $250</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('WELCOME50');
                          showToast('Voucher WELCOME50 copied!', 'success');
                        }}
                        className="px-3 py-1.5 bg-slate-950 text-white rounded-lg font-bold text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 font-mono font-bold text-sm block">VIPRUNWAY15</strong>
                        <span className="text-slate-500 text-[11px]">15% off bridal &amp; banquet items</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('VIPRUNWAY15');
                          showToast('Voucher VIPRUNWAY15 copied!', 'success');
                        }}
                        className="px-3 py-1.5 bg-slate-950 text-white rounded-lg font-bold text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gift Card Balance Checker */}
                <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                  <div className="pb-3 border-b border-[#EFE8E2]">
                    <h3 className="text-base font-serif font-bold text-slate-900">Check Gift Card Balance</h3>
                    <p className="text-xs text-slate-500">Enter your 16-character digital gift voucher code.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                    <input
                      type="text"
                      value={giftCardCodeInput}
                      onChange={(e) => setGiftCardCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. GIFT-9X28-74KL"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#EFE8E2] text-slate-900 font-mono text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!giftCardCodeInput) {
                          showToast('Please enter a gift card code', 'info');
                          return;
                        }
                        setCheckedBalance(500);
                        showToast(`Gift Card is ACTIVE with $500.00 balance!`, 'success');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Check Balance
                    </button>
                  </div>

                  {checkedBalance !== null && (
                    <div className="p-4 bg-white border border-emerald-300 rounded-xl text-xs space-y-1 font-mono">
                      <div className="text-slate-500">Gift Card: <strong>{giftCardCodeInput}</strong></div>
                      <div className="text-sm font-bold text-emerald-600">Remaining Balance: ${checkedBalance.toFixed(2)} USD</div>
                    </div>
                  )}
                </div>

                {/* Customer Store Credit Ledger */}
                <div className="p-6 bg-white border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                  <div className="pb-3 border-b border-[#EFE8E2]">
                    <h3 className="text-base font-serif font-bold text-slate-900">Wallet Transaction History</h3>
                    <p className="text-xs text-slate-500">Immutable record of refund credits, promotional grants, and order tender.</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 bg-[#FAF7F5] border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block font-bold">Instant Refund Credit</strong>
                        <span className="text-slate-500 text-[10px]">Return #RET-1002 • 5 days ago</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+$150.00 USD</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF7F5] border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block font-bold">Gold VIP Annual Couture Credit</strong>
                        <span className="text-slate-500 text-[10px]">VIP Tier Perk • 2 days ago</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+$50.00 USD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MY REVIEWS & Q&A */}
            {activeTab === 'reviews' && (
              <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-6 shadow-xs">
                <div className="pb-3 border-b border-[#EFE8E2]">
                  <h3 className="text-base font-serif font-bold text-slate-900">
                    My Product Reviews &amp; Questions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track the status of your submitted feedback, merchant responses, and community helpful votes.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-5 bg-white border border-[#EFE8E2] rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="block text-slate-900 text-sm font-bold">Pure Mulberry Silk Banarasi Saree</strong>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                            Verified Buyer
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-800 font-bold uppercase text-[10px]">
                        Published
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs">
                      "The gold zari weave is astonishingly supple and lightweight. Wore it to a high-society wedding and received non-stop compliments all evening."
                    </p>

                    <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EFE8E2] text-[11px] text-slate-600">
                      <strong className="text-slate-900 block font-bold mb-0.5">Official Response from Lumina Concierge:</strong>
                      Thank you immensely, Aanya! Our master weavers in Varanasi spend over 120 hours on each saree.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INBOX & REAL-TIME ALERTS */}
            {activeTab === 'inbox' && (
              <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900">
                      Notifications &amp; Atelier Communications
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time updates regarding order dispatches, concierge replies, and VIP perks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('All notifications marked as read!', 'success')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Mark All as Read
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Notification 1 */}
                  <div className="p-4 bg-white border-l-4 border-rose-600 rounded-r-xl border-y border-r border-[#EFE8E2] space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        🚚 Order LUM-100234 Shipped via BlueDart Express
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Your Pure Mulberry Silk Banarasi Saree has been dispatched from our Mumbai Atelier with tracking code <strong>BD-8839201</strong>.
                    </p>
                  </div>

                  {/* Notification 2 */}
                  <div className="p-4 bg-white border-l-4 border-amber-500 rounded-r-xl border-y border-r border-[#EFE8E2] space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        👑 You Achieved Gold Couture VIP Tier!
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">2 days ago</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Congratulations! You now earn 1.5x Couture Coins on all purchases and enjoy complimentary express courier shipping.
                    </p>
                  </div>

                  {/* Notification 3 */}
                  <div className="p-4 bg-white border-l-4 border-slate-300 rounded-r-xl border-y border-r border-[#EFE8E2] space-y-1 opacity-75">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-xs">
                        💵 Instant $150.00 Store Credit Issued
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">5 days ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Your store credit refund for return RET-1002 is now active in your wallet and ready to be used at checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COMMUNICATION PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="p-6 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl space-y-6 shadow-xs">
                <div className="pb-3 border-b border-[#EFE8E2]">
                  <h3 className="text-base font-serif font-bold text-slate-900">
                    Communication Preferences &amp; Marketing Consent
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Control how Lumina Haute Couture sends you bespoke collection drops, flash sales, and private invitations.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Email Preference */}
                  <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 text-xs font-bold">Email Newsletters &amp; Private Runway Drops</strong>
                      <span className="text-[11px] text-slate-500">Receive seasonal lookbooks, early access to festive sales, and personalized recommendations.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailMarketing(!emailMarketing)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        emailMarketing ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          emailMarketing ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Preference */}
                  <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 text-xs font-bold">SMS Flash Alerts &amp; Order Updates</strong>
                      <span className="text-[11px] text-slate-500">Instant SMS notifications for time-sensitive flash discount codes and dispatch notices.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSmsMarketing(!smsMarketing)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        smsMarketing ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          smsMarketing ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* WhatsApp Preference */}
                  <div className="p-4 bg-white border border-[#EFE8E2] rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 text-xs font-bold">WhatsApp Concierge Updates</strong>
                      <span className="text-[11px] text-slate-500">Direct styling advice, bespoke fitting assistance, and VIP priority concierge support.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWhatsappMarketing(!whatsappMarketing)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        whatsappMarketing ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          whatsappMarketing ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await fetch('/api/v1/customer/preferences', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            emailMarketing,
                            smsMarketing,
                            whatsappMarketing,
                          }),
                        });
                        showToast('Communication preferences updated!', 'success');
                      } catch {
                        showToast('Failed to save preferences', 'error');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REQUEST RETURN / EXCHANGE MODAL */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDFC] text-slate-900 rounded-3xl border border-[#EFE8E2] shadow-2xl p-6 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-900">Request Return or Exchange</h3>
                <p className="text-xs text-slate-500">Order: <strong className="font-mono text-slate-900">{returnOrder.orderNumber}</strong></p>
              </div>
              <button onClick={() => setReturnOrder(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturnRequest} className="space-y-4 text-xs">
              {/* Item selection snapshot */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#EFE8E2] flex items-center gap-3">
                <div className="w-12 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-300">
                  {returnOrder.items[0]?.productSnapshot?.image && (
                    <img
                      src={returnOrder.items[0].productSnapshot.image}
                      alt={returnOrder.items[0].productSnapshot.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <strong className="block text-slate-900">{returnOrder.items[0]?.productSnapshot?.title}</strong>
                  <span className="text-[11px] text-slate-500">
                    Ordered: Qty 1 • ${returnOrder.items[0]?.unitPrice}
                  </span>
                </div>
              </div>

              {/* Resolution Type */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Select Resolution</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnType('exchange')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      returnType === 'exchange'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Size Exchange
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnType('refund')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      returnType === 'refund'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Original Refund
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnType('store_credit')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      returnType === 'store_credit'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Store Credit
                  </button>
                </div>
              </div>

              {/* Exchange Size Selection */}
              {returnType === 'exchange' && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Exchange for Size</label>
                  <select
                    value={exchangeSize}
                    onChange={(e) => setExchangeSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="XS">Size XS (Bust 32&quot;)</option>
                    <option value="S">Size S (Bust 34&quot;)</option>
                    <option value="M">Size M (Bust 36&quot;)</option>
                    <option value="L">Size L (Bust 38&quot;)</option>
                    <option value="XL">Size XL (Bust 40&quot;)</option>
                  </select>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                >
                  <option value="wrong_size">Size does not fit comfortably</option>
                  <option value="color_mismatch">Color shade differs from website photo</option>
                  <option value="fabric_feel">Fabric drape / feel not as expected</option>
                  <option value="defective">Flaw / loose button / stitching issue</option>
                  <option value="changed_mind">Changed styling preference</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Additional Notes for Atelier Concierge</label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={2}
                  placeholder="Tell us more about the fit or reason..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-50"
                >
                  {isSubmittingReturn ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE COURIER TRACKING TIMELINE MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDFC] text-slate-900 rounded-3xl border border-[#EFE8E2] shadow-2xl p-6 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-rose-600" />
                  <span>Live Courier Tracking</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Order: <strong className="font-mono text-slate-900">{trackingOrder.orderNumber}</strong>
                </p>
              </div>
              <button onClick={() => setTrackingOrder(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Carrier: <strong className="text-white">BlueDart Express Air</strong></span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] uppercase">
                  In Transit
                </span>
              </div>
              <div className="text-sm font-bold font-mono text-amber-400">
                AWB / Tracking #: BD-8839201
              </div>
              <p className="text-[11px] text-slate-400">
                Expected Delivery: <strong>Tomorrow by 6:00 PM</strong> (Signature required)
              </p>
            </div>

            {/* Tracking Milestones */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Milestones &amp; Checkpoints</span>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] absolute -left-8 top-0 font-bold">
                    ✓
                  </div>
                  <strong className="block text-xs text-slate-900 font-bold">Label Created at Mumbai Master Atelier</strong>
                  <span className="text-[11px] text-slate-500">Mumbai Hub, Maharashtra • Yesterday, 10:15 AM</span>
                </div>

                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] absolute -left-8 top-0 font-bold">
                    ✓
                  </div>
                  <strong className="block text-xs text-slate-900 font-bold">Package Picked Up by BlueDart Air</strong>
                  <span className="text-[11px] text-slate-500">Mumbai Sorting Facility • Yesterday, 4:30 PM</span>
                </div>

                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] absolute -left-8 top-0 font-bold animate-pulse">
                    ✈
                  </div>
                  <strong className="block text-xs text-rose-600 font-bold">Departed Air Hub via Flight BD-991 (In Transit)</strong>
                  <span className="text-[11px] text-slate-500">Mumbai Airport (BOM) • Today, 6:00 AM</span>
                </div>

                <div className="relative opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] absolute -left-8 top-0 font-bold">
                    ○
                  </div>
                  <strong className="block text-xs text-slate-700 font-bold">Out for Delivery to Residence</strong>
                  <span className="text-[11px] text-slate-400">Destination Delivery Facility • Pending</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EFE8E2]">
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

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

                {/* Tax & GST Breakdown */}
                <div className="p-3.5 bg-[#FAF7F5] border border-[#EFE8E2] rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Taxable Subtotal:</span>
                    <span className="font-bold text-slate-700">${selectedOrder.totalAmount ? (selectedOrder.totalAmount * 0.82).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>CGST (9%) + SGST (9%):</span>
                    <span className="font-bold text-slate-700">${selectedOrder.totalAmount ? (selectedOrder.totalAmount * 0.18).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-[#EFE8E2] pt-1">
                    <span>Total Amount Paid (Tax Incl.):</span>
                    <span className="text-emerald-600">${selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
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
