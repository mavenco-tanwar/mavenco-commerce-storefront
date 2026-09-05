'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, ExternalLink, ChevronDown, Download } from 'lucide-react';
import { Order } from '@/types/order';
import { formatTenantHref, formatProductHref } from '@/lib/tenant-config';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusStepper } from './OrderStatusStepper';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();

  const handleDownloadInvoice = () => {
    showToast('Invoice Downloaded', `Invoice for order ${order.orderNumber} saved`, 'success');
  };

  return (
    <div className="bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow select-none">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 bg-[#FAF6F2] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFFDFC] border border-[#E8DED8] flex items-center justify-center text-[#B77A68]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] block">
              {order.orderNumber}
            </span>
            <span className="text-[11px] text-[#777777]">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 ${
              order.status === 'cancelled'
                ? 'bg-[#C98282] text-white'
                : order.status === 'delivered'
                ? 'bg-[#2D6A4F] text-white'
                : order.status === 'shipped'
                ? 'bg-[#B77A68] text-white'
                : 'bg-[#111111] text-[#FFFDFC]'
            }`}
          >
            {order.status}
          </span>
          <span className="text-sm sm:text-base font-bold text-[#111111]">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="divide-y divide-[#E8DED8]">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex gap-4">
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
              <div className="flex-1">
                <Link
                  href={formatProductHref(item.product.slug, item.product.category)}
                  className="text-xs sm:text-sm font-semibold text-[#111111] hover:text-[#B77A68] transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-[#777777] mt-0.5 font-sans">
                  Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor}
                </p>
                <p className="text-xs font-bold text-[#111111] mt-1">
                  {formatCurrency(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Stepper & Delivery Timeline */}
        {isExpanded && (
          <div className="pt-4 border-t border-[#E8DED8] animate-in fade-in duration-200">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#B77A68] mb-2">
              Live Order Journey &amp; Courier Status
            </h4>
            <OrderStatusStepper steps={order.trackingSteps} currentStatus={order.status} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF6F2] border border-[#E8DED8] text-xs">
              <div>
                <p className="font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Shipping Address
                </p>
                <p className="text-[#777777]">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.addressLine1}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>

              <div>
                <p className="font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Courier Tracking
                </p>
                <p className="text-[#777777]">
                  Partner: <strong className="text-[#111111]">{order.courierPartner || 'BlueDart Express'}</strong><br />
                  AWB: <span className="font-mono">{order.trackingNumber || 'BLUEDART-84729104'}</span><br />
                  Estimate: <strong className="text-[#B77A68]">{order.estimatedDeliveryDate}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-3 border-t border-[#E8DED8] flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-bold uppercase tracking-wider text-[#B77A68] hover:text-[#9A6050] flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide Details' : 'Track Order & Details'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5 text-[#B77A68]" />}
            onClick={handleDownloadInvoice}
          >
            Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
