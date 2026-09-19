import React from 'react';
import { Sparkles, Award, Tag, Truck, ShieldCheck, HeartHandshake, RefreshCw, Clock } from 'lucide-react';

interface ValuePropItem {
  title: string;
  description: string;
  icon?: string;
}

interface ValuePropsProps {
  customItems?: ValuePropItem[];
  customTitle?: string;
  customSubtitle?: string;
  columnsDesktop?: number;
  contentAlign?: 'left' | 'center' | 'right';
  containerWidth?: 'contained' | 'full' | 'full_width';
  cardStyle?: 'minimal' | 'bordered' | 'tinted';
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
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
    description: 'Complimentary express delivery with hassle-free doorstep returns.',
  },
];

export function ValueProps({
  customItems,
  customTitle,
  customSubtitle,
  columnsDesktop = 4,
  contentAlign = 'center',
  containerWidth = 'contained',
  cardStyle = 'bordered',
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
}: ValuePropsProps = {}) {
  const promises = customItems && customItems.length > 0 ? customItems : DEFAULT_PROMISES;

  const isFullWidth = containerWidth === 'full' || containerWidth === 'full_width';
  const containerClass = isFullWidth ? 'w-full px-4 sm:px-8 md:px-12' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const dCols = Math.min(Math.max(columnsDesktop, 1), 6);
  const gridColsClass =
    dCols === 1
      ? 'grid-cols-1'
      : dCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : dCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : dCols === 5
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      : dCols === 6
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  const headerAlignClass =
    contentAlign === 'left'
      ? 'text-left max-w-2xl mb-8'
      : contentAlign === 'right'
      ? 'text-right max-w-2xl ml-auto mb-8'
      : 'text-center max-w-2xl mx-auto mb-8';

  return (
    <section
      className="bg-[#FAF6F2] border-b border-[#E8DED8] py-8 select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className={containerClass}>
        {customTitle && (
          <div className={headerAlignClass}>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#111111]" style={{ color: textColor || undefined }}>
              {customTitle}
            </h3>
            {customSubtitle && (
              <p className="text-xs sm:text-sm text-[#777777] mt-1 font-sans" style={{ color: textColor ? `${textColor}cc` : undefined }}>
                {customSubtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridColsClass} gap-6`}>
          {promises.map((item, idx) => {
            const IconComponent = (item.icon && ICON_MAP[item.icon.toLowerCase()]) || Sparkles;

            const cardClasses =
              cardStyle === 'tinted'
                ? 'bg-[#111111] text-white border border-white/10 rounded-xl shadow-md p-4'
                : cardStyle === 'minimal'
                ? 'bg-transparent border-0 p-2'
                : 'bg-[#FFFDFC] border border-[#E8DED8] p-3';

            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 transition-all ${cardClasses}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  cardStyle === 'tinted'
                    ? 'bg-white/10 border border-white/20 text-[#E8B8B5]'
                    : 'bg-[#F8F1EA] border border-[#E8DED8] text-[#B77A68]'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${
                    cardStyle === 'tinted' ? 'text-white' : 'text-[#111111]'
                  }`} style={{ color: textColor || undefined }}>
                    {item.title}
                  </h4>
                  <p className={`text-xs mt-0.5 font-sans leading-relaxed ${
                    cardStyle === 'tinted' ? 'text-slate-300' : 'text-[#777777]'
                  }`} style={{ color: textColor ? `${textColor}cc` : undefined }}>
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

