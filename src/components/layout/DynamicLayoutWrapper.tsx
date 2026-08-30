'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PlatformNavbar } from './PlatformNavbar';
import { PlatformFooter } from './PlatformFooter';
import { ToastContainer } from './ToastContainer';
import { checkTenantValidity } from '@/lib/tenant-config';

export function DynamicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const tenantQuery = searchParams.get('tenant');

  // Check if requesting an inactive or deleted store
  const pathMatch = pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
  const activeSlug = tenantQuery || (pathMatch ? pathMatch[2] : null);

  const isInvalidTenant = activeSlug ? !checkTenantValidity(activeSlug).isValid : false;

  // Explicit platform presentation routes or invalid tenant routes
  const isPlatformRoute =
    (pathname === '/' && !tenantQuery) ||
    isInvalidTenant ||
    pathname === '/cms' ||
    pathname.startsWith('/cms/') ||
    pathname.startsWith('/platform') ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/pricing');

  // If on a platform presentation page or invalid store page, render the Mavenco Commerce SaaS Header and Footer
  if (isPlatformRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A0C10] text-slate-100 antialiased">
        <PlatformNavbar />
        <main className="flex-1">{children}</main>
        <PlatformFooter />
        <ToastContainer />
      </div>
    );
  }

  // Otherwise, render the active merchant store layout (with AnnouncementBar, Store Header & Footer)
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFC] text-[#111111] antialiased">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
