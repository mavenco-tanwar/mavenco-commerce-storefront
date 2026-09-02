import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0C10] text-white">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-400 to-indigo-600 animate-pulse" />

      {/* Luxury Brand Orb & Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="w-20 h-20 rounded-full border-2 border-rose-500/20 animate-ping absolute" />
        
        {/* Spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-rose-500 border-r-indigo-500 animate-spin" />
        
        {/* Center luxury emblem */}
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
          <span className="text-[10px] font-black tracking-tighter text-white font-serif">M</span>
        </div>
      </div>

      {/* Brand Text & Status */}
      <div className="mt-6 text-center space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
          Mavenco Luxury Atelier
        </h3>
        <p className="text-[11px] text-slate-400 font-sans animate-pulse">
          Loading bespoke storefront experience...
        </p>
      </div>
    </div>
  );
}
