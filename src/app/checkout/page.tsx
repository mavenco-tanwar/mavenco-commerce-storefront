'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ContactStep, ContactData } from '@/components/checkout/ContactStep';
import { AddressStep } from '@/components/checkout/AddressStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { OrderSummarySidebar } from '@/components/checkout/OrderSummarySidebar';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ShippingAddress, PaymentMethod } from '@/types/order';
import { OrderService } from '@/services/orders';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';

type CheckoutStep = 'contact' | 'address' | 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [completedSteps, setCompletedSteps] = useState<Record<CheckoutStep, boolean>>({
    contact: false,
    address: false,
    shipping: false,
    payment: false,
  });

  // Contact State
  const [contactData, setContactData] = useState<ContactData>({
    email: user?.email || 'aanya.kapoor@example.com',
    phone: user?.phone?.replace(/[^0-9]/g, '') || '9876543210',
  });

  // Address State
  const defaultAddr = user?.savedAddresses?.find((a) => a.isDefault) || user?.savedAddresses?.[0];
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: defaultAddr?.fullName || user?.name || 'Aanya Kapoor',
    email: contactData.email,
    phone: contactData.phone,
    addressLine1: defaultAddr?.addressLine1 || 'Villa 14, Palm Meadows, Indiranagar',
    addressLine2: defaultAddr?.addressLine2 || '100 Feet Road',
    landmark: defaultAddr?.landmark || 'Near Metro Station',
    city: defaultAddr?.city || 'Bengaluru',
    state: defaultAddr?.state || 'Karnataka',
    pincode: defaultAddr?.pincode || '560038',
  });

  // Shipping Speed
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<string>('Google Pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically advance contact if already prefilled
  useEffect(() => {
    if (contactData.email && contactData.phone.length >= 10 && !completedSteps.contact) {
      setCompletedSteps((prev) => ({ ...prev, contact: true }));
    }
  }, [contactData, completedSteps.contact]);

  const handleContactNext = () => {
    setCompletedSteps((prev) => ({ ...prev, contact: true }));
    setCurrentStep('address');
  };

  const handleAddressNext = () => {
    setCompletedSteps((prev) => ({ ...prev, address: true }));
    setCurrentStep('shipping');
  };

  const handleShippingNext = () => {
    setCompletedSteps((prev) => ({ ...prev, shipping: true }));
    setCurrentStep('payment');
  };

  const handlePaymentChange = (method: PaymentMethod, extra?: { upiApp?: string }) => {
    setPaymentMethod(method);
    if (extra?.upiApp) setUpiApp(extra.upiApp);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const extraShippingFee = shippingSpeed === 'express' ? 99 : summary.shippingFee;
      const finalGrandTotal = summary.subtotal - summary.discountTotal + extraShippingFee;

      const res = await OrderService.createOrder({
        items,
        shippingAddress,
        paymentMethod,
        upiApp: paymentMethod === 'upi' ? upiApp : undefined,
        subtotal: summary.subtotal,
        discount: summary.discountTotal,
        shippingFee: extraShippingFee,
        total: finalGrandTotal,
      });

      clearCart();
      showToast('Order Placed Successfully!', `Order ID: ${res.data.orderNumber}`, 'success');
      router.push(`/order-success/${res.data.id}`);
    } catch (e) {
      console.error('Order creation error', e);
      showToast('Order Failed', 'Please try again', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your Bag is Empty"
          description="You don't have any items to checkout. Discover our boutique fashion catalog."
          actionText="Shop New Arrivals"
          actionHref="/new-arrivals"
        />
      </div>
    );
  }

  const stepsList: { id: CheckoutStep; title: string; summary?: string }[] = [
    {
      id: 'contact',
      title: '1. Contact Details',
      summary: completedSteps.contact ? `${contactData.email} • +91 ${contactData.phone}` : undefined,
    },
    {
      id: 'address',
      title: '2. Delivery Address',
      summary: completedSteps.address
        ? `${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.city} - ${shippingAddress.pincode}`
        : undefined,
    },
    {
      id: 'shipping',
      title: '3. Delivery Speed',
      summary: completedSteps.shipping
        ? shippingSpeed === 'express'
          ? 'Express Priority Air (₹99)'
          : 'Standard Delivery (FREE)'
        : undefined,
    },
    {
      id: 'payment',
      title: '4. Payment Method',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFC] select-none">
      {/* Distraction-Free Header Bar */}
      <div className="border-b border-[#E8DED8] bg-[#FAF6F2] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <BrandLogo size="sm" showTagline={false} />

          <div className="flex items-center gap-2 text-xs font-semibold text-[#777777]">
            <Lock className="w-4 h-4 text-[#B77A68]" />
            <span className="hidden sm:inline">256-Bit Encrypted Secure Checkout</span>
            <span className="sm:hidden">Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 4-Step Checkout Accordion (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {stepsList.map((step) => {
              const isActive = currentStep === step.id;
              const isDone = completedSteps[step.id];

              return (
                <div
                  key={step.id}
                  className={`bg-[#FFFDFC] border transition-all ${
                    isActive
                      ? 'border-[#B77A68] luxury-card-shadow'
                      : 'border-[#E8DED8]'
                  }`}
                >
                  {/* Step Header */}
                  <div
                    onClick={() => {
                      if (isDone || isActive) setCurrentStep(step.id);
                    }}
                    className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer ${
                      isActive ? 'bg-[#FAF6F2] border-b border-[#E8DED8]' : 'bg-[#FFFDFC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone && !isActive
                            ? 'bg-[#B77A68] text-white'
                            : isActive
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#E8DED8] text-[#777777]'
                        }`}
                      >
                        {isDone && !isActive ? <CheckCircle2 className="w-4 h-4" /> : step.id === 'contact' ? '1' : step.id === 'address' ? '2' : step.id === 'shipping' ? '3' : '4'}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                          {step.title}
                        </h4>
                        {!isActive && step.summary && (
                          <p className="text-[11px] text-[#777777] font-sans truncate max-w-sm mt-0.5">
                            {step.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isActive && isDone && (
                      <button
                        type="button"
                        className="text-xs font-bold uppercase tracking-wider text-[#B77A68] hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* Step Body Content */}
                  {isActive && (
                    <div className="p-4 sm:p-6 animate-in fade-in duration-200">
                      {step.id === 'contact' && (
                        <ContactStep
                          data={contactData}
                          onChange={setContactData}
                          onNext={handleContactNext}
                          isCompleted={completedSteps.contact}
                        />
                      )}

                      {step.id === 'address' && (
                        <AddressStep
                          address={shippingAddress}
                          onChange={setShippingAddress}
                          onNext={handleAddressNext}
                          onBack={() => setCurrentStep('contact')}
                        />
                      )}

                      {step.id === 'shipping' && (
                        <ShippingStep
                          selectedSpeed={shippingSpeed}
                          onChange={setShippingSpeed}
                          onNext={handleShippingNext}
                          onBack={() => setCurrentStep('address')}
                          isFreeShippingEligible={summary.shippingFee === 0}
                        />
                      )}

                      {step.id === 'payment' && (
                        <PaymentStep
                          method={paymentMethod}
                          onChange={handlePaymentChange}
                          onSubmitOrder={handlePlaceOrder}
                          onBack={() => setCurrentStep('shipping')}
                          isSubmitting={isSubmitting}
                          grandTotal={
                            summary.subtotal -
                            summary.discountTotal +
                            (shippingSpeed === 'express' ? 99 : summary.shippingFee)
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <OrderSummarySidebar items={items} summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
