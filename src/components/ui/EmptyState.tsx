import React from 'react';
import Link from 'next/link';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4 bg-[#FFFDFC] border border-[#E8DED8] max-w-md mx-auto my-8',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-[#F8F1EA] border border-[#E8DED8] flex items-center justify-center mb-4 text-[#B77A68]">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-serif font-bold text-[#111111] mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#777777] max-w-xs mb-6 font-sans leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="md">
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && onActionClick && !actionHref && (
        <Button variant="primary" size="md" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
