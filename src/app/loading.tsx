'use client';

import React, { useEffect, useState } from 'react';
import { TenantService } from '@/services/api/tenant';
import { StoreApiService } from '@/services/api/store';

export default function Loading() {
  const [storeName, setStoreName] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#E11D48');

  useEffect(() => {
    let isMounted = true;

    async function resolveDynamicBrand() {
      try {
        const { data: config } = await StoreApiService.getStoreConfig();
        if (isMounted && config?.storeName) {
          setStoreName(config.storeName);
          if (config.theme?.primaryColor) {
            setPrimaryColor(config.theme.primaryColor);
          }
          return;
        }

        const tenant = await TenantService.resolveTenant();
        if (isMounted && tenant?.storeName) {
          setStoreName(tenant.storeName);
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const match = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
          if (match && match[2]) {
            setStoreName(match[2].replace(/[-_]/g, ' ').toUpperCase());
          }
        }
      }
    }

    resolveDynamicBrand();
    return () => {
      isMounted = false;
    };
  }, []);

  const emblemInitial = storeName ? storeName.trim().charAt(0).toUpperCase() : '';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0C10] text-white transition-opacity duration-300">
      {/* Top Dynamic Gradient Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 animate-pulse"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, #F59E0B, #6366F1)`
        }}
      />

      {/* Dynamic Brand Orb & Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div 
          className="w-20 h-20 rounded-full animate-ping absolute opacity-25"
          style={{ borderColor: primaryColor }}
        />
        
        {/* Spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-rose-500 border-r-indigo-500 animate-spin" />
        
        {/* Center dynamic brand emblem */}
        <div 
          className="absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-black/60"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, #4F46E5)`
          }}
        >
          {emblemInitial ? (
            <span className="text-xs font-black tracking-tighter text-white font-serif">
              {emblemInitial}
            </span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          )}
        </div>
      </div>

      {/* Dynamic Store Brand Title & Status */}
      <div className="mt-6 text-center space-y-1.5 px-4">
        {storeName ? (
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/90 font-serif">
            {storeName}
          </h3>
        ) : (
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse mx-auto" />
        )}
        <p className="text-[11px] text-slate-400 font-sans animate-pulse">
          Loading storefront experience...
        </p>
      </div>
    </div>
  );
}
