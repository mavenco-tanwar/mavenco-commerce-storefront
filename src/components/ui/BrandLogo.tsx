'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}: BrandLogoProps) {
  const isLight = variant === 'light';

  // Size configurations
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;
  const width = 240 * scale;
  const height = (showTagline ? 54 : 42) * scale;

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90 ${className}`}
      aria-label="JQ Trends - Home"
    >
      <svg
        viewBox="0 0 260 56"
        fill="none"
        width={width}
        height={height}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="roseGoldLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CF9584" />
            <stop offset="50%" stopColor="#B77A68" />
            <stop offset="100%" stopColor="#9A6050" />
          </linearGradient>
        </defs>

        {/* Monogram Crest */}
        <g transform="translate(2, 4)">
          <circle
            cx="24"
            cy="24"
            r="23"
            stroke="url(#roseGoldLogo)"
            strokeWidth="1.2"
            fill={isLight ? '#1F1C1B' : '#FFFDFC'}
          />
          <circle
            cx="24"
            cy="24"
            r="20.5"
            stroke={isLight ? '#3D3430' : '#E8DED8'}
            strokeWidth="0.75"
            strokeDasharray="2 2"
            fill="none"
          />

          {/* Letter J */}
          <path
            d="M20 15 V28 C20 31.5 18 33.5 15 33.5 C13.5 33.5 12.5 32.5 12 31.5"
            stroke="url(#roseGoldLogo)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Letter Q */}
          <ellipse
            cx="27.5"
            cy="23"
            rx="7"
            ry="8.5"
            stroke={isLight ? '#FFFFFF' : '#111111'}
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M31 28 L36 33"
            stroke="url(#roseGoldLogo)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Rose-gold crest gem */}
          <polygon points="24,8 25.5,10.5 24,13 22.5,10.5" fill="url(#roseGoldLogo)" />
        </g>

        {/* Wordmark */}
        <g transform="translate(60, 4)">
          <text
            x="0"
            y="26"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="23"
            fontWeight="700"
            letterSpacing="2.5"
            fill={isLight ? '#FFFDFC' : '#111111'}
          >
            JQ{' '}
            <tspan fill="url(#roseGoldLogo)" fontWeight="400">
              TRENDS
            </tspan>
          </text>

          {showTagline && (
            <text
              x="1"
              y="40"
              fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="3"
              fill={isLight ? '#D89F9C' : '#777777'}
            >
              STYLE THAT SPEAKS YOU
            </text>
          )}
        </g>
      </svg>
    </Link>
  );
}
