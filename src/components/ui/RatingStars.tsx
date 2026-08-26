import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = 'sm',
  showCount = false,
  count,
  className,
}: RatingStarsProps) {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;

          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  starSizes[size],
                  filled
                    ? 'fill-[#B77A68] text-[#B77A68]'
                    : half
                    ? 'fill-[#B77A68]/50 text-[#B77A68]'
                    : 'text-[#E8DED8]'
                )}
              />
            </div>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-soft-gray font-medium">
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
}
