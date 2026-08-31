import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { StoreProvider } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mavenco Commerce — Multi-Tenant Ecommerce SaaS Platform',
  description:
    'Enterprise-grade multi-tenant headless ecommerce SaaS platform. Provision isolated stores, custom databases, dynamic branding, and drag-and-drop visual CMS on the fly.',
  keywords: [
    'Mavenco Commerce',
    'Multi-Tenant Ecommerce',
    'Headless SaaS Platform',
    'Ecommerce CMS',
    'Storefront Engine',
    'Custom Store Provisioning',
  ],
  openGraph: {
    title: 'Mavenco Commerce — Multi-Tenant Ecommerce SaaS Platform',
    description: 'Launch, customize, and scale isolated ecommerce stores on the fly.',
    siteName: 'Mavenco Commerce',
    type: 'website',
  },
};

import { Suspense } from 'react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { FloatingWhatsAppWidget } from '@/components/ui/FloatingWhatsAppWidget';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0A0C10] text-[#111111] antialiased">
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <Suspense fallback={<div className="min-h-screen bg-[#0A0C10]" />}>
                    <DynamicLayoutWrapper>{children}</DynamicLayoutWrapper>
                  </Suspense>
                  <FloatingWhatsAppWidget />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
