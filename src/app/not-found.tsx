import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center bg-[#FAF6F2] select-none">
      <div className="max-w-md w-full p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F2] border border-[#B77A68] flex items-center justify-center mx-auto text-[#B77A68]">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            Page Not Found • 404
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#111111]">
            Lost in Fashion?
          </h1>
          <p className="text-xs text-[#777777] font-sans leading-relaxed">
            The page you are looking for might have been moved or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/new-arrivals" className="w-full sm:w-auto">
            <Button variant="luxury-gold" size="md" className="w-full">
              Shop New In &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
