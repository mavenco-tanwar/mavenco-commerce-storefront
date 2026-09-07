'use client';

import React, { useMemo } from 'react';
import {
  PageBuilderContent,
  PageBuilderDocument,
  PageBuilderElement,
  ResponsiveDevice,
} from '@/types/builder.types';
import {
  ELEMENT_RENDERER_REGISTRY,
  RendererContext,
} from './ElementRenderers';

export interface PageRendererProps {
  document?: PageBuilderDocument | null;
  content?: PageBuilderContent | null;
  elements?: PageBuilderElement[];
  device?: ResponsiveDevice;
  product?: Record<string, any>;
  category?: Record<string, any>;
  store?: Record<string, any>;
  className?: string;
}

export function PageRenderer({
  document,
  content,
  elements,
  device = 'desktop',
  product,
  category,
  store,
  className = '',
}: PageRendererProps) {
  // Resolve active elements tree
  const activeContent = content || document?.publishedContent || document?.content;
  const rootElements = elements || activeContent?.children || [];
  const settings = activeContent?.settings || {};

  // Build recursive element rendering context
  const context: RendererContext = useMemo(
    () => ({
      device,
      product,
      category,
      store,
      isEditor: false,
      renderChildElements: (children?: PageBuilderElement[]) => {
        if (!children || children.length === 0) return null;
        return children.map((child) => (
          <SingleElementRenderer key={child.id} element={child} context={context} />
        ));
      },
    }),
    [device, product, category, store]
  );

  return (
    <div
      className={`page-builder-output w-full min-h-[50vh] ${className}`}
      style={{
        backgroundColor: settings.backgroundColor || settings.background || undefined,
        fontFamily: settings.fontFamily || undefined,
        color: settings.textColor || undefined,
      }}
    >
      {/* Optional custom page-scoped CSS */}
      {settings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      )}

      {rootElements.map((element) => (
        <SingleElementRenderer key={element.id} element={element} context={context} />
      ))}
    </div>
  );
}

function SingleElementRenderer({
  element,
  context,
}: {
  element: PageBuilderElement;
  context: RendererContext;
}) {
  // Respect responsive visibility settings
  if (element.advanced?.hideOnDesktop && context.device === 'desktop') return null;
  if (element.advanced?.hideOnTablet && context.device === 'tablet') return null;
  if (element.advanced?.hideOnMobile && context.device === 'mobile') return null;

  const RendererComponent = ELEMENT_RENDERER_REGISTRY[element.type];

  // Unknown component fallback: fails gracefully without crashing storefront
  if (!RendererComponent) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="p-4 border border-dashed border-amber-400 bg-amber-50 text-amber-900 text-xs rounded">
          Unknown element type: <code>{element.type}</code>
        </div>
      );
    }
    return null;
  }

  return <RendererComponent element={element} context={context} />;
}
