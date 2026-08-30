'use client';

import React, { useState, useEffect } from 'react';
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
import { resolveTenant, TenantBrandConfig } from '@/lib/tenant-config';

export function Footer() {
  const [tenant, setTenant] = useState<TenantBrandConfig>(resolveTenant());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setTenant(resolveTenant());
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer
      className="border-t select-none pt-16 pb-12 transition-colors duration-300"
      style={{
        backgroundColor: tenant.theme.primaryColor,
        color: tenant.theme.secondaryColor,
        borderColor: `${tenant.theme.accentColor}33`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Value Props Bar */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-14 border-b"
          style={{ borderColor: `${tenant.theme.accentColor}26` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tenant.theme.accentColor}1A`,
                borderColor: `${tenant.theme.accentColor}4D`,
                color: tenant.theme.accentColor,
              }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {tenant.slug === 'jqtrends'
                  ? 'Express Delivery'
                  : tenant.slug === 'auraliving'
                  ? 'Carbon-Neutral Dispatch'
                  : tenant.slug === 'apexathletics'
                  ? 'Fast Worldwide Dispatch'
                  : 'Express Doorstep Delivery'}
              </h4>
              <p className="text-xs opacity-70 mt-0.5 font-sans">
                {tenant.slug === 'jqtrends'
                  ? 'Free shipping on orders above ₹999'
                  : tenant.currency === 'INR'
                  ? 'Free delivery on orders above ₹999'
                  : 'Free express shipping on all orders > $100'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tenant.theme.accentColor}1A`,
                borderColor: `${tenant.theme.accentColor}4D`,
                color: tenant.theme.accentColor,
              }}
            >
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Easy 7-Day Returns
              </h4>
              <p className="text-xs opacity-70 mt-0.5 font-sans">Hassle-free doorstep exchange &amp; refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tenant.theme.accentColor}1A`,
                borderColor: `${tenant.theme.accentColor}4D`,
                color: tenant.theme.accentColor,
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">100% Quality Guaranteed</h4>
              <p className="text-xs opacity-70 mt-0.5 font-sans">Handcrafted with strict quality audits</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tenant.theme.accentColor}1A`,
                borderColor: `${tenant.theme.accentColor}4D`,
                color: tenant.theme.accentColor,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {tenant.slug === 'jqtrends'
                  ? 'Boutique Craftsmanship'
                  : tenant.slug === 'auraliving'
                  ? 'Small-Batch Artisanal'
                  : tenant.slug === 'apexathletics'
                  ? 'Pro Athlete Calibrated'
                  : 'Bespoke Craftsmanship'}
              </h4>
              <p className="text-xs opacity-70 mt-0.5 font-sans">Designed for modern distinction</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b"
          style={{ borderColor: `${tenant.theme.accentColor}26` }}
        >
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <BrandLogo variant="light" size="lg" />
            <p className="text-xs opacity-75 font-sans leading-relaxed max-w-sm">
              {tenant.description}
            </p>

            <div className="space-y-2.5 text-xs opacity-85 font-sans">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: tenant.theme.accentColor }} />
                <span>{tenant.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" style={{ color: tenant.theme.accentColor }} />
                <span>{tenant.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" style={{ color: tenant.theme.accentColor }} />
                <span>{tenant.contact.email}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${tenant.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Departments */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              {tenant.slug === 'jqtrends'
                ? 'Shop Departments'
                : tenant.slug === 'auraliving'
                ? 'Sanctuary Spaces'
                : 'Athletic Disciplines'}
            </h3>
            <ul className="space-y-2.5 text-xs opacity-75">
              {tenant.footerShopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Client Care</h3>
            <ul className="space-y-2.5 text-xs opacity-75">
              {tenant.footerCareLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Private Circle</h3>
            <p className="text-xs opacity-75 font-sans leading-relaxed">
              Subscribe to receive private preview lookbooks, early VIP access, and special seasonal invitations.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for joining {tenant.name}.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white rounded-lg transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white uppercase tracking-wider rounded-lg transition-opacity hover:opacity-90 shadow-md"
                  style={{ backgroundColor: tenant.theme.accentColor }}
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom: Legal & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} {tenant.name}. Powered by Mavenco Commerce SaaS Engine.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
