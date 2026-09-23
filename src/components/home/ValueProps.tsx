import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Tag,
  Truck,
  ShieldCheck,
  HeartHandshake,
  RefreshCw,
  Clock,
  Star,
  Gem,
  Lock,
  CheckCircle2,
  Zap,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';
import { SectionTypographyProps, getSectionTypographyStyles } from '@/lib/section-typography';

interface ValuePropItem {
  title: string;
  description: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  titleColor?: string;
  descColor?: string;
}

interface ValuePropsProps extends SectionTypographyProps {
  customItems?: ValuePropItem[];
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  columnsDesktop?: number;
  contentAlign?: 'left' | 'center' | 'right';
  containerWidth?: 'contained' | 'full' | 'full_width';
  cardStyle?: 'minimal' | 'bordered' | 'tinted';
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  tertiaryBtnText?: string;
  tertiaryBtnLink?: string;
  tenantSlug?: string;
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
  star: Star,
  gem: Gem,
  lock: Lock,
  check: CheckCircle2,
  zap: Zap,
  gift: Gift,
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
  customBadge,
  columnsDesktop = 4,
  contentAlign = 'center',
  containerWidth = 'contained',
  cardStyle = 'bordered',
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  tertiaryBtnText,
  tertiaryBtnLink,
  tenantSlug,
  ...typographyProps
}: ValuePropsProps = {}) {
  const promises = customItems && customItems.length > 0 ? customItems : DEFAULT_PROMISES;

  const { headingStyle, subtitleStyle, badgeStyle, primaryBtnStyle, secondaryBtnStyle, tertiaryBtnStyle } =
    getSectionTypographyStyles({
      ...typographyProps,
      textColor,
    });

  const typo = typographyProps as any;

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

  const btnAlignClass =
    contentAlign === 'left'
      ? 'justify-start'
      : contentAlign === 'right'
      ? 'justify-end'
      : 'justify-center';

  const isDarkBg =
    bgColor &&
    (bgColor.startsWith('#0') ||
      bgColor.startsWith('#1') ||
      bgColor.startsWith('#2') ||
      bgColor === 'black' ||
      bgColor.includes('17, 17, 17'));

  return (
    <section
      className="bg-[#FAF6F2] border-b border-[#E8DED8] py-12 select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className={containerClass}>
        {(customBadge || customTitle || customSubtitle) && (
          <div className={headerAlignClass}>
            {customBadge && (
              <span
                data-typography="badge"
                className="inline-block text-[11px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full mb-3 bg-[#B77A68]/10 text-[#B77A68] border border-[#B77A68]/20 shadow-xs"
                style={badgeStyle}
              >
                {customBadge}
              </span>
            )}
            {customTitle && (
              <h3
                data-typography="heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#111111]"
                style={{
                  color: textColor || undefined,
                  ...headingStyle,
                }}
              >
                {customTitle}
              </h3>
            )}
            {customSubtitle && (
              <p
                data-typography="subtitle"
                className="text-xs sm:text-sm text-[#777777] mt-2 font-sans max-w-2xl"
                style={{
                  color: textColor ? `${textColor}cc` : undefined,
                  ...subtitleStyle,
                }}
              >
                {customSubtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridColsClass} gap-6`}>
          {promises.map((item, idx) => {
            const IconComponent = (item.icon && ICON_MAP[item.icon.toLowerCase()]) || Sparkles;

            const hasCustomBg = Boolean(item.cardBgColor);
            const cardClasses = hasCustomBg
              ? 'border shadow-md rounded-xl p-5'
              : cardStyle === 'tinted' || isDarkBg
              ? 'bg-white/5 text-white border border-white/10 rounded-xl shadow-md p-5 backdrop-blur-sm'
              : cardStyle === 'minimal'
              ? 'bg-transparent border-0 p-3'
              : 'bg-[#FFFDFC] border border-[#E8DED8] p-5 rounded-xl shadow-xs';

            const defaultIconBg =
              cardStyle === 'tinted' || isDarkBg
                ? 'bg-white/10 border border-white/20 text-[#E8B8B5]'
                : 'bg-[#F8F1EA] border border-[#E8DED8] text-[#B77A68]';

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 transition-all duration-200 ${cardClasses}`}
                style={{
                  backgroundColor: item.cardBgColor || undefined,
                  borderColor: item.cardBorderColor || undefined,
                }}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    item.iconBgColor ? '' : defaultIconBg
                  }`}
                  style={{
                    backgroundColor: item.iconBgColor || undefined,
                    color: item.iconColor || undefined,
                    border: item.iconBgColor ? '1px solid rgba(255,255,255,0.15)' : undefined,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider ${
                      hasCustomBg || cardStyle === 'tinted' || isDarkBg ? 'text-white' : 'text-[#111111]'
                    }`}
                    style={{
                      fontFamily: typo.headingFontFamily ? `"${typo.headingFontFamily}", serif` : undefined,
                      color: item.titleColor || typo.headingColor || (hasCustomBg ? '#FFFFFF' : textColor || undefined),
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    data-typography="subtitle"
                    className={`text-xs mt-1 font-sans leading-relaxed ${
                      hasCustomBg || cardStyle === 'tinted' || isDarkBg ? 'text-slate-300' : 'text-[#777777]'
                    }`}
                    style={{
                      fontFamily: typo.subtitleFontFamily ? `"${typo.subtitleFontFamily}", sans-serif` : undefined,
                      color: item.descColor || typo.subtitleColor || (hasCustomBg ? '#E2E8F0' : textColor ? `${textColor}cc` : undefined),
                      fontSize: typo.subtitleFontSize || undefined,
                      lineHeight: typo.subtitleLineHeight || undefined,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons (1, 2, or 3 buttons) */}
        {(primaryBtnText || secondaryBtnText || tertiaryBtnText) && (
          <div className={`mt-10 pt-2 flex flex-wrap items-center gap-4 ${btnAlignClass}`}>
            {primaryBtnText && (
              <Link href={formatTenantHref(primaryBtnLink || '/collections', tenantSlug)}>
                <Button
                  variant="luxury-gold"
                  size="lg"
                  style={primaryBtnStyle}
                  className="min-w-[180px] group shadow-md cursor-pointer"
                >
                  <span>{primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {secondaryBtnText && (
              <Link href={formatTenantHref(secondaryBtnLink || '/about', tenantSlug)}>
                <Button
                  variant="outline"
                  size="lg"
                  style={secondaryBtnStyle}
                  className="min-w-[150px] cursor-pointer shadow-sm"
                >
                  <span>{secondaryBtnText}</span>
                </Button>
              </Link>
            )}

            {tertiaryBtnText && (
              <Link href={formatTenantHref(tertiaryBtnLink || '/contact', tenantSlug)}>
                <Button
                  variant="outline"
                  size="lg"
                  style={tertiaryBtnStyle}
                  className="min-w-[150px] cursor-pointer shadow-sm"
                >
                  <span>{tertiaryBtnText}</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}



