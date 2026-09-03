'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { formatStoreName } from '@/lib/tenant-config';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { PlatformFooter } from '@/components/layout/PlatformFooter';

interface StoreUnavailableViewProps {
  tenantSlug: string;
  isSuspended?: boolean;
}

export function StoreUnavailableView({ tenantSlug, isSuspended = false }: StoreUnavailableViewProps) {
  const displayName = formatStoreName(tenantSlug);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0C10] text-slate-100 flex flex-col justify-between select-none">
      {/* SaaS Platform Navbar */}
      <PlatformNavbar />

      {/* 404 Inactive Store Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 py-16">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-950/20">
            <ShieldAlert className="w-4 h-4" />
            <span>{isSuspended ? 'Store Suspended' : '404 • Store Not Found / Inactive'}</span>
          </div>

          {/* Heading & Details */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isSuspended ? `${displayName} is Temporarily Suspended` : `Store "${displayName}" is Inactive`}
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {isSuspended
                ? `This storefront is currently paused by the platform administrator for billing or scheduled maintenance.`
                : `The store "${tenantSlug}" does not exist, has been decommissioned or archived in the database, or the URL is incorrect.`}
            </p>
          </div>

          {/* Status Diagnostic Card */}
          <div className="p-6 rounded-2xl bg-[#12141D] border border-slate-800 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Storefront Access Governance
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {isSuspended ? 'SUSPENDED STATUS' : 'DECOMMISSIONED'}
              </span>
            </div>

            <div className="p-4 bg-[#0A0C10] rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Requested Store Slug:</span>
                <span className="font-mono text-rose-400 font-bold">{tenantSlug}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cloud Partition Status:</span>
                <span className="font-mono text-amber-300">
                  {isSuspended ? 'Temporarily Locked by Platform Administrator' : 'Decommissioned / Deleted from Database'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Storefront Protection:</span>
                <span className="text-emerald-400 font-semibold">Active (0 Data Leakage)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Platform Overview</span>
            </Link>
            <a
              href="https://mavenco-admin.vercel.app/platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
            >
              <span>Provision Store in Admin</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* SaaS Platform Footer */}
      <PlatformFooter />
    </div>
  );
}
