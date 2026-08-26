'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4 text-center bg-[#FAF6F2] select-none">
      <div className="max-w-md w-full p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F7EBEA] border border-[#C98282] flex items-center justify-center mx-auto text-[#C98282]">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C98282]">
            Something went wrong
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#111111]">
            We&apos;re polishing things up
          </h1>
          <p className="text-xs text-[#777777] font-sans">
            An unexpected error occurred while loading this boutique experience.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => reset()}
          >
            Try Again
          </Button>

          <Link href="/">
            <Button variant="secondary" size="md">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
