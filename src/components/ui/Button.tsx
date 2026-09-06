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
        'bg-[var(--theme-btn-primary-bg,var(--theme-color-primary,#111111))] text-[var(--theme-btn-primary-text,#FFFFFF)] hover:bg-[var(--theme-btn-primary-hover-bg,var(--theme-color-primary-hover,#2A2523))] hover:text-[var(--theme-btn-primary-hover-text,#FFFFFF)] border border-transparent shadow-sm',
      secondary:
        'bg-[var(--theme-btn-secondary-bg,var(--theme-color-surface-secondary,#F8F1EA))] text-[var(--theme-btn-secondary-text,var(--theme-color-text,#111111))] hover:bg-[var(--theme-btn-secondary-hover-bg,var(--theme-color-border,#EFE4D9))] border border-[var(--theme-btn-secondary-border,var(--theme-color-border,#E8DED8))]',
      accent:
        'bg-[var(--theme-color-accent,#B77A68)] text-white hover:bg-[var(--theme-color-accent-hover,#9A6050)] border border-[var(--theme-color-accent,#B77A68)] shadow-sm',
      'luxury-gold':
        'bg-[var(--theme-color-accent,#B77A68)] text-white hover:opacity-95 shadow-md',
      outline:
        'bg-transparent text-[var(--theme-color-text,#111111)] border border-[var(--theme-color-text,#111111)] hover:bg-[var(--theme-btn-primary-bg,var(--theme-color-primary,#111111))] hover:text-[var(--theme-btn-primary-text,#FFFFFF)]',
      ghost:
        'bg-transparent text-[var(--theme-color-text,#111111)] hover:bg-[var(--theme-color-surface-secondary,#F8F1EA)] text-inherit',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-[var(--theme-btn-radius,4px)] gap-1.5 uppercase font-semibold tracking-wider',
      md: 'text-sm px-5 py-2.5 rounded-[var(--theme-btn-radius,6px)] gap-2 uppercase font-semibold tracking-wider',
      lg: 'text-base px-7 py-3.5 rounded-[var(--theme-btn-radius,8px)] gap-2.5 uppercase font-semibold tracking-widest',
      icon: 'p-2.5 rounded-[var(--theme-btn-radius,6px)] aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={{
          borderRadius: 'var(--theme-btn-radius, 8px)',
          fontFamily: 'var(--theme-font-button, inherit)',
          ...props.style,
        }}
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
