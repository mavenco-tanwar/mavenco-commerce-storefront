/**
 * Module 38: Tenant Admin - Visual Page Builder Route
 * Full Elementor-style visual editor mounted for the tenant administrator.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VisualPageBuilder } from '@/components/page-builder/VisualPageBuilder';
import { ensurePageDocument } from '@/lib/page-builder/adapter';
import { PageDocument } from '@/lib/page-builder/types';
import { Loader2 } from 'lucide-react';

export default function TenantAdminPageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = (params?.pageId as string) || '';

  const [pageDoc, setPageDoc] = useState<PageDocument | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pageId) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/content/pages/${pageId}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setPageDoc(ensurePageDocument(json.data));
          }
        }

        // Load versions
        const verRes = await fetch(`/api/v1/content/pages/${pageId}/versions`);
        if (verRes.ok) {
          const verJson = await verRes.json();
          if (verJson?.data) {
            setVersions(verJson.data);
          }
        }
      } catch (err) {
        console.error('Failed to load page for builder:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [pageId]);

  const handleSaveDraft = async (updated: PageDocument) => {
    await fetch(`/api/v1/content/pages/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  };

  const handlePublishLive = async (published: PageDocument) => {
    await fetch(`/api/v1/content/pages/${pageId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: published.content }),
    });

    // Refresh versions
    const verRes = await fetch(`/api/v1/content/pages/${pageId}/versions`);
    if (verRes.ok) {
      const verJson = await verRes.json();
      if (verJson?.data) {
        setVersions(verJson.data);
      }
    }
  };

  const handleRollback = async (versionNumber: number) => {
    const res = await fetch(`/api/v1/content/pages/${pageId}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: versionNumber }),
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#111111] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs tracking-wider uppercase font-medium">Initializing Visual Page Builder...</p>
      </div>
    );
  }

  if (!pageDoc) {
    return (
      <div className="h-screen w-screen bg-[#111111] flex flex-col items-center justify-center text-slate-400 gap-4">
        <p className="text-sm font-semibold text-white">Storefront page document not found.</p>
        <button
          onClick={() => router.push('/admin/storefront/pages')}
          className="px-4 py-2 bg-zinc-800 text-white text-xs font-semibold rounded-lg hover:bg-zinc-700"
        >
          Return to Storefront Pages
        </button>
      </div>
    );
  }

  return (
    <VisualPageBuilder
      initialDocument={pageDoc}
      versions={versions}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublishLive}
      onRollback={handleRollback}
    />
  );
}
