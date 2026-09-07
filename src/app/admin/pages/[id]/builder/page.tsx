'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BuilderShell } from '@/components/builder/BuilderShell';
import { PageBuilderDocument } from '@/types/builder.types';
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VisualBuilderRoute() {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.id as string;

  const [page, setPage] = useState<PageBuilderDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageId) return;

    setLoading(true);
    fetch(`/api/v1/content/builder/pages/${pageId}`)
      .then(async (res) => {
        if (!res.ok) {
          // If page doesn't exist yet, construct initial builder document
          return {
            data: {
              id: pageId,
              tenantId: 'lumina',
              title: pageId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
              slug: pageId,
              type: 'page',
              status: 'draft',
              version: 1,
              content: {
                version: 1,
                settings: {
                  background: '#FFFDFC',
                  backgroundColor: '#FFFDFC',
                  textColor: '#111111',
                },
                children: [
                  {
                    id: `sec_${Date.now()}`,
                    type: 'section',
                    label: 'Hero Section',
                    props: { containerWidth: 'boxed' },
                    styles: {
                      desktop: { paddingTop: '80px', paddingBottom: '80px' },
                      tablet: { paddingTop: '60px', paddingBottom: '60px' },
                      mobile: { paddingTop: '40px', paddingBottom: '40px' },
                    },
                    children: [
                      {
                        id: `head_${Date.now()}`,
                        type: 'heading',
                        props: {
                          text: pageId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                          tag: 'h1',
                        },
                        styles: {
                          desktop: { fontSize: '42px', fontWeight: '700', marginBottom: '16px' },
                          tablet: { fontSize: '32px' },
                          mobile: { fontSize: '26px' },
                        },
                      },
                      {
                        id: `text_${Date.now()}`,
                        type: 'text',
                        props: {
                          text: 'Handcrafted luxury with timeless silhouettes. Welcome to our bespoke atelier collection.',
                        },
                        styles: {
                          desktop: { fontSize: '16px', color: '#57534E', marginBottom: '24px' },
                          tablet: {},
                          mobile: {},
                        },
                      },
                      {
                        id: `btn_${Date.now()}`,
                        type: 'button',
                        props: { text: 'Explore Catalog', link: '/women' },
                        styles: {
                          desktop: { backgroundColor: '#111111', color: '#FFFFFF' },
                          tablet: {},
                          mobile: {},
                        },
                      },
                    ],
                  },
                ],
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return res.json();
      })
      .then((json) => {
        if (json?.data) {
          // Ensure structure has content.children
          const doc = json.data;
          if (!doc.content) {
            doc.content = {
              version: 1,
              settings: {},
              children: [],
            };
          }
          if (!doc.content.children) {
            doc.content.children = [];
          }
          setPage(doc);
        } else {
          setError(json?.error || 'Page not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load page');
      })
      .finally(() => setLoading(false));
  }, [pageId]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0B0D11] flex flex-col items-center justify-center text-zinc-100 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs text-zinc-400 font-mono tracking-wider">
          Initializing Visual Builder Studio...
        </p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="h-screen w-screen bg-[#0B0D11] flex flex-col items-center justify-center text-zinc-100 p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold">Could not load page</h2>
        <p className="text-xs text-zinc-400 max-w-sm">{error || 'Unknown error occurred'}</p>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pages</span>
        </Link>
      </div>
    );
  }

  return <BuilderShell initialPage={page} />;
}
