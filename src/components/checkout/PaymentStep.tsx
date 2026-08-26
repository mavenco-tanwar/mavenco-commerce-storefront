'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Lock,
} from 'lucide-react';
import { PaymentMethod } from '@/types/order';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export interface PaymentStepProps {
  method: PaymentMethod;
  onChange: (method: PaymentMethod, extra?: { upiApp?: string }) => void;
  onSubmitOrder: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  grandTotal: number;
}

export function PaymentStep({
  method,
  onChange,
  onSubmitOrder,
  onBack,
  isSubmitting,
  grandTotal,
}: PaymentStepProps) {
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [showQr, setShowQr] = useState(false);

  // Card mock state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Net banking mock
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const upiApps = [
    { name: 'Google Pay', icon: '⚡' },
    { name: 'PhonePe', icon: '🟣' },
    { name: 'Paytm UPI', icon: '🔵' },
    { name: 'BHIM UPI', icon: '🇮🇳' },
  ];

  const banks = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India (SBI)',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Payment Options Accordion / Radio */}
      <div className="space-y-3">
        {/* 1. UPI / QR */}
        <div
          className={`border transition-all ${
            method === 'upi'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC]'
          }`}
        >
          <label
            onClick={() => onChange('upi', { upiApp: selectedUpiApp })}
            className="flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={method === 'upi'}
                onChange={() => onChange('upi', { upiApp: selectedUpiApp })}
                className="text-[#B77A68] focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#B77A68]" />
                  UPI (GPay / PhonePe / Paytm / QR)
                </span>
                <span className="text-[11px] text-[#777777] block mt-0.5">
                  Instant, zero-fee payment with UPI PIN
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold bg-[#F8F1EA] px-2 py-1 text-[#B77A68]">
              Most Popular
            </span>
          </label>

          {method === 'upi' && (
            <div className="p-4 pt-0 border-t border-[#E8DED8]/60 space-y-4 animate-in fade-in duration-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  className={`text-xs px-3 py-1.5 border font-semibold ${
                    !showQr
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#777777] border-[#E8DED8]'
                  }`}
                >
                  Pay via UPI App / VPA
                </button>
                <button
                  type="button"
                  onClick={() => setShowQr(true)}
                  className={`text-xs px-3 py-1.5 border font-semibold flex items-center gap-1 ${
                    showQr
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#777777] border-[#E8DED8]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Scan QR Code
                </button>
              </div>

              {!showQr ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {upiApps.map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp(app.name);
                          onChange('upi', { upiApp: app.name });
                        }}
                        className={`p-2.5 border text-xs font-semibold text-center transition-all ${
                          selectedUpiApp === app.name
                            ? 'border-[#111111] bg-[#FFFDFC] shadow-xs'
                            : 'border-[#E8DED8] bg-[#F8F1EA] text-[#777777]'
                        }`}
                      >
                        <span className="text-base mr-1.5">{app.icon}</span>
                        {app.name}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-bold uppercase text-[#777777] mb-1">
                      Or enter your UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis or yourname@ibl"
                        className="flex-1 px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-[#111111] text-white text-xs font-bold uppercase"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-[#FFFDFC] border border-[#E8DED8] text-center space-y-2">
                  <div className="w-36 h-36 bg-[#F8F1EA] border-2 border-dashed border-[#B77A68] flex flex-col items-center justify-center text-[#B77A68]">
                    <QrCode className="w-20 h-20" />
                    <span className="text-[10px] font-bold mt-1">Scan with any UPI App</span>
                  </div>
                  <p className="text-xs text-[#777777]">
                    Scan and pay <strong>{formatCurrency(grandTotal)}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Cards */}
        <div
          className={`border transition-all ${
            method === 'card'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC]'
          }`}
        >
          <label
            onClick={() => onChange('card')}
            className="flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={method === 'card'}
                onChange={() => onChange('card')}
                className="text-[#B77A68] focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#B77A68]" />
                  Credit / Debit Card
                </span>
                <span className="text-[11px] text-[#777777] block mt-0.5">
                  Visa, MasterCard, RuPay, Maestro &amp; Amex
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#777777]">
              <Lock className="w-3.5 h-3.5 text-[#B77A68]" />
              <span>256-bit SSL</span>
            </div>
          </label>

          {method === 'card' && (
            <div className="p-4 pt-0 border-t border-[#E8DED8]/60 space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#777777] mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] font-mono focus:outline-none focus:border-[#B77A68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#777777] mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] font-mono focus:outline-none focus:border-[#B77A68]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#777777] mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] font-mono focus:outline-none focus:border-[#B77A68]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Net Banking */}
        <div
          className={`border transition-all ${
            method === 'netbanking'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC]'
          }`}
        >
          <label
            onClick={() => onChange('netbanking')}
            className="flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={method === 'netbanking'}
                onChange={() => onChange('netbanking')}
                className="text-[#B77A68] focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#B77A68]" />
                  Net Banking
                </span>
                <span className="text-[11px] text-[#777777] block mt-0.5">
                  All major Indian public &amp; private banks
                </span>
              </div>
            </div>
          </label>

          {method === 'netbanking' && (
            <div className="p-4 pt-0 border-t border-[#E8DED8]/60 space-y-2 animate-in fade-in duration-200">
              <label className="block text-[11px] font-bold uppercase text-[#777777]">
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              >
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 4. Cash on Delivery */}
        <div
          className={`border transition-all ${
            method === 'cod'
              ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
              : 'border-[#E8DED8] bg-[#FFFDFC]'
          }`}
        >
          <label
            onClick={() => onChange('cod')}
            className="flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={method === 'cod'}
                onChange={() => onChange('cod')}
                className="text-[#B77A68] focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-[#B77A68]" />
                  Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-[#777777] block mt-0.5">
                  Pay with cash / QR upon doorstep arrival
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Place Order CTA */}
      <div className="pt-4 flex items-center justify-between border-t border-[#E8DED8]">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onBack}
        >
          &larr; Back
        </Button>

        <Button
          type="button"
          variant="luxury-gold"
          size="lg"
          isLoading={isSubmitting}
          onClick={onSubmitOrder}
          className="min-w-[200px]"
        >
          Place Order ({formatCurrency(grandTotal)})
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#777777]">
        <ShieldCheck className="w-4 h-4 text-[#B77A68]" />
        <span>Your transaction is encrypted &amp; secured with bank-grade protocol</span>
      </div>
    </div>
  );
}
