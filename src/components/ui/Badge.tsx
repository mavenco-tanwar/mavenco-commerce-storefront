import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new' | 'trending' | 'bestseller' | 'exclusive' | 'neutral' | 'outline';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}: BadgeProps) {
  const base =
    'inline-flex items-center justify-center uppercase font-bold tracking-widest leading-none rounded-none select-none';

  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
  };

  const variants = {
    sale: 'bg-[#C98282] text-white shadow-xs',
    new: 'bg-[#111111] text-[#FFFDFC]',
    trending: 'bg-[#B77A68] text-white',
    bestseller: 'bg-[#E8B8B5] text-[#111111] font-extrabold',
    exclusive: 'bg-gradient-to-r from-[#111111] to-[#3D3430] text-[#CF9584] border border-[#B77A68]/30',
    neutral: 'bg-[#F8F1EA] text-[#777777] border border-[#E8DED8]',
    outline: 'bg-transparent text-[#111111] border border-[#111111]/30',
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}
