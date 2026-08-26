'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  position?: 'right' | 'left' | 'bottom';
  className?: string;
  headerAction?: ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  className,
  headerAction,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positions = {
    right: 'top-0 right-0 h-full w-full max-w-md animate-in slide-in-from-right duration-300 border-l',
    left: 'top-0 left-0 h-full w-full max-w-md animate-in slide-in-from-left duration-300 border-r',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] w-full animate-in slide-in-from-bottom duration-300 border-t',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed bg-[#FFFDFC] border-[#E8DED8] shadow-2xl flex flex-col z-10',
          positions[position],
          className
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DED8] bg-[#FFFDFC]">
          <div className="flex-1 pr-4">
            {title && (
              <h3 className="text-lg md:text-xl font-serif font-bold text-[#111111] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#777777] mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerAction}
            <button
              onClick={onClose}
              className="p-2 text-[#777777] hover:text-[#111111] hover:bg-[#F8F1EA] transition-colors rounded-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
