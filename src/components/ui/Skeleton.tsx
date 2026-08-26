import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('skeleton-shimmer bg-[#F8F1EA] rounded-none', className)}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFDFC] border border-[#E8DED8]/60 p-3">
      <Skeleton className="w-full aspect-3/4 mb-3" />
      <Skeleton className="h-3 w-1/3 mb-2" />
      <Skeleton className="h-4 w-4/5 mb-2" />
      <Skeleton className="h-3 w-1/4 mb-3" />
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#E8DED8]/40">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
