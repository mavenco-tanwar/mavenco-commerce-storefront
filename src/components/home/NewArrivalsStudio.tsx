'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductService } from '@/services/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export function NewArrivalsStudio() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const res = await ProductService.getNewArrivals(4);
        setNewArrivals(res.data);
      } catch (e) {
        console.error('Failed to load new arrivals', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadNewArrivals();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F2] border-y border-[#E8DED8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
              Weekly Drop • Just In
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1">
              Fresh From The Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-1 font-sans">
              Hand-finished designs released fresh this week in limited boutique runs.
            </p>
          </div>

          <Link
            href="/new-arrivals"
            className="text-xs uppercase font-bold tracking-widest text-[#111111] hover:text-[#B77A68] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Grid: 1 Large Editorial Banner + 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Large Studio Feature Banner (5 cols) */}
          <div className="md:col-span-4 lg:col-span-4 relative overflow-hidden bg-[#111111] text-white p-8 flex flex-col justify-between min-h-[420px] luxury-card-shadow">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
              alt="Studio Feature"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover opacity-60 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Top Tag */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B77A68] text-white text-[10px] uppercase font-bold tracking-widest">
                <Sparkles className="w-3 h-3" />
                Limited Studio Edit
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFFDFC] leading-tight">
                Pure Linen &amp; Silk Festive Harmonies
              </h3>
              <p className="text-xs text-[#E8DED8] leading-relaxed font-sans font-normal">
                Indulge in breathable textures, hand-pleated silhouettes, and delicate rose-gold accents tailored for perfection.
              </p>
              <Link href="/new-arrivals" className="block pt-2">
                <Button variant="luxury-gold" size="md" className="w-full">
                  Explore Studio Edit &rarr;
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Cards (8 cols) */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {newArrivals.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
