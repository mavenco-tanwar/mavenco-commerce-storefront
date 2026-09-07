'use client';

import React, { useState } from 'react';
import { PageBuilderDocument } from '@/types/builder.types';
import { BuilderProvider, useBuilder } from '@/lib/builder/builder-state';
import { BuilderToolbar } from './toolbar/BuilderToolbar';
import { ElementPanel } from './panels/ElementPanel';
import { NavigatorPanel } from './panels/NavigatorPanel';
import { BuilderCanvas } from './canvas/BuilderCanvas';
import { SettingsPanel } from './panels/SettingsPanel';
import { TemplateLibraryModal } from './modals/TemplateLibraryModal';
import { VersionHistoryModal } from './modals/VersionHistoryModal';
import { ReusableComponentsModal } from './modals/ReusableComponentsModal';

export interface BuilderShellProps {
  initialPage: PageBuilderDocument;
  onSaveDraft?: (doc: PageBuilderDocument) => Promise<any>;
  onPublish?: (doc: PageBuilderDocument) => Promise<any>;
}

export function BuilderShell({
  initialPage,
  onSaveDraft,
  onPublish,
}: BuilderShellProps) {
  return (
    <BuilderProvider
      initialDocument={initialPage}
      onSaveDraft={onSaveDraft}
      onPublish={onPublish}
    >
      <BuilderInterior />
    </BuilderProvider>
  );
}

function BuilderInterior() {
  const { sidebarTab, isPreview } = useBuilder();

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0D11] overflow-hidden text-zinc-100 antialiased font-sans">
      {/* 1. Builder Top Toolbar */}
      <BuilderToolbar
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenVersions={() => setIsVersionsOpen(true)}
        onOpenComponents={() => setIsComponentsOpen(true)}
      />

      {/* 2. Workspace Body: Left Sidebar + Canvas + Right Settings */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel (Widgets / Navigator) */}
        {!isPreview && (
          <aside className="w-72 lg:w-80 h-full shrink-0 z-20">
            {sidebarTab === 'navigator' ? <NavigatorPanel /> : <ElementPanel />}
          </aside>
        )}

        {/* Center Live Canvas Workspace */}
        <main className="flex-1 h-full overflow-hidden flex flex-col">
          <BuilderCanvas />
        </main>

        {/* Right Settings Panel */}
        {!isPreview && (
          <aside className="w-80 lg:w-96 h-full shrink-0 z-20">
            <SettingsPanel />
          </aside>
        )}
      </div>

      {/* 3. Auxiliary Modals */}
      <TemplateLibraryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

      <VersionHistoryModal
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
      />

      <ReusableComponentsModal
        isOpen={isComponentsOpen}
        onClose={() => setIsComponentsOpen(false)}
      />
    </div>
  );
}
