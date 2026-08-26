'use client';

import React from 'react';
import { Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ContactData {
  email: string;
  phone: string;
}

export interface ContactStepProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function ContactStep({
  data,
  onChange,
  onNext,
  isCompleted,
}: ContactStepProps) {
  const isValid =
    data.email.includes('@') && data.phone.trim().replace(/[^0-9]/g, '').length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
              />
            </div>
            <span className="text-[10px] text-[#777777] mt-1 block">
              Order invoice &amp; tracking updates will be sent here
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              10-Digit Mobile Number *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-[#111111] border-r border-[#E8DED8] pr-2">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={data.phone}
                onChange={(e) =>
                  onChange({
                    ...data,
                    phone: e.target.value.replace(/[^0-9]/g, ''),
                  })
                }
                placeholder="9876543210"
                className="w-full pl-14 pr-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans tracking-wider"
              />
            </div>
            <span className="text-[10px] text-[#777777] mt-1 block">
              Required for SMS delivery updates and OTP verification
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isValid}
          >
            Continue to Delivery Address &rarr;
          </Button>
        </div>
      </form>
    </div>
  );
}
