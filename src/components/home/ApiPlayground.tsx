'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, Code2, ArrowRight, Zap, Play, RefreshCw } from 'lucide-react';

export function ApiPlayground() {
  const [activeLang, setActiveLang] = useState<'curl' | 'nextjs' | 'python' | 'flutter'>('curl');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [latency, setLatency] = useState<number>(24);
  const [responseData, setResponseData] = useState<any>({
    status: 'success',
    tenant: 'demo',
    latencyMs: 24,
    source: 'mongodb_atlas_edge',
    data: {
      id: 'tenant_demo',
      name: 'Demo Store',
      tagline: 'Curated Modern Lifestyle & Apparel',
      currency: 'INR',
      currencySymbol: '₹',
      theme: {
        primaryColor: '#E11D48',
        accentColor: '#FB7185',
        headingFont: 'Playfair Display, serif',
      },
      partition: {
        database: 'tenant_demo_isolated',
        status: 'active',
        ssl: 'TLS 1.3 Wildcard Active',
      },
    },
  });

  const snippets = {
    curl: `curl -X GET "https://mavenco-storefront.vercel.app/api/v1/tenant-config?tenant=demo" \\
  -H "Authorization: Bearer sk_live_demo_9821" \\
  -H "Content-Type: application/json"`,

    nextjs: `// Fetch isolated tenant catalog in Next.js Server Component
import { MavencoClient } from '@mavenco/sdk';

const client = new MavencoClient({
  apiKey: process.env.MAVENCO_API_KEY,
  tenant: 'demo',
});

export async function getStoreCatalog() {
  const { products, theme } = await client.store.getCatalog({
    limit: 20,
    includeTokens: true,
  });
  return { products, theme };
}`,

    python: `# Python / FastAPI ERP Catalog Sync
import requests

url = "https://mavenco-storefront.vercel.app/api/v1/tenant-config?tenant=demo"
headers = {"Authorization": "Bearer sk_live_demo_9821"}

response = requests.get(url, headers=headers)
data = response.json()
print(f"Loaded store: {data['data']['name']} with {len(data['data']['navLinks'])} navigation categories")`,

    flutter: `// Flutter / React Native Mobile App Ingress
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<StoreConfig> fetchTenantStore() async {
  final res = await http.get(
    Uri.parse('https://mavenco-storefront.vercel.app/api/v1/tenant-config?tenant=demo'),
    headers: {'Authorization': 'Bearer sk_live_demo_9821'},
  );
  return StoreConfig.fromJson(jsonDecode(res.body)['data']);
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/v1/tenant-config?tenant=demo');
      const measured = Math.max(14, Math.round(performance.now() - start));
      setLatency(measured);
      if (res.ok) {
        const json = await res.json();
        setResponseData({
          status: 'success',
          tenant: 'demo',
          latencyMs: measured,
          source: 'mongodb_atlas_edge',
          data: json.data || json,
        });
      }
    } catch {
      const measured = Math.max(18, Math.round(performance.now() - start));
      setLatency(measured);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Headless REST API &amp; SDK Playground
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Developer-First Architecture
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Build custom mobile apps, connect legacy ERPs, or power custom POS hardware using our high-speed multi-tenant REST APIs.
        </p>
      </div>

      {/* Code & JSON Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left: Code Snippet */}
        <div className="bg-[#0A0C10] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 bg-[#12151F] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <div className="flex items-center gap-1">
                {(['curl', 'nextjs', 'python', 'flutter'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      activeLang === lang
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'nextjs' ? 'Next.js' : lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto flex-1 leading-relaxed">
            <code>{snippets[activeLang]}</code>
          </pre>

          <div className="p-3 bg-[#12151F] border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Endpoint: /api/v1/tenant-config</span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isRunning ? 'Probing...' : 'Run Live API Probe'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live JSON Output */}
        <div className="bg-[#0A0C10] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 bg-[#12151F] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Live JSON Response</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              200 OK • {latency}ms
            </span>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto flex-1 leading-relaxed bg-[#06080C] max-h-80">
            <code>{JSON.stringify(responseData, null, 2)}</code>
          </pre>

          <div className="p-3 bg-[#12151F] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cache: HIT (Vercel Global Edge)</span>
            <span className="text-emerald-400 font-mono font-bold">Zero Latency Overhead</span>
          </div>
        </div>
      </div>
    </div>
  );
}
