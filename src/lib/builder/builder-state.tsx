'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  PageBuilderContent,
  PageBuilderDocument,
  PageBuilderElement,
  PageGlobalSettings,
  PageSeoSettings,
  ResponsiveDevice,
  ResponsiveStyles,
} from '@/types/builder.types';
import {
  createDefaultElement,
  getElementDefinition,
} from './registry';
import {
  findElementById,
  findParentAndIndex,
  insertElementInTree,
  moveElementInTree,
  regenerateElementIds,
  removeElementFromTree,
  updateElementInTree,
} from './builder-utils';

export type BuilderSidebarTab = 'elements' | 'navigator' | 'templates' | 'components';
export type SettingsTab = 'content' | 'style' | 'layout' | 'advanced' | 'responsive';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface ClipboardItem {
  type: 'element' | 'styles';
  data: PageBuilderElement | ResponsiveStyles;
}

export interface BuilderContextValue {
  // Document State
  document: PageBuilderDocument;
  selectedElement: PageBuilderElement | null;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  device: ResponsiveDevice;
  sidebarTab: BuilderSidebarTab;
  settingsTab: SettingsTab;
  isPreview: boolean;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  clipboard: ClipboardItem | null;

  // Viewport & Mode Controls
  setDevice: (device: ResponsiveDevice) => void;
  setSidebarTab: (tab: BuilderSidebarTab) => void;
  setSettingsTab: (tab: SettingsTab) => void;
  setIsPreview: (preview: boolean) => void;
  setSelectedElementId: (id: string | null) => void;
  setHoveredElementId: (id: string | null) => void;

  // Element Actions
  addElement: (type: string, targetId?: string | null, position?: 'inside' | 'before' | 'after') => void;
  insertRawElement: (element: PageBuilderElement, targetId?: string | null, position?: 'inside' | 'before' | 'after') => void;
  updateElementProps: (id: string, props: Record<string, any>) => void;
  updateElementStyles: (id: string, styles: Record<string, any>, targetDevice?: ResponsiveDevice) => void;
  updateElementAdvanced: (id: string, advanced: Record<string, any>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (sourceId: string, targetId: string, position: 'inside' | 'before' | 'after') => void;

  // Clipboard Actions
  copyElement: (id: string) => void;
  copyStyles: (id: string) => void;
  pasteElement: (targetId?: string | null, position?: 'inside' | 'before' | 'after') => void;
  pasteStyles: (id: string) => void;

  // History Actions
  undo: () => void;
  redo: () => void;

  // Page Settings & Metadata
  updatePageSettings: (settings: Partial<PageGlobalSettings>) => void;
  updatePageMeta: (meta: { title?: string; slug?: string; seo?: Partial<PageSeoSettings> }) => void;
  loadPageDocument: (doc: PageBuilderDocument) => void;
  loadTemplateContent: (content: PageBuilderContent) => void;

  // Persistence
  saveDraft: () => Promise<boolean>;
  publishPage: () => Promise<boolean>;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export interface BuilderProviderProps {
  initialDocument: PageBuilderDocument;
  children: React.ReactNode;
  onSaveDraft?: (doc: PageBuilderDocument) => Promise<any>;
  onPublish?: (doc: PageBuilderDocument) => Promise<any>;
}

const MAX_HISTORY = 40;

export function BuilderProvider({
  initialDocument,
  children,
  onSaveDraft,
  onPublish,
}: BuilderProviderProps) {
  const [document, setDocument] = useState<PageBuilderDocument>(initialDocument);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [device, setDevice] = useState<ResponsiveDevice>('desktop');
  const [sidebarTab, setSidebarTab] = useState<BuilderSidebarTab>('elements');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('content');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);

  // Undo / Redo History Stacks
  const [past, setPast] = useState<PageBuilderContent[]>([]);
  const [future, setFuture] = useState<PageBuilderContent[]>([]);

  // Track latest document for debounced autosave
  const docRef = useRef<PageBuilderDocument>(document);
  useEffect(() => {
    docRef.current = document;
  }, [document]);

  const isDirtyRef = useRef<boolean>(false);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Push new state snapshot to undo history
  const pushToHistory = useCallback((newContent: PageBuilderContent) => {
    setPast((prev) => {
      const updated = [...prev, docRef.current.content];
      if (updated.length > MAX_HISTORY) {
        return updated.slice(updated.length - MAX_HISTORY);
      }
      return updated;
    });
    setFuture([]);
    isDirtyRef.current = true;
    setSaveStatus('idle');
  }, []);

  // Update document content with history capture
  const updateContent = useCallback(
    (newChildren: PageBuilderElement[], newSettings?: PageGlobalSettings) => {
      const nextContent: PageBuilderContent = {
        version: (document.content?.version || 1) + 1,
        settings: newSettings || document.content?.settings || {},
        children: newChildren,
      };

      pushToHistory(nextContent);

      setDocument((prev) => ({
        ...prev,
        content: nextContent,
        updatedAt: new Date().toISOString(),
      }));
    },
    [document.content, pushToHistory]
  );

  // Undo
  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previousContent = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [document.content, ...prev]);
    setPast(newPast);

    setDocument((prev) => ({
      ...prev,
      content: previousContent,
      updatedAt: new Date().toISOString(),
    }));
  }, [past, document.content]);

  // Redo
  const redo = useCallback(() => {
    if (future.length === 0) return;

    const nextContent = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, document.content]);
    setFuture(newFuture);

    setDocument((prev) => ({
      ...prev,
      content: nextContent,
      updatedAt: new Date().toISOString(),
    }));
  }, [future, document.content]);

  // Add a new element from registry
  const addElement = useCallback(
    (type: string, targetId: string | null = null, position: 'inside' | 'before' | 'after' = 'inside') => {
      const newElement = createDefaultElement(type);
      const currentChildren = document.content?.children || [];
      const updated = insertElementInTree(currentChildren, newElement, targetId, position);
      updateContent(updated);
      setSelectedElementId(newElement.id);
      setSettingsTab('content');
    },
    [document.content?.children, updateContent]
  );

  // Insert a raw pre-configured element (e.g. from template or clipboard)
  const insertRawElement = useCallback(
    (element: PageBuilderElement, targetId: string | null = null, position: 'inside' | 'before' | 'after' = 'inside') => {
      const prepared = regenerateElementIds(element);
      const currentChildren = document.content?.children || [];
      const updated = insertElementInTree(currentChildren, prepared, targetId, position);
      updateContent(updated);
      setSelectedElementId(prepared.id);
    },
    [document.content?.children, updateContent]
  );

  // Update element props
  const updateElementProps = useCallback(
    (id: string, newProps: Record<string, any>) => {
      const currentChildren = document.content?.children || [];
      const updated = updateElementInTree(currentChildren, id, (el) => ({
        ...el,
        props: { ...el.props, ...newProps },
      }));
      updateContent(updated);
    },
    [document.content?.children, updateContent]
  );

  // Update element styles
  const updateElementStyles = useCallback(
    (id: string, newStyles: Record<string, any>, targetDevice: ResponsiveDevice = device) => {
      const currentChildren = document.content?.children || [];
      const updated = updateElementInTree(currentChildren, id, (el) => {
        const deviceStyles = el.styles?.[targetDevice] || {};
        return {
          ...el,
          styles: {
            ...el.styles,
            [targetDevice]: {
              ...deviceStyles,
              ...newStyles,
            },
          },
        };
      });
      updateContent(updated);
    },
    [document.content?.children, device, updateContent]
  );

  // Update element advanced settings
  const updateElementAdvanced = useCallback(
    (id: string, newAdvanced: Record<string, any>) => {
      const currentChildren = document.content?.children || [];
      const updated = updateElementInTree(currentChildren, id, (el) => ({
        ...el,
        advanced: { ...(el.advanced || {}), ...newAdvanced },
      }));
      updateContent(updated);
    },
    [document.content?.children, updateContent]
  );

  // Delete element
  const deleteElement = useCallback(
    (id: string) => {
      const currentChildren = document.content?.children || [];
      const updated = removeElementFromTree(currentChildren, id);
      updateContent(updated);
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    },
    [document.content?.children, selectedElementId, updateContent]
  );

  // Duplicate element
  const duplicateElement = useCallback(
    (id: string) => {
      const currentChildren = document.content?.children || [];
      const target = findElementById(currentChildren, id);
      if (!target) return;

      const cloned = regenerateElementIds(target);
      const updated = insertElementInTree(currentChildren, cloned, id, 'after');
      updateContent(updated);
      setSelectedElementId(cloned.id);
    },
    [document.content?.children, updateContent]
  );

  // Move element
  const moveElement = useCallback(
    (sourceId: string, targetId: string, position: 'inside' | 'before' | 'after') => {
      const currentChildren = document.content?.children || [];
      const updated = moveElementInTree(currentChildren, sourceId, targetId, position);
      updateContent(updated);
    },
    [document.content?.children, updateContent]
  );

  // Copy element to clipboard
  const copyElement = useCallback(
    (id: string) => {
      const target = findElementById(document.content?.children || [], id);
      if (target) {
        setClipboard({ type: 'element', data: target });
      }
    },
    [document.content?.children]
  );

  // Copy element styles to clipboard
  const copyStyles = useCallback(
    (id: string) => {
      const target = findElementById(document.content?.children || [], id);
      if (target && target.styles) {
        setClipboard({ type: 'styles', data: target.styles });
      }
    },
    [document.content?.children]
  );

  // Paste element from clipboard
  const pasteElement = useCallback(
    (targetId: string | null = selectedElementId, position: 'inside' | 'before' | 'after' = 'after') => {
      if (!clipboard || clipboard.type !== 'element') return;
      insertRawElement(clipboard.data as PageBuilderElement, targetId, position);
    },
    [clipboard, insertRawElement, selectedElementId]
  );

  // Paste styles from clipboard onto target element
  const pasteStyles = useCallback(
    (id: string = selectedElementId || '') => {
      if (!id || !clipboard || clipboard.type !== 'styles') return;
      const currentChildren = document.content?.children || [];
      const updated = updateElementInTree(currentChildren, id, (el) => ({
        ...el,
        styles: JSON.parse(JSON.stringify(clipboard.data)),
      }));
      updateContent(updated);
    },
    [clipboard, document.content?.children, selectedElementId, updateContent]
  );

  // Update page global settings
  const updatePageSettings = useCallback(
    (settings: Partial<PageGlobalSettings>) => {
      const nextSettings = { ...(document.content?.settings || {}), ...settings };
      updateContent(document.content?.children || [], nextSettings);
    },
    [document.content, updateContent]
  );

  // Update page metadata (title, slug, SEO)
  const updatePageMeta = useCallback(
    (meta: { title?: string; slug?: string; seo?: Partial<PageSeoSettings> }) => {
      setDocument((prev) => ({
        ...prev,
        title: meta.title !== undefined ? meta.title : prev.title,
        slug: meta.slug !== undefined ? meta.slug : prev.slug,
        seo: meta.seo ? { ...(prev.seo || {}), ...meta.seo } : prev.seo,
        updatedAt: new Date().toISOString(),
      }));
      isDirtyRef.current = true;
      setSaveStatus('idle');
    },
    []
  );

  // Overwrite entire document
  const loadPageDocument = useCallback((doc: PageBuilderDocument) => {
    setDocument(doc);
    setSelectedElementId(null);
    setPast([]);
    setFuture([]);
    isDirtyRef.current = false;
    setSaveStatus('saved');
  }, []);

  // Replace content with a template
  const loadTemplateContent = useCallback(
    (content: PageBuilderContent) => {
      const preparedChildren = content.children.map((child) => regenerateElementIds(child));
      updateContent(preparedChildren, content.settings);
    },
    [updateContent]
  );

  // Save draft
  const saveDraft = useCallback(async (): Promise<boolean> => {
    setSaveStatus('saving');
    try {
      if (onSaveDraft) {
        await onSaveDraft(docRef.current);
      } else {
        const res = await fetch(`/api/v1/content/builder/pages/${docRef.current.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docRef.current),
        });
        if (!res.ok) throw new Error('Save draft failed');
      }
      isDirtyRef.current = false;
      setSaveStatus('saved');
      return true;
    } catch (err) {
      console.error('Save draft error:', err);
      setSaveStatus('error');
      return false;
    }
  }, [onSaveDraft]);

  // Publish page
  const publishPage = useCallback(async (): Promise<boolean> => {
    setSaveStatus('saving');
    try {
      // First ensure draft is saved
      await saveDraft();

      if (onPublish) {
        await onPublish(docRef.current);
      } else {
        const res = await fetch(`/api/v1/content/builder/pages/${docRef.current.id}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publishedBy: 'admin' }),
        });
        if (!res.ok) throw new Error('Publish page failed');
      }

      setDocument((prev) => ({
        ...prev,
        status: 'published',
        publishedVersion: (prev.publishedVersion || 0) + 1,
        publishedContent: prev.content,
        publishedAt: new Date().toISOString(),
      }));

      setSaveStatus('saved');
      return true;
    } catch (err) {
      console.error('Publish page error:', err);
      setSaveStatus('error');
      return false;
    }
  }, [onPublish, saveDraft]);

  // Autosave debouncing: trigger save 3.5s after last modification
  useEffect(() => {
    if (saveStatus === 'idle' && isDirtyRef.current) {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      autosaveTimeoutRef.current = setTimeout(() => {
        if (isDirtyRef.current) {
          saveDraft();
        }
      }, 3500);
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [saveStatus, saveDraft]);

  // Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z / Cmd+Y, Cmd+S, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd+Z
      if (cmdKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd+Shift+Z or Cmd+Y
      if ((cmdKey && e.key.toLowerCase() === 'z' && e.shiftKey) || (cmdKey && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
      }

      // Save: Cmd+S
      if (cmdKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDraft();
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }

      // Copy: Cmd+C
      if (cmdKey && e.key.toLowerCase() === 'c' && selectedElementId) {
        e.preventDefault();
        copyElement(selectedElementId);
      }

      // Paste: Cmd+V
      if (cmdKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteElement();
      }

      // Duplicate: Cmd+D
      if (cmdKey && e.key.toLowerCase() === 'd' && selectedElementId) {
        e.preventDefault();
        duplicateElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    saveDraft,
    selectedElementId,
    deleteElement,
    copyElement,
    pasteElement,
    duplicateElement,
  ]);

  const selectedElement = selectedElementId
    ? findElementById(document.content?.children || [], selectedElementId)
    : null;

  const value: BuilderContextValue = {
    document,
    selectedElement,
    selectedElementId,
    hoveredElementId,
    device,
    sidebarTab,
    settingsTab,
    isPreview,
    saveStatus,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    clipboard,

    setDevice,
    setSidebarTab,
    setSettingsTab,
    setIsPreview,
    setSelectedElementId,
    setHoveredElementId,

    addElement,
    insertRawElement,
    updateElementProps,
    updateElementStyles,
    updateElementAdvanced,
    deleteElement,
    duplicateElement,
    moveElement,

    copyElement,
    copyStyles,
    pasteElement,
    pasteStyles,

    undo,
    redo,

    updatePageSettings,
    updatePageMeta,
    loadPageDocument,
    loadTemplateContent,

    saveDraft,
    publishPage,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder(): BuilderContextValue {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return ctx;
}
