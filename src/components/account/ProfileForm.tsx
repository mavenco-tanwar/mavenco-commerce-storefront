'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function ProfileForm() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile Updated', 'Your profile details have been saved', 'success');
    }, 400);
  };

  return (
    <div className="bg-[#FFFDFC] border border-[#E8DED8] p-6 lg:p-8 luxury-card-shadow select-none">
      <h3 className="text-xl font-serif font-bold text-[#111111] mb-1">
        Personal Profile &amp; Contact
      </h3>
      <p className="text-xs text-[#777777] font-sans mb-6">
        Update your personal details and communication preferences.
      </p>

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
