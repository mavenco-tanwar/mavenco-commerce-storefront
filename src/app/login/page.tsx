'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { formatTenantHref, resolveActiveTenantSlug } from '@/lib/tenant-config';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push(formatTenantHref('/account', activeTenantSlug));
    }
  };

  const handleDemoLogin = async () => {
    setEmail('aanya.kapoor@example.com');
    setPassword('••••••••');
    const success = await login('aanya.kapoor@example.com', 'demo123');
    if (success) {
      router.push(formatTenantHref('/account', activeTenantSlug));
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF6F2] select-none">
      <div className="max-w-md w-full p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#B77A68]">
            Welcome Back
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#777777] font-sans">
            Access your orders, saved addresses, and VIP wishlist.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="p-3.5 bg-[#FAF6F2] border border-[#B77A68]/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#111111]">
            <Sparkles className="w-4 h-4 text-[#B77A68] shrink-0" />
            <span>Instant Demo Session</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs font-bold text-[#B77A68] hover:text-[#9A6050] uppercase tracking-wider underline underline-offset-2"
          >
            1-Click Sign In
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#B77A68] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="luxury-gold"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E8DED8] text-center text-xs text-[#777777]">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href={formatTenantHref('/register', activeTenantSlug)}
            className="font-bold text-[#111111] hover:text-[#B77A68] underline underline-offset-2"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-[#FAF6F2]">
          <div className="w-8 h-8 border-2 border-[#B77A68] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
