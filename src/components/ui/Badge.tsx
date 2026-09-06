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
    sale: 'bg-[var(--theme-color-error,#EF4444)] text-white shadow-xs',
    new: 'bg-[var(--theme-color-primary,#111111)] text-white',
    trending: 'bg-[var(--theme-color-accent,#B77A68)] text-white',
    bestseller: 'bg-[var(--theme-color-warning,#F59E0B)] text-black font-extrabold',
    exclusive: 'bg-[var(--theme-color-primary,#111111)] text-[var(--theme-color-accent,#CF9584)] border border-[var(--theme-color-accent,#B77A68)]/30',
    neutral: 'bg-[var(--theme-color-surface-secondary,#F8F1EA)] text-[var(--theme-color-text-secondary,#777777)] border border-[var(--theme-color-border,#E8DED8)]',
    outline: 'bg-transparent text-[var(--theme-color-heading,#111111)] border border-[var(--theme-color-border,#111111)]',
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}
