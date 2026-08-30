import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  RefreshCw,
  Truck,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { CmsApiService } from '@/services/api/cms';
import { CategoryApiService } from '@/services/api/categories';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check Category
  try {
    const catRes = await CategoryApiService.getCategoryBySlug(slug);
    if (catRes?.data) {
      return {
        title: `${catRes.data.name} Collection | JQ Trends`,
        description: catRes.data.description || `Shop ${catRes.data.name} fashion at JQ Trends.`,
      };
    }
  } catch { }

  // 2. Check CMS Page
  try {
    const page = await CmsApiService.getPageBySlug(slug);
    if (page) {
      return {
        title: page.seo?.title || `${page.title} | JQ Trends`,
        description: page.seo?.description || `Explore ${page.title} at JQ Trends luxury boutique fashion.`,
      };
    }
  } catch { }

  return {
    title: 'Explore Boutique Fashion | JQ Trends',
  };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check if slug matches a Category (e.g. 'r', 'dresses', 'kurtis', 'co-ords', etc.)
  let category = null;
  try {
    const catRes = await CategoryApiService.getCategoryBySlug(slug);
    if (catRes?.data) {
      category = catRes.data;
    } else {
      // Check in all categories list
      const allCats = await CategoryApiService.getCategories();
      const found = allCats.data?.find((c) => c.slug === slug);
      if (found) category = found;
    }
  } catch (err) {
    console.warn(`[DynamicSlugPage] Category lookup for slug "${slug}" fallback:`, err);
  }

  // Render Category Catalog View if category matches
  if (category) {
    const subcategories = (category.subcategories || []).map((s) => ({
      slug: s.slug,
      name: s.name,
      count: s.itemCount || 12,
    }));

    return (
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs text-[#777777]">
            Loading {category.name} Collection...
          </div>
        }
      >
        <ProductListingView
          department={category.department || 'women'}
          initialCategory={category.slug}
          pageTitle={category.name}
          pageSubtitle={category.description || 'Artisanal tailoring and modern silhouettes handcrafted for effortless luxury.'}
          bannerImage={category.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop'}
          breadcrumbs={[{ label: category.name }]}
          availableCategories={subcategories}
        />
      </Suspense>
    );
  }

  // 2. Check if slug matches an Editorial CMS Page (e.g. 'about-us', 'shipping-policy', etc.)
  let page = null;
  try {
    page = await CmsApiService.getPageBySlug(slug);
  } catch (err) {
    console.warn(`[DynamicSlugPage] CMS page lookup for slug "${slug}" fallback:`, err);
  }

  if (page) {
    const heroBlock = page.blocks?.find((b) => b.type === 'hero');
    const richTextBlocks = page.blocks?.filter((b) => b.type === 'rich-text') || [];
    const valuePropsBlock = page.blocks?.find((b) => b.type === 'value-props');

    return (
      <div className="min-h-screen bg-[#FFFDFC] text-[#111111] select-none">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#FAF6F2] border-b border-[#E8DED8] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#777777] font-sans">
              <Link href="/" className="hover:text-[#111111] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[#111111] font-semibold">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Header Section */}
        {heroBlock ? (
          <section className="relative bg-[#111111] text-white py-20 md:py-28 overflow-hidden">
            <Image
              src={heroBlock.data?.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop'}
              alt={page.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
              {heroBlock.data?.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFDFC]/15 border border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-[#E8B8B5]" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                    {heroBlock.data.badge}
                  </span>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FFFDFC] leading-tight">
                {heroBlock.data?.title || page.title}
              </h1>
              {heroBlock.data?.subtitle && (
                <p className="text-sm sm:text-base text-[#E8DED8] max-w-2xl font-sans leading-relaxed">
                  {heroBlock.data.subtitle}
                </p>
              )}
            </div>
          </section>
        ) : (
          <section className="bg-[#FAF6F2] py-12 md:py-16 border-b border-[#E8DED8]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
                JQ Trends Studio
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111111]">
                {page.title}
              </h1>
              <div className="w-12 h-0.5 bg-[#B77A68] mx-auto" />
            </div>
          </section>
        )}

        {/* Rich Content Article Body */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
          {richTextBlocks.map((block, idx) => (
            <article
              key={idx}
              className="prose prose-stone prose-lg max-w-none text-[#333333] font-sans leading-relaxed
                prose-headings:font-serif prose-headings:text-[#111111] prose-headings:font-bold
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:border-b prose-h2:border-[#E8DED8] prose-h2:pb-3 prose-h2:mt-10
                prose-h3:text-xl prose-h3:text-[#B77A68]
                prose-p:text-sm prose-p:sm:text-base prose-p:leading-relaxed prose-p:text-[#444444]
                prose-li:text-sm prose-li:sm:text-base prose-li:text-[#444444]
                prose-strong:text-[#111111] prose-strong:font-bold
                prose-a:text-[#B77A68] prose-a:underline hover:prose-a:text-[#111111]"
              dangerouslySetInnerHTML={{ __html: block.data?.html || '' }}
            />
          ))}

          {/* Value Props & Guarantee Banner */}
          {valuePropsBlock && (
            <div className="mt-16 p-8 bg-[#FAF6F2] border border-[#E8DED8] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Truck className="w-6 h-6 text-[#B77A68] mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#111111]">Express Delivery</h4>
                <p className="text-xs text-[#777777]">Free shipping above ₹999 across India</p>
              </div>
              <div className="space-y-2">
                <RefreshCw className="w-6 h-6 text-[#B77A68] mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#111111]">Easy 7-Day Returns</h4>
                <p className="text-xs text-[#777777]">Hassle-free doorstep exchange</p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#B77A68] mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#111111]">100% Quality Verified</h4>
                <p className="text-xs text-[#777777]">Authentic handpicked fabrics</p>
              </div>
              <div className="space-y-2">
                <HeartHandshake className="w-6 h-6 text-[#B77A68] mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#111111]">Dedicated Care</h4>
                <p className="text-xs text-[#777777]">VIP styling support available 24/7</p>
              </div>
            </div>
          )}

          {/* Bottom Back-to-Shop CTA */}
          <div className="pt-10 border-t border-[#E8DED8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs uppercase font-bold tracking-widest text-[#777777] hover:text-[#111111] transition-colors"
            >
              ← Return to Boutique Home
            </Link>

            <Link href="/new-arrivals">
              <Button variant="luxury-gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore New Arrivals
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 3. Fallback: Luxury 404 Page (No Negative Timestamp Performance Crash)
  return (
    <div className="min-h-[70vh] bg-[#FFFDFC] py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F2] border border-[#E8DED8] flex items-center justify-center mx-auto text-[#B77A68]">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68] block">
            Boutique Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
            Looking for &ldquo;{slug}&rdquo;?
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            This collection or page is being prepared in our atelier. Explore our current luxury collections below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/women">
            <Button variant="luxury-gold" size="md">
              Shop Women
            </Button>
          </Link>
          <Link href="/kids">
            <Button variant="outline" size="md">
              Shop Kids
            </Button>
          </Link>
          <Link href="/new-arrivals">
            <Button variant="outline" size="md">
              New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
