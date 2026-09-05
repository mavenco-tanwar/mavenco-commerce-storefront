'use client';

import React from 'react';
import { DynamicFooter } from '../footer/DynamicFooter';

export function Footer({ tenantSlug }: { tenantSlug?: string }) {
  return <DynamicFooter tenantSlug={tenantSlug} />;
}
