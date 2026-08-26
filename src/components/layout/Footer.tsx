'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#111111] text-[#FFFDFC] border-t border-[#2A2523] select-none pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-14 border-b border-[#2A2523]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center shrink-0 text-[#B77A68]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFDFC]">
                Free Express Delivery
              </h4>
              <p className="text-xs text-[#777777] mt-0.5">On all prepaid orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center shrink-0 text-[#B77A68]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFDFC]">
                7-Day Easy Returns
              </h4>
              <p className="text-xs text-[#777777] mt-0.5">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center shrink-0 text-[#B77A68]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFDFC]">
                Artisanal Quality
              </h4>
              <p className="text-xs text-[#777777] mt-0.5">Pure fabrics &amp; hand-finished trims</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center shrink-0 text-[#B77A68]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFDFC]">
                100% Safe Payments
              </h4>
              <p className="text-xs text-[#777777] mt-0.5">UPI, Cards &amp; Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Middle: Brand Story, Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#2A2523]">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="md" />

            <p className="text-xs text-[#777777] max-w-sm leading-relaxed font-sans">
              JQ Trends is an Indian fashion house dedicated to affordable luxury for modern women and adorable kids. From regal festive Chanderi sets to effortless linen co-ords and pure cotton kids wear, every piece is designed with love and elegance.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#999999]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B77A68] shrink-0 mt-0.5" />
                <span>Indiranagar, Bengaluru, KA - 560038, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B77A68] shrink-0" />
                <span>+91 98765 43210 (Mon-Sat, 10am-7pm)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B77A68] shrink-0" />
                <span>care@jqtrends.com</span>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/jqtrends"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center text-[#FFFDFC] hover:text-[#B77A68] hover:border-[#B77A68] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/jqtrends"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center text-[#FFFDFC] hover:text-[#B77A68] hover:border-[#B77A68] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1F1C1B] border border-[#3D3430] flex items-center justify-center text-[#FFFDFC] hover:text-[#B77A68] hover:border-[#B77A68] transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFDFC] mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#777777]">
              <li>
                <Link href="/women" className="hover:text-[#B77A68] transition-colors">
                  Women&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-[#B77A68] transition-colors">
                  Kids Collection
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-[#B77A68] transition-colors">
                  New In Studio
                </Link>
              </li>
              <li>
                <Link href="/women?category=dresses" className="hover:text-[#B77A68] transition-colors">
                  Floral Dresses
                </Link>
              </li>
              <li>
                <Link href="/women?category=kurtis" className="hover:text-[#B77A68] transition-colors">
                  Chanderi Kurti Sets
                </Link>
              </li>
              <li>
                <Link href="/women?category=co-ords" className="hover:text-[#B77A68] transition-colors">
                  Linen Co-ords
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-[#C98282] hover:text-white font-semibold transition-colors">
                  Special Sale (Up to 50% Off)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFDFC] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#777777]">
              <li>
                <Link href="/account" className="hover:text-[#B77A68] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account?tab=addresses" className="hover:text-[#B77A68] transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <span className="hover:text-[#B77A68] transition-colors cursor-pointer">
                  Returns &amp; Exchanges Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#B77A68] transition-colors cursor-pointer">
                  Size Guide &amp; Measurements
                </span>
              </li>
              <li>
                <span className="hover:text-[#B77A68] transition-colors cursor-pointer">
                  Frequently Asked Questions
                </span>
              </li>
              <li>
                <span className="hover:text-[#B77A68] transition-colors cursor-pointer">
                  Contact Customer Support
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFDFC] mb-4">
              Stay In Style
            </h4>
            <p className="text-xs text-[#777777] mb-3 font-sans">
              Subscribe for first access to fresh studio drops, styling edits, and ₹200 off your first order.
            </p>

            {subscribed ? (
              <div className="bg-[#1F1C1B] border border-[#B77A68] p-3 text-xs text-[#FFFDFC] flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#B77A68] shrink-0" />
                <span>You&apos;re in! Use code <strong className="text-[#E8B8B5]">WELCOME200</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#1F1C1B] border border-[#3D3430] text-xs text-[#FFFDFC] placeholder:text-[#777777] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
                />
                <Button
                  type="submit"
                  variant="luxury-gold"
                  size="sm"
                  className="w-full justify-between"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom: Payment Gateways, Security & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <div>
            <p>© 2026 JQ TRENDS. Style that speaks you. All rights reserved.</p>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider text-[#999999]">
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">UPI (GPay / PhonePe)</span>
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">Visa</span>
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">Mastercard</span>
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">RuPay</span>
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">Net Banking</span>
            <span className="px-2 py-1 bg-[#1F1C1B] border border-[#3D3430]">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
