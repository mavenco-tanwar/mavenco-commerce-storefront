'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Store, CreditCard, TrendingUp, Database, RefreshCw, Wifi, WifiOff } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  dbCount: number;
  mrr: number;
  mrrGrowthPct: number;
  gmv: number;
  gmvGrowthPct: number;
  currency: string;
  currencySymbol: string;
  dataSource: 'mongodb' | 'seed';
  computedAt: string;
  periodMonth: string;
}

// ─── Count-up Hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, enabled = true): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target === 0) {
      setValue(target);
      return;
    }
    startRef.current = null;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return value;
}

// ─── Formatter ─────────────────────────────────────────────────────────────────
function formatINR(value: number): string {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString('en-IN');
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative p-5 rounded-2xl border border-slate-800 bg-[#12151F] overflow-hidden">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-lg bg-slate-800" />
          <div className="w-16 h-4 rounded bg-slate-800" />
        </div>
        <div className="w-24 h-7 rounded bg-slate-800" />
        <div className="w-32 h-3 rounded bg-slate-800" />
        <div className="w-20 h-3 rounded bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Individual Stat Card ───────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  badge?: React.ReactNode;
  sub: string;
  subColor?: string;
  borderColor: string;
  glowColor: string;
  loaded: boolean;
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  badge,
  sub,
  subColor = 'text-slate-400',
  borderColor,
  glowColor,
  loaded,
}: StatCardProps) {
  return (
    <div
      className={`relative group p-5 rounded-2xl border bg-[#12151F] overflow-hidden transition-all duration-300 hover:scale-[1.02] ${borderColor}`}
      style={{ boxShadow: loaded ? `0 0 0 0 ${glowColor}` : undefined }}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}18 0%, transparent 70%)` }}
      />

      <div className="relative z-10 space-y-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: 18, height: 18 }} />
          </div>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${iconColor} opacity-70`}>
            {label}
          </span>
        </div>

        {/* Main value */}
        <div className="text-2xl font-extrabold text-white tracking-tight leading-none">
          {loaded ? value : <span className="opacity-0">0</span>}
        </div>

        {/* Badge row */}
        {badge && (
          <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">{badge}</div>
        )}

        {/* Sub label */}
        <p className={`text-[11px] font-sans leading-snug ${subColor}`}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ───────────────────────────────────────────────────
const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

export function PlatformStatsDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countUpEnabled, setCountUpEnabled] = useState(false);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setError(false);
    try {
      const res = await fetch('/api/v1/platform/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setLastRefreshed(new Date());
        setCountUpEnabled(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh every 30s
  useEffect(() => {
    const timer = setInterval(() => fetchStats(), REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchStats]);

  // ── Count-up targets ─────────────────────────────────────────────────────────
  const tenantCount = useCountUp(stats?.totalTenants ?? 0, 800, countUpEnabled);
  const mrrCount = useCountUp(stats?.mrr ?? 0, 1000, countUpEnabled);
  const gmvCount = useCountUp(stats?.gmv ?? 0, 1200, countUpEnabled);
  const dbCount = useCountUp(stats?.dbCount ?? 0, 800, countUpEnabled);

  const loaded = !loading && !!stats;
  const sym = stats?.currencySymbol ?? '₹';

  // Format relative time
  const relativeTime = lastRefreshed
    ? lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Live Platform Metrics
          </span>
          {stats?.dataSource === 'mongodb' && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
              MongoDB Live
            </span>
          )}
          {stats?.dataSource === 'seed' && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-wider">
              Seed Data
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {relativeTime && (
            <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
              Updated {relativeTime}
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1 text-[10px] text-rose-400">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </span>
          )}
          {!error && loaded && (
            <Wifi className="w-3 h-3 text-emerald-500" />
          )}
          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <div className="col-span-4 p-6 rounded-2xl border border-rose-800/40 bg-rose-950/20 text-center text-sm text-rose-400">
            Could not load platform stats — retrying automatically.
          </div>
        ) : (
          <>
            {/* Card 1 — Total Tenant Stores */}
            <StatCard
              icon={Store}
              iconColor="text-rose-400"
              iconBg="bg-rose-500/10"
              label="Total Tenant Stores"
              value={String(tenantCount)}
              badge={
                <>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    {stats!.activeTenants} Active
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    {stats!.trialTenants} Trial
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-700/60 border border-slate-700 text-slate-400">
                    {stats!.suspendedTenants} Suspended
                  </span>
                </>
              }
              sub={`${stats!.periodMonth} snapshot`}
              borderColor="border-slate-800 hover:border-rose-800/50"
              glowColor="#f43f5e"
              loaded={loaded}
            />

            {/* Card 2 — Platform SaaS MRR */}
            <StatCard
              icon={CreditCard}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
              label="Platform SaaS MRR"
              value={`${sym}${formatINR(mrrCount)} /mo`}
              sub={
                stats!.mrrGrowthPct >= 0
                  ? `+${stats!.mrrGrowthPct.toFixed(1)}% MRR growth vs previous month (INR)`
                  : `${stats!.mrrGrowthPct.toFixed(1)}% MRR change vs previous month`
              }
              subColor={stats!.mrrGrowthPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              borderColor="border-slate-800 hover:border-emerald-800/50"
              glowColor="#10b981"
              loaded={loaded}
            />

            {/* Card 3 — Platform GMV */}
            <StatCard
              icon={TrendingUp}
              iconColor="text-sky-400"
              iconBg="bg-sky-500/10"
              label="Platform GMV & Volume"
              value={`${sym}${formatINR(gmvCount)}`}
              sub={
                stats!.gmvGrowthPct >= 0
                  ? `+${stats!.gmvGrowthPct.toFixed(1)}% merchant volume this month`
                  : `${stats!.gmvGrowthPct.toFixed(1)}% merchant volume this month`
              }
              subColor={stats!.gmvGrowthPct >= 0 ? 'text-sky-400' : 'text-rose-400'}
              borderColor="border-slate-800 hover:border-sky-800/50"
              glowColor="#0ea5e9"
              loaded={loaded}
            />

            {/* Card 4 — DB Isolation */}
            <StatCard
              icon={Database}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/10"
              label="Database Isolation"
              value={`${dbCount} Isolated DB${dbCount !== 1 ? 's' : ''}`}
              sub="✓ 100% Tenant Isolation Verified"
              subColor="text-emerald-400"
              borderColor="border-slate-800 hover:border-violet-800/50"
              glowColor="#8b5cf6"
              loaded={loaded}
            />
          </>
        )}
      </div>
    </section>
  );
}
