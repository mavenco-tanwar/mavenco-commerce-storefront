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
  Printer,
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
          return;
        }

        // Fallback: Check local recent order if backend lookup is pending
        const localOrderStr = typeof window !== 'undefined' ? localStorage.getItem(`order_${orderId}`) : null;
        if (localOrderStr) {
          setOrder(JSON.parse(localOrderStr));
          return;
        }

        // Fallback to recent order from customer history
        const all = await OrderService.getUserOrders();
        if (all.data && all.data.length > 0) {
          setOrder(all.data[0]);
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
    if (!order) return;

    // Generate Printable Tax Invoice Window
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      showToast('Popup Blocked', 'Please allow popups to view and download your receipt', 'error');
      return;
    }

    const itemsHtml = order.items
      .map(
        (it) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #E8DED8; font-size: 13px;">
          <strong>${it.product.name}</strong><br/>
          <span style="color: #777; font-size: 11px;">Size: ${it.selectedSize} | Color: ${it.selectedColor}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E8DED8; text-align: center; font-size: 13px;">${it.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E8DED8; text-align: right; font-size: 13px;">₹${(it.unitPrice || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E8DED8; text-align: right; font-size: 13px; font-weight: bold;">₹${(it.totalPrice || 0).toLocaleString('en-IN')}</td>
      </tr>
    `
      )
      .join('');

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${order.orderNumber} | JQ Trends</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .logo span { color: #B77A68; }
          .tagline { font-size: 11px; color: #777; letter-spacing: 1px; }
          .meta-grid { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #FAF6F2; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #E8DED8; }
          .totals { width: 300px; margin-left: auto; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals-row.grand { font-size: 16px; font-weight: bold; border-top: 2px solid #111; padding-top: 10px; margin-top: 6px; }
          .footer-note { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #E8DED8; font-size: 11px; color: #777; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #111; color: #fff; border: none; font-weight: bold; cursor: pointer; border-radius: 4px;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo">JQ <span>TRENDS</span></div>
            <div class="tagline">STYLE THAT SPEAKS YOU</div>
            <div style="font-size: 11px; color: #666; margin-top: 8px;">
              100 Feet Road, Indiranagar<br/>
              Bengaluru, Karnataka - 560038<br/>
              GSTIN: 29AAAAA0000A1Z5 | care@jqtrends.com
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Official Tax Invoice</h2>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Invoice #:</strong> ${order.orderNumber}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Payment:</strong> ${order.paymentDetails?.method?.toUpperCase() || 'PREPAID'}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <strong style="text-transform: uppercase; font-size: 11px; color: #777;">Billed &amp; Shipped To:</strong><br/>
            <strong>${order.shippingAddress?.fullName || 'Valued Customer'}</strong><br/>
            ${order.shippingAddress?.addressLine1 || ''}<br/>
            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}<br/>
            Phone: ${order.shippingAddress?.phone || ''}<br/>
            Email: ${order.shippingAddress?.email || ''}
          </div>
          <div style="text-align: right;">
            <strong style="text-transform: uppercase; font-size: 11px; color: #777;">Fulfillment Details:</strong><br/>
            Status: <span style="color: #27ae60; font-weight: bold;">Confirmed / Packing</span><br/>
            Est. Delivery: ${order.estimatedDeliveryDate || '3-5 Business Days'}<br/>
            Courier: BlueDart / Delhivery Express
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>₹${(order.subtotal || order.total).toLocaleString('en-IN')}</span>
          </div>
          ${
            order.discount > 0
              ? `
          <div class="totals-row" style="color: #c0392b;">
            <span>Discount:</span>
            <span>- ₹${order.discount.toLocaleString('en-IN')}</span>
          </div>`
              : ''
          }
          <div class="totals-row">
            <span>Shipping:</span>
            <span>${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div class="totals-row grand">
            <span>Grand Total:</span>
            <span>₹${(order.total || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer-note">
          Thank you for choosing JQ Trends! For styling support or order inquiries, reach us at +91 98765 43210.<br/>
          This is a computer-generated tax invoice and requires no physical signature.
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    showToast('Receipt Opened', 'Your printable tax invoice has opened in a new tab', 'success');
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
            <strong className="text-[#111111]">{order.shippingAddress?.email || 'your email'}</strong>.
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
            <span className="text-[#B77A68] font-bold">{order.estimatedDeliveryDate || '3–5 Days'}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#777777] uppercase font-bold tracking-wider block">
              Payment Method
            </span>
            <span className="text-[#111111] font-bold uppercase">{order.paymentDetails?.method || 'Prepaid'}</span>
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
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                <div className="relative w-16 aspect-3/4 bg-[#FAF6F2] border border-[#E8DED8] overflow-hidden shrink-0">
                  {item.product?.images?.[0] && (
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
                      {item.product?.name}
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
              <span className="text-[#111111] font-semibold">{formatCurrency(order.subtotal || order.total)}</span>
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
            leftIcon={<Printer className="w-4 h-4 text-[#B77A68]" />}
            onClick={handleDownloadInvoice}
          >
            Download / Print Official Receipt
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
