import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { StoreProvider } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/layout/ToastContainer';

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
  title: 'JQ TRENDS | Style That Speaks You | Women & Kids Fashion',
  description:
    'Discover effortlessly stylish, premium affordable luxury fashion for women and kids at JQ Trends. Explore floral dresses, chanderi kurti sets, linen co-ords, and kids party wear.',
  keywords: [
    'JQ Trends',
    'Women fashion',
    'Kids clothing',
    'Indian boutique',
    'Chanderi kurtis',
    'Linen co-ords',
    'Floral dresses',
    'Kids ethnic wear',
  ],
  openGraph: {
    title: 'JQ TRENDS | Style That Speaks You',
    description: 'Affordable luxury fashion for modern women and adorable kids.',
    url: 'https://jqtrends.com',
    siteName: 'JQ Trends',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFFDFC] text-[#111111] antialiased">
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <AnnouncementBar />
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <ToastContainer />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
