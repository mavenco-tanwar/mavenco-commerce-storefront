import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ValueProps } from '@/components/home/ValueProps';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { TrendingSection } from '@/components/home/TrendingSection';
import { WomensEditorial } from '@/components/home/WomensEditorial';
import { NewArrivalsStudio } from '@/components/home/NewArrivalsStudio';
import { KidsEditorial } from '@/components/home/KidsEditorial';
import { PromotionalBanner } from '@/components/home/PromotionalBanner';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brand Value Props */}
      <ValueProps />

      {/* 3. Shop By Category */}
      <CategoryShowcase />

      {/* 4. Trending Now */}
      <TrendingSection />

      {/* 5. For Her - Women's Editorial */}
      <WomensEditorial />

      {/* 6. Fresh From The Studio - New Arrivals */}
      <NewArrivalsStudio />

      {/* 7. Little Looks, Big Style - Kids Editorial */}
      <KidsEditorial />

      {/* 8. Promotional Banner */}
      <PromotionalBanner />

      {/* 9. Best Sellers */}
      <BestSellersSection />

      {/* 10. Loved By You - Testimonials */}
      <TestimonialsSection />

      {/* 11. Instagram Lookbook */}
      <InstagramFeed />

      {/* 12. Newsletter */}
      <NewsletterSection />
    </div>
  );
}
