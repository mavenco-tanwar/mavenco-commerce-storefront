'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  Package,
  Sliders,
  Award,
  Truck,
  Boxes,
  Network,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  DownloadCloud,
  Globe2,
  TrendingUp,
  Store,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tenant, setTenant] = useState('lumina');

  const navItems = [
    { label: 'Catalog Overview', href: '/admin/catalog', icon: Layers },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: RefreshCw },
    { label: 'Subscription Plans', href: '/admin/subscriptions/plans', icon: Sliders },
    { label: 'Memberships', href: '/admin/subscriptions/memberships', icon: Award },
    { label: 'Merchandising', href: '/admin/merchandising', icon: TrendingUp },
    { label: 'Attributes & Groups', href: '/admin/catalog/attributes', icon: Sliders },
    { label: 'Brands', href: '/admin/catalog/brands', icon: Award },
    { label: 'Vendors & Suppliers', href: '/admin/catalog/vendors', icon: Truck },
    { label: 'Bundles & Kits', href: '/admin/catalog/bundles', icon: Boxes },
    { label: 'Relationships', href: '/admin/catalog/relationships', icon: Network },
    { label: 'Quality Governance', href: '/admin/catalog/quality', icon: ShieldCheck },
    { label: 'Completeness Audit', href: '/admin/catalog/completeness', icon: CheckCircle2 },
    { label: 'Import Center', href: '/admin/catalog/imports', icon: UploadCloud },
    { label: 'Export Center', href: '/admin/catalog/exports', icon: DownloadCloud },
    { label: 'Publishing Matrix', href: '/admin/catalog/publishing', icon: Globe2 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 flex flex-col antialiased">
      {/* Top Banner & Control Bar */}
      <header className="h-16 border-b border-zinc-800/80 bg-[#101318]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-amber-500/20">
              PIM
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide text-zinc-100">Enterprise PIM</span>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">Catalog Governance & Merchandising</span>
            </div>
          </div>
          <span className="text-zinc-600">/</span>
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/60 rounded-full px-3 py-1 text-xs text-zinc-300">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-zinc-400">Tenant:</span>
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-transparent border-none outline-none font-medium text-amber-300 cursor-pointer text-xs"
            >
              <option value="lumina" className="bg-zinc-900 text-zinc-100">Lumina Atelier (Default)</option>
              <option value="auraliving" className="bg-zinc-900 text-zinc-100">Aura Living</option>
              <option value="apexathletics" className="bg-zinc-900 text-zinc-100">Apex Athletics</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Authoritative Single Source
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md transition flex items-center gap-1.5 border border-zinc-700/50"
          >
            <span>View Storefront</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-zinc-800/80 bg-[#0E1116] flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
                Catalog & Governance
              </p>
              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/catalog' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/10'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-800/60">
              <div className="bg-gradient-to-br from-amber-950/30 to-amber-900/10 border border-amber-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PIM Governance Guard</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Price, inventory, tax, and promotions remain strictly owned by authoritative domain engines.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-zinc-500 border-t border-zinc-800/60 flex items-center justify-between">
            <span>Module 33 PIM v1.0</span>
            <span className="font-mono text-[10px] text-zinc-600">ISOLATED DB</span>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0B0D11] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
