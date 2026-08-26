'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToBag = (product: (typeof wishlistItems)[0]) => {
    const defaultColor = product.colors[0]?.name || 'Standard';
    const defaultSize = product.sizes.find((s) => s.inStock)?.size || 'M';
    addItem(product, defaultColor, defaultSize, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-[#FFFDFC] py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} className="mb-4" />

        <div className="flex items-baseline justify-between pb-6 border-b border-[#E8DED8] mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              My Wishlist
            </h1>
            <p className="text-xs text-[#777777] font-sans mt-1">
              Your curated list of saved styles and dream ensembles.
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-semibold text-[#C98282] hover:underline"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Heart}
              title="Your Wishlist is Empty"
              description="Save your favorite dresses, kurti sets, and kids wear to view them here later."
              actionText="Explore Trending Styles"
              actionHref="/women"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow relative"
              >
                {/* Thumbnail */}
                <div className="relative aspect-3/4 bg-[#FAF6F2] overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </Link>

                  {/* Remove action button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#FFFDFC]/90 border border-[#E8DED8] flex items-center justify-center text-[#777777] hover:text-[#C98282] transition-colors shadow-xs"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#B77A68] tracking-wider block">
                      {product.categoryName}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs sm:text-sm font-semibold text-[#111111] hover:text-[#B77A68] transition-colors line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1">
                      <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Move to Bag Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                    onClick={() => handleMoveToBag(product)}
                  >
                    Move to Bag
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
