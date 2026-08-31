'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall, ShieldCheck, Clock } from 'lucide-react';

export function FloatingWhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const WHATSAPP_NUMBER = '918239019096';

  const quickPrompts = [
    {
      label: '🚀 Request Live Admin Demo',
      message: 'Hi Ammar, I would like to request a guided live demo of the Mavenco Merchant Admin Panel.',
    },
    {
      label: '💳 Inquire About SaaS Plans & Pricing',
      message: 'Hi Ammar, I want to discuss the SaaS license pricing and server deployment for my brand.',
    },
    {
      label: '🎨 Custom Headless Storefront Migration',
      message: 'Hi Ammar, I want to migrate my existing store to the Mavenco Headless Commerce Engine.',
    },
  ];

  const handleSendPrompt = (text: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleSendPrompt(customMsg);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#141724]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold text-white text-lg">
                  M
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-300 border-2 border-[#141724] animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Mavenco Platform Concierge</h4>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Typically replies in &lt; 5 mins</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto">
            <div className="p-3 bg-[#0A0C10] rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Need immediate platform guidance?</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect directly with our Lead Solutions Architect on WhatsApp for live pricing, custom feature scoping, or sandbox credentials.
              </p>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</div>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q.message)}
                  className="w-full text-left p-2.5 bg-slate-900/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-800 rounded-xl text-xs text-slate-200 hover:text-emerald-300 transition-all font-medium flex items-center justify-between group"
                >
                  <span>{q.label}</span>
                  <Send className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>

            {/* Custom message input */}
            <form onSubmit={handleSendCustom} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type custom question..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 bg-[#0A0C10] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Direct WhatsApp Channel: +91 82390 19096</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-950/80 transition-all hover:scale-105 border border-emerald-400/40"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp Concierge</span>
      </button>
    </div>
  );
}
