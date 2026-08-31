'use client';

import React from 'react';
import { Check, X, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export function PlatformComparisonMatrix() {
  const comparisonData = [
    {
      feature: 'Transaction Commission',
      mavenco: '0% (Keep 100% Profits)',
      shopify: 'Up to 2.0% per sale',
      woo: 'Payment Gateway only',
      custom: '0%',
      highlight: true,
    },
    {
      feature: 'Global Edge TTFB Speed',
      mavenco: '< 50ms (Next.js 16 Edge)',
      shopify: '~250ms - 450ms (Liquid PHP)',
      woo: '400ms - 900ms (Monolith PHP)',
      custom: '< 100ms',
      highlight: true,
    },
    {
      feature: 'Built-in Drag & Drop Visual CMS',
      mavenco: true,
      shopify: 'Requires Paid App ($39/mo)',
      woo: 'Requires Elementor ($99/yr)',
      custom: false,
    },
    {
      feature: 'Dual Custom Domains (Store + Admin)',
      mavenco: true,
      shopify: 'myshopify.com admin required',
      woo: 'Shared wp-admin URL',
      custom: true,
    },
    {
      feature: 'AI SEO & Copywriting Studio',
      mavenco: true,
      shopify: 'Requires App ($29/mo)',
      woo: 'Requires Plugin',
      custom: false,
    },
    {
      feature: 'Dedicated Database Isolation',
      mavenco: true,
      shopify: false,
      woo: 'Self-Managed (Vulnerable)',
      custom: true,
    },
    {
      feature: 'App Subscription Bloat',
      mavenco: 'Zero ($0/mo all-in-one)',
      shopify: '$150 - $400 / month',
      woo: 'Plugin conflict overhead',
      custom: 'High engineering cost',
      highlight: true,
    },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Architecture Benchmark
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Why Enterprise Brands Choose Mavenco
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Compare our modern headless architecture against traditional legacy platforms and see why agile brands are migrating.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/3">
                Platform Capability
              </th>
              <th className="py-4 px-4 font-extrabold text-emerald-400 bg-emerald-950/30 rounded-t-2xl border-t border-x border-emerald-500/30 text-center w-1/4">
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Mavenco Commerce</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-slate-300 text-center w-1/5">
                Shopify Plus
              </th>
              <th className="py-4 px-4 font-bold text-slate-400 text-center w-1/5">
                WooCommerce
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {comparisonData.map((row, idx) => (
              <tr
                key={idx}
                className={row.highlight ? 'bg-slate-900/30' : 'hover:bg-slate-900/20 transition-colors'}
              >
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  {row.feature}
                </td>

                {/* Mavenco Column */}
                <td className="py-3.5 px-4 text-center font-bold text-emerald-300 bg-emerald-950/20 border-x border-emerald-500/20">
                  {typeof row.mavenco === 'boolean' ? (
                    <div className="flex items-center justify-center">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ) : (
                    <span>{row.mavenco}</span>
                  )}
                </td>

                {/* Shopify Column */}
                <td className="py-3.5 px-4 text-center text-slate-400">
                  {typeof row.shopify === 'boolean' ? (
                    <div className="flex items-center justify-center">
                      {row.shopify ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400/60" />
                      )}
                    </div>
                  ) : (
                    <span>{row.shopify}</span>
                  )}
                </td>

                {/* WooCommerce Column */}
                <td className="py-3.5 px-4 text-center text-slate-400">
                  {typeof row.woo === 'boolean' ? (
                    <div className="flex items-center justify-center">
                      {row.woo ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400/60" />
                      )}
                    </div>
                  ) : (
                    <span>{row.woo}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
