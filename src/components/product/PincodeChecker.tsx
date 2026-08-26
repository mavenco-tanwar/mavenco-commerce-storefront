'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { pincodesDirectory } from '@/data/pincodes';

export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'invalid'>('idle');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    city: string;
    state: string;
    date: string;
    codAvailable: boolean;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setStatus('invalid');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      const match = pincodesDirectory[cleanPin];
      const today = new Date();
      const daysToAdd = match ? match.estimatedDays : 3;
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + daysToAdd);

      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      setDeliveryInfo({
        city: match ? match.city : 'Your Location',
        state: match ? match.state : 'India',
        date: formattedDate,
        codAvailable: match ? match.codAvailable : true,
      });

      setStatus('success');
    }, 300);
  };

  return (
    <div className="bg-[#FAF6F2] border border-[#E8DED8] p-4 select-none">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-[#B77A68]" />
        <span className="text-xs uppercase font-bold tracking-wider text-[#111111]">
          Delivery Options &amp; PIN Code Check
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="Enter 6-digit PIN code (e.g. 560038)"
          className="flex-1 px-3 py-2 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
        />
        <button
          type="submit"
          disabled={status === 'loading' || pincode.length < 6}
          className="px-4 py-2 bg-[#111111] hover:bg-[#2A2523] text-white text-xs uppercase font-bold tracking-wider disabled:opacity-40 transition-colors"
        >
          {status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
        </button>
      </form>

      {/* Result feedback */}
      {status === 'invalid' && (
        <div className="flex items-center gap-1.5 text-xs text-[#C98282] mt-2 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Please enter a valid 6-digit Indian PIN code.</span>
        </div>
      )}

      {status === 'success' && deliveryInfo && (
        <div className="mt-3 pt-3 border-t border-[#E8DED8] space-y-1 text-xs animate-in fade-in duration-200">
          <p className="flex items-center gap-1.5 text-[#111111] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#B77A68] shrink-0" />
            <span>
              Expected Delivery by <strong className="text-[#B77A68]">{deliveryInfo.date}</strong> to {deliveryInfo.city}
            </span>
          </p>
          <div className="pl-5 space-y-0.5 text-[#777777] text-[11px]">
            <p>• Free Standard Shipping on this order</p>
            <p>• Cash on Delivery {deliveryInfo.codAvailable ? 'Available' : 'Unavailable'}</p>
            <p>• 7-Day Hassle-free Exchange &amp; Return</p>
          </div>
        </div>
      )}
    </div>
  );
}
