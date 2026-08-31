'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, Gauge, CheckCircle2, RefreshCw, Globe, Sparkles, ShieldCheck } from 'lucide-react';

interface BenchmarkData {
  domain: string;
  isMavenco: boolean;
  platformDetected: string;
  measuredTtfbMs: number;
  fcpSeconds: number;
  mavencoTtfbMs?: number;
  mavencoFcpSeconds?: number;
  conversionLiftPercent?: number;
  annualFeeSavings?: string;
  message?: string;
  lighthouseScore?: number;
}

export function StoreSpeedTester() {
  const [storeUrl, setStoreUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResult, setTestResult] = useState<BenchmarkData | null>(null);

  const sampleUrls = [
    { label: 'Shopify Store', url: 'gymshark.com' },
    { label: 'WooCommerce Store', url: 'sample-apparel.com' },
    { label: 'Mavenco Edge Store', url: 'mavenco-storefront.vercel.app' },
  ];

  const handleRunSpeedTest = async (urlToTest?: string) => {
    const target = urlToTest || storeUrl;
    if (!target.trim()) return;

    if (urlToTest) {
      setStoreUrl(urlToTest);
    }

    setIsTesting(true);
    setProgress(20);
    setTestResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 85 ? 85 : prev + 20));
    }, 200);

    try {
      const res = await fetch(`/api/v1/platform/benchmark?url=${encodeURIComponent(target)}`).then((r) => r.json());
      clearInterval(interval);
      setProgress(100);

      if (res?.success && res.data) {
        setTestResult(res.data);
      }
    } catch (err) {
      console.warn('Benchmark error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Edge Speed Benchmark (Live Server Telemetry)</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Test Your Current Store&apos;s Edge Latency
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your current Shopify, WooCommerce, or custom storefront URL to compare live TTFB against Mavenco&apos;s Next.js 16 Edge runtime.
        </p>
      </div>

      {/* URL Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunSpeedTest();
        }}
        className="max-w-2xl mx-auto space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-[#06080E] p-2 rounded-2xl border border-slate-800 focus-within:border-emerald-500/60 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1.5 text-slate-400 flex-1 w-full min-w-0">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              required
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="e.g. yourbrand.com or yourstore.myshopify.com"
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono truncate"
            />
          </div>

          <button
            type="submit"
            disabled={isTesting}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Benchmarking ({progress}%)...</span>
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" />
                <span>Run Speed Benchmark</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-400">
          <span className="text-slate-500 font-medium">Try quick test:</span>
          {sampleUrls.map((s) => (
            <button
              key={s.url}
              type="button"
              onClick={() => handleRunSpeedTest(s.url)}
              className="px-2.5 py-1 rounded-lg bg-[#0E111A] hover:bg-[#141724] border border-slate-800 text-slate-300 hover:text-white transition-all font-mono"
            >
              {s.label} ({s.url})
            </button>
          ))}
        </div>
      </form>

      {/* Progress Bar when testing */}
      {isTesting && (
        <div className="max-w-md mx-auto space-y-2 text-center">
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Sending live HTTP telemetry probes to edge nodes...
          </p>
        </div>
      )}

      {/* Test Results Card */}
      {testResult && (
        <div className="max-w-4xl mx-auto bg-[#07090F] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
          {testResult.isMavenco ? (
            /* Result Variant A: Tested Store is Already Mavenco */
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified: Powered by Mavenco Edge Engine</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                <span className="font-mono text-emerald-300 break-all">{testResult.domain}</span> is Running at Maximum Velocity!
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                {testResult.message}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-2xl mx-auto text-left">
                <div className="p-4 bg-[#0F121C] rounded-xl border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Live Edge Latency</div>
                  <div className="text-2xl font-black text-emerald-400">{testResult.measuredTtfbMs}ms</div>
                  <div className="text-[10px] text-emerald-300 font-medium">Sub-30ms Global TTFB</div>
                </div>

                <div className="p-4 bg-[#0F121C] rounded-xl border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Lighthouse Performance</div>
                  <div className="text-2xl font-black text-amber-400">{testResult.lighthouseScore} / 100</div>
                  <div className="text-[10px] text-amber-300 font-medium">Instant Visual Paint</div>
                </div>

                <div className="p-4 bg-[#0F121C] rounded-xl border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">SaaS Commission</div>
                  <div className="text-2xl font-black text-white">0% Fee</div>
                  <div className="text-[10px] text-slate-400">Direct Gateway Payout</div>
                </div>
              </div>
            </div>
          ) : (
            /* Result Variant B: Tested Store is Legacy Third-Party */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Benchmark Target</span>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <h4 className="font-bold text-white text-base font-mono break-all">
                      {testResult.domain}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {testResult.platformDetected}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{testResult.conversionLiftPercent}% Est. Mobile Conversion Lift</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric 1: TTFB */}
                <div className="p-4 bg-[#0F121C] rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time to First Byte (TTFB)</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Current Store:</span>
                      <span className="text-rose-400 font-bold">{testResult.measuredTtfbMs}ms (Slow)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Mavenco Edge:</span>
                      <span className="text-emerald-400 font-bold">{testResult.mavencoTtfbMs}ms (Instant)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium pt-1">
                    {(testResult.measuredTtfbMs / (testResult.mavencoTtfbMs || 26)).toFixed(1)}x Faster Server Response
                  </div>
                </div>

                {/* Metric 2: First Contentful Paint */}
                <div className="p-4 bg-[#0F121C] rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">First Contentful Paint (FCP)</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Current Store:</span>
                      <span className="text-amber-400 font-bold">{testResult.fcpSeconds.toFixed(2)}s</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Mavenco Edge:</span>
                      <span className="text-emerald-400 font-bold">{testResult.mavencoFcpSeconds?.toFixed(2)}s</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium pt-1">
                    Sub-half second visual load
                  </div>
                </div>

                {/* Metric 3: Zero Commission Savings */}
                <div className="p-4 bg-[#0F121C] rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">0% Commission Gain</span>
                  <div className="text-xl font-bold text-white pt-1">
                    {testResult.annualFeeSavings}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Annual revenue retained vs Shopify 2% transaction fee
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
