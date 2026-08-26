'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'luxury-gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/40 active:scale-[0.98] tracking-wide';

    const variants = {
      primary:
        'bg-[#111111] text-[#FFFDFC] hover:bg-[#2A2523] hover:text-[#FFFDFC] border border-[#111111] shadow-sm',
      secondary:
        'bg-[#F8F1EA] text-[#111111] hover:bg-[#EFE4D9] border border-[#E8DED8]',
      accent:
        'bg-[#B77A68] text-white hover:bg-[#9A6050] border border-[#B77A68] shadow-sm',
      'luxury-gold':
        'bg-gradient-to-r from-[#B77A68] via-[#CF9584] to-[#B77A68] text-white hover:opacity-95 shadow-md shadow-rose-gold/20',
      outline:
        'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-[#FFFDFC]',
      ghost:
        'bg-transparent text-[#111111] hover:bg-[#F8F1EA] text-inherit',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5 uppercase font-semibold tracking-wider',
      md: 'text-sm px-5 py-2.5 rounded-sm gap-2 uppercase font-semibold tracking-wider',
      lg: 'text-base px-7 py-3.5 rounded-sm gap-2.5 uppercase font-semibold tracking-widest',
      icon: 'p-2.5 rounded-sm aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
