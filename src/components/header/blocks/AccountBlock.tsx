'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, ChevronDown } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { useAuth } from '@/context/AuthContext';

interface AccountBlockProps {
  block: HeaderBlock;
  accentColor?: string;
}

export function AccountBlock({ block, accentColor = '#E11D48' }: AccountBlockProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const s = block.settings || {};
  const showLabel = s.showLabel !== false;
  const label = s.label || 'SIGN IN';
  const loggedInLabel = s.loggedInLabel || 'ACCOUNT';

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        aria-label="Sign In"
        className="flex items-center gap-1.5 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider uppercase select-none group"
        style={{ color: block.styles?.textColor || 'inherit' }}
      >
        <User className="w-4 h-4 transition-transform group-hover:scale-110" />
        {showLabel && <span>{label}</span>}
      </Link>
    );
  }

  return (
    <div className="relative select-none" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-label="My Account"
        className="flex items-center gap-1.5 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider uppercase cursor-pointer group"
        style={{ color: block.styles?.textColor || 'inherit' }}
      >
        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-800">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        {showLabel && <span>{user?.name?.split(' ')[0] || loggedInLabel}</span>}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-bold truncate">{user?.name || 'Customer'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders & Details</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
