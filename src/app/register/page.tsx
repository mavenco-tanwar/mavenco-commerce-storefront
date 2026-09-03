'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, phone);
    if (success) router.push('/account');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF6F2] select-none">
      <div className="max-w-md w-full p-8 bg-[#FFFDFC] border border-[#E8DED8] luxury-card-shadow space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#B77A68]">
            Join VIP Club
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
            Create Account
          </h1>
          <p className="text-xs text-[#777777] font-sans">
            Enjoy special welcoming rewards &amp; exclusive early collection access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              10-Digit Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Create Password
            </label>
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
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E8DED8] text-center text-xs text-[#777777]">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-[#111111] hover:text-[#B77A68] underline underline-offset-2">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
