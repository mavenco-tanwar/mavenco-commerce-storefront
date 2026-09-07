'use client';

import React, { useState, useEffect } from 'react';
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
  Lock,
} from 'lucide-react';

interface NavItemDef {
  label: string;
  href: string;
  icon: any;
  moduleKey: string;
  requiredPermission?: string;
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  { label: 'Catalog Overview', href: '/admin/catalog', icon: Layers, moduleKey: 'catalog' },
  { label: 'Products', href: '/admin/products', icon: Package, moduleKey: 'products', requiredPermission: 'products.view' },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: RefreshCw, moduleKey: 'subscriptions', requiredPermission: 'subscriptions.view' },
  { label: 'Subscription Plans', href: '/admin/subscriptions/plans', icon: Sliders, moduleKey: 'subscriptions', requiredPermission: 'subscriptions.view' },
  { label: 'Memberships', href: '/admin/subscriptions/memberships', icon: Award, moduleKey: 'memberships', requiredPermission: 'subscriptions.view' },
  { label: 'Merchandising', href: '/admin/merchandising', icon: TrendingUp, moduleKey: 'catalog' },
  { label: 'Attributes & Groups', href: '/admin/catalog/attributes', icon: Sliders, moduleKey: 'pim' },
  { label: 'Brands', href: '/admin/catalog/brands', icon: Award, moduleKey: 'catalog' },
  { label: 'Vendors & Suppliers', href: '/admin/catalog/vendors', icon: Truck, moduleKey: 'pim' },
  { label: 'Bundles & Kits', href: '/admin/catalog/bundles', icon: Boxes, moduleKey: 'catalog' },
  { label: 'Relationships', href: '/admin/catalog/relationships', icon: Network, moduleKey: 'pim' },
  { label: 'Quality Governance', href: '/admin/catalog/quality', icon: ShieldCheck, moduleKey: 'pim' },
  { label: 'Completeness Audit', href: '/admin/catalog/completeness', icon: CheckCircle2, moduleKey: 'pim' },
  { label: 'Import Center', href: '/admin/catalog/imports', icon: UploadCloud, moduleKey: 'pim' },
  { label: 'Export Center', href: '/admin/catalog/exports', icon: DownloadCloud, moduleKey: 'pim' },
  { label: 'Publishing Matrix', href: '/admin/catalog/publishing', icon: Globe2, moduleKey: 'catalog' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tenant, setTenant] = useState('lumina');
  const [capabilities, setCapabilities] = useState<{
    modules: Record<string, boolean>;
    permissions: string[];
  }>({
    modules: {
      catalog: true,
      products: true,
      subscriptions: true,
      memberships: true,
      pim: true,
    },
    permissions: ['products.view', 'subscriptions.view'],
  });

  useEffect(() => {
    fetch(`/api/v1/admin/capabilities?_t=${Date.now()}`, {
      headers: {
        'x-tenant-id': tenant,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.modules) {
          setCapabilities({
            modules: json.data.modules,
            permissions: json.data.permissions || [],
          });
        }
      })
      .catch(() => {});
  }, [tenant]);

  // Dynamically filter sidebar items based on enabled modules and user permissions
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    // If module is explicitly disabled, hide it
    if (capabilities.modules[item.moduleKey] === false) {
      return false;
    }
    // If permission is required, check capability permissions
    if (item.requiredPermission && capabilities.permissions.length > 0) {
      return capabilities.permissions.includes(item.requiredPermission);
    }
    return true;
  });

  // Check if current route requires a disabled module
  const currentRouteItem = ALL_NAV_ITEMS.find((item) => pathname?.startsWith(item.href));
  const isCurrentModuleDisabled = currentRouteItem
    ? capabilities.modules[currentRouteItem.moduleKey] === false
    : false;

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
              <span className="font-semibold text-sm tracking-wide text-zinc-100">Enterprise Admin</span>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">Role & Module Entitled Workspace</span>
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
          <Link
            href="/superadmin/tenants"
            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-md transition flex items-center gap-1.5 border border-amber-500/30 font-semibold"
          >
            <span>Superadmin Hub</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
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
        {/* Dynamic Navigation Sidebar */}
        <aside className="w-64 border-r border-zinc-800/80 bg-[#0E1116] flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
                Entitled Modules ({navItems.length})
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
                  <span>Dynamic RBAC Guard</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Sidebar items reflect active tenant entitlements and user permissions in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-zinc-500 border-t border-zinc-800/60 flex items-center justify-between">
            <span>Module 36 Access</span>
            <span className="font-mono text-[10px] text-zinc-600">ISOLATED DB</span>
          </div>
        </aside>

        {/* Content Viewport / Route Guard */}
        <main className="flex-1 overflow-y-auto bg-[#0B0D11] p-8">
          {isCurrentModuleDisabled ? (
            <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">Module Not Entitled</h2>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                The <span className="text-amber-400 font-mono font-semibold">{currentRouteItem?.moduleKey}</span> module is not enabled for tenant <span className="text-zinc-200 font-mono font-semibold">{tenant}</span>. Historical data remains preserved in the isolated database.
              </p>
              <Link
                href="/admin/catalog"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
              >
                Return to Overview
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
