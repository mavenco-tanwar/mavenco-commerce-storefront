'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, CheckCheck, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Send, Bell } from 'lucide-react';

export function WhatsAppCommerceSimulator() {
  const [activeScenario, setActiveScenario] = useState<'recovery' | 'order' | 'cod'>('recovery');

  const scenarios = {
    recovery: {
      title: 'Automated Cart Recovery',
      tag: '42% Higher Conversion vs. Email',
      desc: 'Triggers a personalized message 15 minutes after cart abandonment with a 1-click checkout discount link.',
      customerName: 'Pooja S.',
      items: 'Banarasi Silk Saree (Plum / Free Size)',
      amount: '₹2,999',
      messages: [
        {
          from: 'brand',
          time: '14:32',
          text: 'Hi Pooja! ✨ We noticed you left the gorgeous *Banarasi Silk Saree* in your bag.',
        },
        {
          from: 'brand',
          time: '14:32',
          text: 'Use code *SECRET10* for an extra 10% off + Free Express Shipping! 🛍️\n\nTap below to complete your order in 1 click:',
          cta: 'Complete Order (₹2,699)',
        },
        {
          from: 'customer',
          time: '14:35',
          text: 'Ordered! Thank you for the discount ❤️',
        },
      ],
    },
    order: {
      title: 'Instant Order Confirmation & Tracking',
      tag: 'Zero Post-Purchase Anxiety',
      desc: 'Real-time automated order receipts with live courier dispatch links and WhatsApp support bot.',
      customerName: 'Rahul M.',
      items: 'Lumina Travertine Table Lamp',
      amount: '₹4,499',
      messages: [
        {
          from: 'brand',
          time: '09:15',
          text: '🎉 Thank you for your order *#MVC-8921*, Rahul!\n\n*Item:* Lumina Travertine Table Lamp\n*Amount Paid:* ₹4,499 (UPI)\n*Estimated Delivery:* Thursday, Oct 24',
        },
        {
          from: 'brand',
          time: '09:16',
          text: '📦 Your package is being packed at our Mumbai studio. Track live progress below:',
          cta: 'Track Live Shipment →',
        },
      ],
    },
    cod: {
      title: 'COD Verification & RTO Prevention',
      tag: 'Reduces RTO by up to 35%',
      desc: 'Automated WhatsApp 1-tap OTP or confirmation button before dispatching cash-on-delivery shipments.',
      customerName: 'Sneha K.',
      items: 'Carbon Plate Runner Pro (Size UK 6)',
      amount: '₹3,299 (COD)',
      messages: [
        {
          from: 'brand',
          time: '18:40',
          text: 'Hello Sneha! 👋 We received your Cash on Delivery order for *Carbon Plate Runner Pro* (₹3,299).',
        },
        {
          from: 'brand',
          time: '18:40',
          text: 'Please confirm your shipping address to schedule instant dispatch:\n📍 *Plot 42, HSR Layout, Bengaluru*',
          cta: '✅ Confirm & Dispatch My Order',
        },
        {
          from: 'customer',
          time: '18:41',
          text: 'Confirmed! Address is correct.',
        },
      ],
    },
  };

  const active = scenarios[activeScenario];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Native WhatsApp Commerce Engine</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Automate D2C Sales &amp; Retain Customers
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Native integration with official WhatsApp Cloud API for cart recovery, dispatch alerts, and COD fraud verification.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {(['recovery', 'order', 'cod'] as const).map((key) => {
          const s = scenarios[key];
          const isSelected = activeScenario === key;
          return (
            <button
              key={key}
              onClick={() => setActiveScenario(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-lg'
                  : 'bg-[#161824] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Explanation Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#0D101A] p-6 rounded-2xl border border-slate-800">
          <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {active.tag}
          </div>
          <h4 className="text-xl font-extrabold text-white">{active.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>

          <div className="p-3 bg-[#141826] rounded-xl border border-slate-800/80 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Simulated Event Data</div>
            <div className="flex justify-between text-slate-300">
              <span>Customer:</span>
              <span className="font-bold text-white">{active.customerName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Item:</span>
              <span className="font-medium text-slate-200 truncate max-w-[180px]">{active.items}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Order Value:</span>
              <span className="font-bold text-emerald-400">{active.amount}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Meta Official Cloud API • 99.9% Delivery Ingress</span>
          </div>
        </div>

        {/* Right Phone Mockup (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-sm bg-[#111B21] border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative">
            {/* Phone Top Header */}
            <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between text-white border-b border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>Mavenco Store Concierge</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Official Verified Business</div>
                </div>
              </div>
              <Phone className="w-4 h-4 text-slate-400" />
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 min-h-[300px] bg-[#0B141A] text-xs">
              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-md bg-[#182229] text-[10px] text-slate-400 font-mono">
                  Today • End-to-End Encrypted
                </span>
              </div>

              {active.messages.map((msg, i) => {
                const isBrand = msg.from === 'brand';
                return (
                  <div key={i} className={`flex flex-col ${isBrand ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl space-y-2 shadow-sm ${
                        isBrand
                          ? 'bg-[#202C33] text-slate-100 rounded-tl-none'
                          : 'bg-[#005C4B] text-white rounded-tr-none'
                      }`}
                    >
                      <p className="whitespace-pre-line text-xs leading-relaxed">{msg.text}</p>
                      {msg.cta && (
                        <div className="pt-1">
                          <div className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-[11px] rounded-lg shadow cursor-pointer transition-colors">
                            {msg.cta}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                        <span>{msg.time}</span>
                        <CheckCheck className="w-3 h-3 text-sky-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Simulated Input */}
            <div className="bg-[#202C33] px-3 py-2 flex items-center justify-between gap-2 text-slate-400 text-xs">
              <div className="bg-[#2A3942] px-3 py-1.5 rounded-full flex-1 text-[11px] text-slate-400">
                Type a message...
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
