import React from 'react';
import { Sparkles, Award, Tag, Truck, ShieldCheck, HeartHandshake, RefreshCw, Clock } from 'lucide-react';

interface ValuePropItem {
  title: string;
  description: string;
  icon?: string;
}

interface ValuePropsProps {
  customItems?: ValuePropItem[];
}

const ICON_MAP: Record<string, any> = {
  sparkles: Sparkles,
  award: Award,
  tag: Tag,
  truck: Truck,
  shield: ShieldCheck,
  heart: HeartHandshake,
  refresh: RefreshCw,
  clock: Clock,
};

const DEFAULT_PROMISES: ValuePropItem[] = [
  {
    icon: 'sparkles',
    title: 'Trendy Collections',
    description: 'Handpicked, fashion-forward silhouettes updated every week.',
  },
  {
    icon: 'award',
    title: 'Premium Quality',
    description: 'Breathable, skin-friendly fabrics crafted with utmost attention to detail.',
  },
  {
    icon: 'tag',
    title: 'Affordable Luxury',
    description: 'Runway-inspired luxury aesthetics at direct-to-consumer prices.',
  },
  {
    icon: 'truck',
    title: 'Easy Delivery & Returns',
    description: 'Free express shipping > ₹999 with 7-day doorstep exchange.',
  },
];

export function ValueProps({ customItems }: ValuePropsProps = {}) {
  const promises = customItems && customItems.length > 0 ? customItems : DEFAULT_PROMISES;

  return (
    <section className="bg-[#FAF6F2] border-b border-[#E8DED8] py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((item, idx) => {
            const IconComponent = (item.icon && ICON_MAP[item.icon.toLowerCase()]) || Sparkles;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 bg-[#FFFDFC] border border-[#E8DED8]"
              >
                <div className="w-10 h-10 rounded-full bg-[#F8F1EA] border border-[#E8DED8] flex items-center justify-center shrink-0 text-[#B77A68]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#777777] mt-0.5 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
