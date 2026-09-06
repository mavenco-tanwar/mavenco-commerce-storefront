import { ThemeDocument } from '../types/theme.types';

function extractGoogleFontUrl(fonts: (string | undefined)[]): string {
  const families: string[] = [];
  const genericFonts = new Set([
    'sans-serif',
    'serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    '-apple-system',
    'blinkmacsystemfont',
    'segoe ui',
    'roboto',
    'helvetica neue',
    'arial',
    'inherit',
    'initial',
  ]);

  for (const f of fonts) {
    if (!f) continue;
    const cleanFirst = f.split(',')[0].replace(/['"]/g, '').trim();
    if (!cleanFirst) continue;
    if (genericFonts.has(cleanFirst.toLowerCase())) continue;
    const formatted = cleanFirst.replace(/\s+/g, '+');
    if (!families.includes(formatted)) {
      families.push(formatted);
    }
  }

  if (families.length === 0) return '';
  const query = families.map((fam) => `family=${fam}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700`).join('&');
  return `@import url('https://fonts.googleapis.com/css2?${query}&display=swap');\n`;
}

export function generateThemeCssVariables(theme: ThemeDocument): string {
  const c = theme.colors || ({} as any);
  const t = theme.typography || ({} as any);
  const b = theme.buttons || ({} as any);
  const f = theme.forms || ({} as any);
  const cd = theme.cards || ({} as any);
  const r = theme.radius || ({} as any);
  const s = theme.spacing || ({} as any);
  const sh = theme.shadows || ({} as any);
  const l = theme.layout || ({} as any);

  const fontImports = extractGoogleFontUrl([
    t.headingFont,
    t.bodyFont,
    t.navigationFont,
    t.buttonFont,
  ]);

  const primaryBtn = b.variants?.primary || {};
  const secondaryBtn = b.variants?.secondary || {};
  const outlineBtn = b.variants?.outline || {};

  return `
  ${fontImports}
  :root {
    /* Semantic Dynamic Colors */
    --theme-color-primary: ${c.primary || '#111111'};
    --theme-color-primary-hover: ${c.primaryHover || '#000000'};
    --theme-color-secondary: ${c.secondary || '#E2E8F0'};
    --theme-color-secondary-hover: ${c.secondaryHover || '#CBD5E1'};
    --theme-color-accent: ${c.accent || '#B77A68'};
    --theme-color-accent-hover: ${c.accentHover || '#9A6050'};
    --theme-color-background: ${c.background || '#FFFDFC'};
    --theme-color-surface: ${c.surface || '#FFFFFF'};
    --theme-color-surface-secondary: ${c.surfaceSecondary || '#F8F1EA'};
    --theme-color-text: ${c.text || '#111111'};
    --theme-color-text-secondary: ${c.textSecondary || '#57534E'};
    --theme-color-text-muted: ${c.textMuted || '#A8A29E'};
    --theme-color-heading: ${c.heading || '#111111'};
    --theme-color-border: ${c.border || '#E8DED8'};
    --theme-color-border-light: ${c.borderLight || '#F5F5F4'};
    --theme-color-success: ${c.success || '#10B981'};
    --theme-color-warning: ${c.warning || '#F59E0B'};
    --theme-color-error: ${c.error || '#EF4444'};
    --theme-color-info: ${c.info || '#3B82F6'};
    --theme-color-overlay: ${c.overlay || 'rgba(0, 0, 0, 0.65)'};

    /* Standard Core Overrides mapped to Dynamic Theme */
    --background: ${c.background || '#FFFDFC'};
    --foreground: ${c.text || '#111111'};
    --color-primary: ${c.primary || '#111111'};
    --color-primary-hover: ${c.primaryHover || '#000000'};
    --color-secondary: ${c.secondary || '#E2E8F0'};
    --color-secondary-hover: ${c.secondaryHover || '#CBD5E1'};
    --color-accent: ${c.accent || '#B77A68'};
    --color-accent-hover: ${c.accentHover || '#9A6050'};
    --color-background: ${c.background || '#FFFDFC'};
    --color-surface: ${c.surface || '#FFFFFF'};
    --color-surface-secondary: ${c.surfaceSecondary || '#F8F1EA'};
    --color-heading: ${c.heading || '#111111'};
    --color-text: ${c.text || '#111111'};
    --color-text-secondary: ${c.textSecondary || '#57534E'};
    --color-text-muted: ${c.textMuted || '#A8A29E'};
    --color-border: ${c.border || '#E8DED8'};
    --color-border-light: ${c.borderLight || '#F5F5F4'};
    --color-success: ${c.success || '#10B981'};
    --color-warning: ${c.warning || '#F59E0B'};
    --color-error: ${c.error || '#EF4444'};

    /* Aliases for Storefront Components */
    --color-ivory: ${c.background || '#FFFDFC'};
    --color-cream: ${c.surfaceSecondary || '#F8F1EA'};
    --color-cream-dark: ${c.surfaceSecondary || '#F0E6DC'};
    --color-surface-warm: ${c.surfaceSecondary || '#FAF6F2'};
    --color-black-rich: ${c.heading || '#111111'};
    --color-charcoal: ${c.heading || '#222222'};
    --color-rose-gold: ${c.accent || '#B77A68'};
    --color-rose-gold-light: ${c.accentHover || '#CF9584'};
    --color-rose-gold-dark: ${c.accentHover || '#9A6050'};
    --color-border-linen: ${c.border || '#E8DED8'};
    --color-border-subtle: ${c.borderLight || '#F0E9E4'};

    /* Typography Fonts */
    --theme-font-heading: ${t.headingFont || 'Playfair Display, Georgia, serif'};
    --theme-font-body: ${t.bodyFont || 'Plus Jakarta Sans, system-ui, sans-serif'};
    --theme-font-navigation: ${t.navigationFont || t.bodyFont || 'Plus Jakarta Sans, system-ui, sans-serif'};
    --theme-font-button: ${t.buttonFont || t.bodyFont || 'Plus Jakarta Sans, system-ui, sans-serif'};
    --font-serif: ${t.headingFont || 'Playfair Display, Georgia, serif'};
    --font-sans: ${t.bodyFont || 'Plus Jakarta Sans, system-ui, sans-serif'};

    /* Headings Scale */
    --theme-h1-size: ${t.h1?.fontSize || '48px'};
    --theme-h1-weight: ${t.h1?.fontWeight || '700'};
    --theme-h1-line-height: ${t.h1?.lineHeight || '1.15'};
    --theme-h1-letter-spacing: ${t.h1?.letterSpacing || '-0.02em'};

    --theme-h2-size: ${t.h2?.fontSize || '36px'};
    --theme-h2-weight: ${t.h2?.fontWeight || '700'};
    --theme-h2-line-height: ${t.h2?.lineHeight || '1.2'};

    --theme-h3-size: ${t.h3?.fontSize || '24px'};
    --theme-h3-weight: ${t.h3?.fontWeight || '600'};
    --theme-h3-line-height: ${t.h3?.lineHeight || '1.3'};

    --theme-body-size: ${t.body?.fontSize || '15px'};
    --theme-body-line-height: ${t.body?.lineHeight || '1.6'};

    /* Button Defaults */
    --theme-btn-radius: ${b.borderRadius || '8px'};
    --theme-btn-primary-bg: ${primaryBtn.background || c.primary || '#111111'};
    --theme-btn-primary-text: ${primaryBtn.textColor || '#FFFFFF'};
    --theme-btn-primary-hover-bg: ${primaryBtn.hoverBackground || c.primaryHover || '#000000'};
    --theme-btn-primary-hover-text: ${primaryBtn.hoverTextColor || '#FFFFFF'};

    --theme-btn-secondary-bg: ${secondaryBtn.background || c.surfaceSecondary || '#F5F5F4'};
    --theme-btn-secondary-text: ${secondaryBtn.textColor || c.text || '#1C1917'};
    --theme-btn-secondary-hover-bg: ${secondaryBtn.hoverBackground || c.border || '#E7E5E4'};
    --theme-btn-secondary-hover-text: ${secondaryBtn.hoverTextColor || c.heading || '#0C0A09'};
    --theme-btn-secondary-border: ${secondaryBtn.border || c.border || '#E7E5E4'};

    --theme-btn-outline-text: ${outlineBtn.textColor || c.text || '#111111'};
    --theme-btn-outline-border: ${outlineBtn.border || c.text || '#111111'};

    /* Form Defaults */
    --theme-form-bg: ${f.background || '#FFFFFF'};
    --theme-form-text: ${f.text || '#1C1917'};
    --theme-form-border: ${f.border || '#E7E5E4'};
    --theme-form-focus-border: ${f.focusBorder || c.primary || '#111827'};
    --theme-form-focus-shadow: ${f.focusShadow || '0 0 0 3px rgba(17, 24, 39, 0.1)'};
    --theme-form-radius: ${f.borderRadius || '10px'};
    --theme-form-height: ${f.height || '46px'};

    /* Card Defaults */
    --theme-card-bg: ${cd.background || '#FFFFFF'};
    --theme-card-border: ${cd.border || '#E7E5E4'};
    --theme-card-radius: ${cd.borderRadius || '10px'};
    --theme-card-shadow: ${cd.shadow || '0 4px 20px -2px rgba(0, 0, 0, 0.05)'};
    --theme-card-hover-shadow: ${cd.hoverShadow || '0 12px 30px -4px rgba(0, 0, 0, 0.12)'};

    /* Radius Tokens */
    --theme-radius-none: ${r.none || '0px'};
    --theme-radius-xs: ${r.xs || '3px'};
    --theme-radius-sm: ${r.sm || '6px'};
    --theme-radius-md: ${r.md || '10px'};
    --theme-radius-lg: ${r.lg || '14px'};
    --theme-radius-xl: ${r.xl || '20px'};
    --theme-radius-2xl: ${r['2xl'] || '28px'};
    --theme-radius-full: ${r.full || '9999px'};

    /* Spacing Tokens */
    --theme-space-xs: ${s.xs || '4px'};
    --theme-space-sm: ${s.sm || '8px'};
    --theme-space-md: ${s.md || '16px'};
    --theme-space-lg: ${s.lg || '24px'};
    --theme-space-xl: ${s.xl || '32px'};
    --theme-space-2xl: ${s['2xl'] || '48px'};
    --theme-space-3xl: ${s['3xl'] || '64px'};
    --theme-space-4xl: ${s['4xl'] || '96px'};

    /* Shadow Tokens */
    --theme-shadow-sm: ${sh.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
    --theme-shadow-md: ${sh.md || '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)'};
    --theme-shadow-lg: ${sh.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'};
    --theme-shadow-xl: ${sh.xl || '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'};
    --theme-shadow-2xl: ${sh['2xl'] || '0 25px 50px -12px rgba(0, 0, 0, 0.25)'};

    /* Layout Tokens */
    --theme-container-small: ${l.container?.small || '960px'};
    --theme-container-medium: ${l.container?.medium || '1200px'};
    --theme-container-large: ${l.container?.large || '1440px'};
    --theme-container-full: ${l.container?.full || '100%'};
  }

  ${theme.customCss || ''}
  `.trim();
}

export function resolveThemeStyle(
  componentVal: string | undefined,
  sectionVal: string | undefined,
  themeVal: string | undefined,
  platformDefault: string
): string {
  if (componentVal && componentVal.trim() !== '' && componentVal !== 'inherit') return componentVal;
  if (sectionVal && sectionVal.trim() !== '' && sectionVal !== 'inherit') return sectionVal;
  if (themeVal && themeVal.trim() !== '') return themeVal;
  return platformDefault;
}
