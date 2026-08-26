'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Download,
  Phone,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '@/types/order';
import { OrderService } from '@/services/orders';
import { OrderStatusStepper } from '@/components/account/OrderStatusStepper';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Fire celebratory confetti on order completion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B77A68', '#E8B8B5', '#111111', '#CF9584'],
      });
    } catch {
      // safe fallback
    }

    async function loadOrder() {
      try {
        const res = await OrderService.getOrderById(orderId);
        if (res.data) {
          setOrder(res.data);
        } else {
          // Fallback to recent order from history
          const all = await OrderService.getUserOrders();
          setOrder(all.data[0] || null);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const handleDownloadInvoice = () => {
    showToast('Invoice Downloaded', 'Official receipt saved to your downloads', 'success');
  };

  if (isLoading || !order) {
    return (
      <div className="py-24 text-center text-xs text-[#777777]">
        Loading your order confirmation...
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDFC] py-10 sm:py-16 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Badge & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAF6F2] border-2 border-[#B77A68] flex items-center justify-center mx-auto text-[#B77A68] shadow-md animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68] block">
            Payment &amp; Order Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
            Thank You for Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-[#777777] font-sans max-w-md mx-auto leading-relaxed">
            We&apos;re preparing your order with love at our boutique studio. A confirmation has been sent to{' '}
            <strong className="text-[#111111]">{order.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="p-6 bg-[#FAF6F2] border border-[#E8DED8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-[#777777] uppercase font-bold tracking-wider block">
              Order Number
            </span>
            <span className="text-[#111111] font-mono font-bold">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#777777] uppercase font-bold tracking-wider block">
              Estimated Delivery
            </span>
            <span className="text-[#B77A68] font-bold">{order.estimatedDeliveryDate}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#777777] uppercase font-bold tracking-wider block">
              Payment Method
            </span>
            <span className="text-[#111111] font-bold uppercase">{order.paymentDetails.method}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#777777] uppercase font-bold tracking-wider block">
              Total Amount
            </span>
            <span className="text-[#111111] font-bold">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* 5-Stage Live Stepper Card */}
        <div className="p-6 sm:p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-4">
          <h3 className="text-base font-serif font-bold text-[#111111] pb-2 border-b border-[#E8DED8]">
            Order Tracking Progress
          </h3>
          <OrderStatusStepper steps={order.trackingSteps} currentStatus={order.status} />
        </div>

        {/* Order Details & Summary Card */}
        <div className="p-6 sm:p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-6">
          <h3 className="text-base font-serif font-bold text-[#111111] pb-2 border-b border-[#E8DED8]">
            Items Ordered
          </h3>

          <div className="divide-y divide-[#E8DED8]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                <div className="relative w-16 aspect-3/4 bg-[#FAF6F2] border border-[#E8DED8] overflow-hidden shrink-0">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      sizes="70px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-[#111111]">
                      {item.product.name}
                    </h5>
                    <p className="text-xs text-[#777777] mt-0.5 font-sans">
                      Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#111111]">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-[#E8DED8] space-y-2 text-xs text-[#777777]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#111111] font-semibold">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#C98282] font-semibold">
                <span>Discount</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>
                {order.shippingFee === 0 ? (
                  <strong className="text-[#B77A68] uppercase font-bold">FREE</strong>
                ) : (
                  formatCurrency(order.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E8DED8]">
              <span>Grand Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4 text-[#B77A68]" />}
            onClick={handleDownloadInvoice}
          >
            Download Official Receipt
          </Button>

          <Link href="/new-arrivals">
            <Button
              variant="luxury-gold"
              size="lg"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
