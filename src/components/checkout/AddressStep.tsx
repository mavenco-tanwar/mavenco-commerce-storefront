'use client';

import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { ShippingAddress } from '@/types/order';
import { indianStates, pincodesDirectory } from '@/data/pincodes';
import { Button } from '@/components/ui/Button';

export interface AddressStepProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AddressStep({
  address,
  onChange,
  onNext,
  onBack,
}: AddressStepProps) {
  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/[^0-9]/g, '');
    const match = pincodesDirectory[clean];

    if (match) {
      onChange({
        ...address,
        pincode: clean,
        city: match.city,
        state: match.state,
      });
    } else {
      onChange({
        ...address,
        pincode: clean,
      });
    }
  };

  const handleFillDemo = () => {
    onChange({
      fullName: 'Aanya Kapoor',
      email: address.email || 'aanya.kapoor@example.com',
      phone: address.phone || '9876543210',
      addressLine1: 'Villa 14, Palm Meadows, Indiranagar',
      addressLine2: '100 Feet Road, 2nd Stage',
      landmark: 'Near Indiranagar Metro Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    });
  };

  const isValid =
    address.fullName.trim().length >= 2 &&
    address.pincode.trim().length === 6 &&
    address.addressLine1.trim().length >= 5 &&
    address.city.trim().length >= 2 &&
    address.state.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <div className="space-y-4">
      {/* Quick demo autofill helper button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs text-[#B77A68] hover:text-[#9A6050] flex items-center gap-1 font-semibold underline underline-offset-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Quick Autofill Demo Address (Bengaluru)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={address.fullName}
            onChange={(e) => onChange({ ...address, fullName: e.target.value })}
            placeholder="e.g. Aanya Kapoor"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
          />
        </div>

        {/* PIN Code, City & State Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              6-Digit PIN Code *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={address.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              placeholder="e.g. 560038"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans tracking-widest font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              City / District *
            </label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => onChange({ ...address, city: e.target.value })}
              placeholder="e.g. Bengaluru"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              State *
            </label>
            <select
              value={address.state}
              onChange={(e) => onChange({ ...address, state: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans cursor-pointer"
            >
              <option value="">Select State</option>
              {indianStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Flat, House No., Building, Apartment *
          </label>
          <input
            type="text"
            required
            value={address.addressLine1}
            onChange={(e) => onChange({ ...address, addressLine1: e.target.value })}
            placeholder="e.g. Flat 402, Lotus Orchid Apartments"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
          />
        </div>

        {/* Address Line 2 & Landmark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Area, Street, Sector
            </label>
            <input
              type="text"
              value={address.addressLine2 || ''}
              onChange={(e) => onChange({ ...address, addressLine2: e.target.value })}
              placeholder="e.g. 100 Feet Road, Indiranagar"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={address.landmark || ''}
              onChange={(e) => onChange({ ...address, landmark: e.target.value })}
              placeholder="e.g. Near Metro Station"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onBack}
          >
            &larr; Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isValid}
          >
            Continue to Delivery Method &rarr;
          </Button>
        </div>
      </form>
    </div>
  );
}
