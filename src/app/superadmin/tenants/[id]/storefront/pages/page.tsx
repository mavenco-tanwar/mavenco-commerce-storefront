/**
 * Module 38: Superadmin Storefront Pages Management Route
 * Direct routing target for /superadmin/tenants/[id]/storefront/pages
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Layout,
  Edit,
  ExternalLink,
  Plus,
  Loader2,
  Sparkles,
  History,
} from 'lucide-react';
import { PageDocument } from '@/lib/page-builder/types';

export default function SuperadminStorefrontPagesList() {
  const params = useParams();
  const tenantId = (params?.id as string) || '';

  const [pages, setPages] = useState<PageDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/content/pages?tenant=${tenantId}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setPages(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load superadmin tenant pages:', err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [tenantId]);

  return (
    <div className="min-h-screen bg-[#0E1015] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href={`/superadmin/tenants/${tenantId}/storefront`}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  Tenant: {tenantId}
                </span>
                <h1 className="text-lg font-bold text-white">Storefront Pages</h1>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Visual Page Builder documents with full drag-and-drop hierarchy for this tenant.
              </p>
            </div>
          </div>

          <Link
            href={`/superadmin/tenants/${tenantId}/storefront`}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
          >
            Storefront Overview
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <p className="text-xs">Loading tenant pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 space-y-3">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No pages created for this tenant yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Title & Slug</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Version</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/20 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[11px] font-mono text-zinc-500">/{p.slug}</div>
                    </td>
                    <td className="py-4 px-6 capitalize text-zinc-400">{p.type || 'standard'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {p.status || 'draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-400 text-xs">v{p.version || 1}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/superadmin/tenants/${tenantId}/storefront/pages/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold transition border border-amber-500/30"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Visual Builder</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
