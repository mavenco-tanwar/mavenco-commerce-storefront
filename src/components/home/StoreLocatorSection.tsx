'use client';

import React, { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StoreLocation {
  city: string;
  name?: string;
  address: string;
  hours?: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

interface StoreLocatorSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  locations?: StoreLocation[];
  showOpeningHours?: boolean;
  showDirectionsButton?: boolean;
  tenantSlug?: string;
}

const DEFAULT_LOCATIONS: StoreLocation[] = [
  {
    city: 'Mumbai',
    name: 'Bandra Flagship Atelier',
    address: 'Plot 42, Linking Road, Near Khar Telephone Exchange, Bandra West, Mumbai 400052',
    hours: '10:00 AM – 9:00 PM Daily',
    phone: '+91 98200 12345',
    lat: 19.059,
    lng: 72.836,
  },
  {
    city: 'Delhi',
    name: 'South Extension Boutique',
    address: 'G-14, South Extension Part 1, Main Market, New Delhi 110049',
    hours: '10:30 AM – 8:30 PM Daily',
    phone: '+91 98100 54321',
    lat: 28.528,
    lng: 77.219,
  },
  {
    city: 'Jaipur',
    name: 'C-Scheme Heritage Studio',
    address: 'B-7, Bhagwan Das Road, Near Rajmandir, C-Scheme, Jaipur 302001',
    hours: '10:00 AM – 8:00 PM Daily',
    phone: '+91 94140 67890',
    lat: 26.912,
    lng: 75.787,
  },
  {
    city: 'Bengaluru',
    name: 'Indiranagar Experience Center',
    address: '124, 4th Cross, 100ft Road, Indiranagar, Bengaluru 560038',
    hours: '10:00 AM – 9:00 PM Daily',
    phone: '+91 99000 87654',
    lat: 12.971,
    lng: 77.594,
  },
];

export function StoreLocatorSection({
  customTitle = 'Visit Our Atelier Boutiques',
  customSubtitle = 'Immerse yourself in bespoke tailoring, tactile silk swatches, and personalized styling consultations.',
  customBadge = 'STORE LOCATOR & ATELIER',
  locations = DEFAULT_LOCATIONS,
  showOpeningHours = true,
  showDirectionsButton = true,
}: StoreLocatorSectionProps) {
  const activeLocations = Array.isArray(locations) && locations.length > 0 ? locations : DEFAULT_LOCATIONS;
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  const activeStore = activeLocations[selectedCityIndex] || activeLocations[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F2] border border-[#E8DED8] rounded-full shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#777777] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* City Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {activeLocations.map((loc, idx) => {
            const isSelected = selectedCityIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCityIndex(idx)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-[#FAF6F2] border border-[#E8DED8] text-[#444444] hover:text-[#111111]'
                }`}
              >
                {loc.city}
              </button>
            );
          })}
        </div>

        {/* Active Store Display Card */}
        {activeStore && (
          <div className="max-w-4xl mx-auto bg-[#FAF6F2] border border-[#E8DED8] rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B77A68]">
                {activeStore.city} Atelier
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#111111]">
                {activeStore.name || `${activeStore.city} Boutique`}
              </h3>

              <div className="space-y-2 text-xs text-[#555555] font-sans">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B77A68] shrink-0 mt-0.5" />
                  <span>{activeStore.address}</span>
                </div>

                {showOpeningHours && activeStore.hours && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#B77A68] shrink-0" />
                    <span>{activeStore.hours}</span>
                  </div>
                )}

                {activeStore.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#B77A68] shrink-0" />
                    <a
                      href={`tel:${activeStore.phone.replace(/\s+/g, '')}`}
                      className="hover:text-[#111111] hover:underline"
                    >
                      {activeStore.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                {showDirectionsButton && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${activeStore.name || ''} ${activeStore.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="luxury-gold" size="sm" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
                      Get Directions
                    </Button>
                  </a>
                )}
                <a href={`tel:${(activeStore.phone || '').replace(/\s+/g, '')}`}>
                  <Button variant="outline" size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                    Book Fitting Appointment
                  </Button>
                </a>
              </div>
            </div>

            {/* Atelier Visual Mock Map Pin */}
            <div className="h-64 rounded-2xl overflow-hidden relative bg-[#1E1B4B] text-white flex flex-col items-center justify-center p-6 text-center shadow-inner border border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="relative z-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#B77A68]/20 border border-[#B77A68] flex items-center justify-center mx-auto text-[#E8B8B5] animate-pulse">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="font-serif font-bold text-lg">{activeStore.city} Boutique</div>
                <p className="text-[11px] text-white/70 max-w-xs">
                  White-glove tailor fittings, custom drape alterations, and private collection viewings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
