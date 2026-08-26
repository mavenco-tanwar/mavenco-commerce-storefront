'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastMessage } from '@/context/ToastContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast: ToastMessage) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#FFFDFC] border shadow-xl animate-in slide-in-from-bottom-3 duration-300 ${
              isError
                ? 'border-[#C98282] text-[#111111]'
                : isSuccess
                ? 'border-[#B77A68] text-[#111111]'
                : 'border-[#E8DED8] text-[#111111]'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#B77A68] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-[#C98282] shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-[#777777] shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h5 className="text-xs font-bold font-sans uppercase tracking-wider text-[#111111]">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-xs text-[#777777] mt-0.5 font-sans leading-normal">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#777777] hover:text-[#111111] p-0.5 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
