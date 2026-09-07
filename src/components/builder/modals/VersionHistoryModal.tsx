'use client';

import React, { useEffect, useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import { PageVersionSnapshot } from '@/types/builder.types';
import { X, RefreshCw, Clock, History, RotateCcw, AlertTriangle } from 'lucide-react';

export function VersionHistoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { document, loadTemplateContent } = useBuilder();
  const [versions, setVersions] = useState<PageVersionSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PageVersionSnapshot | null>(null);

  useEffect(() => {
    if (!isOpen || !document.id) return;

    setLoading(true);
    fetch(`/api/v1/content/builder/pages/${document.id}/versions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setVersions(data.data);
          if (data.data.length > 0) {
            setSelectedVersion(data.data[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load versions:', err))
      .finally(() => setLoading(false));
  }, [isOpen, document.id]);

  if (!isOpen) return null;

  const handleRestore = async () => {
    if (!selectedVersion) return;
    if (confirm(`Restore to Version ${selectedVersion.version}? Unsaved draft modifications will be replaced.`)) {
      try {
        const res = await fetch(
          `/api/v1/content/builder/pages/${document.id}/versions/${selectedVersion.version}/restore`,
          { method: 'POST' }
        );
        if (res.ok) {
          loadTemplateContent(selectedVersion.content);
          onClose();
        } else {
          alert('Failed to restore version');
        }
      } catch {
        alert('Network error while restoring version');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-[#14181F] text-zinc-100 border border-zinc-700/60 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm text-zinc-100">Revision History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Versions list */}
          <div className="w-1/2 border-r border-zinc-800 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-amber-400" />
                Loading revisions...
              </div>
            ) : versions.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No past revisions saved yet. Revisions are created automatically whenever you publish.
              </div>
            ) : (
              versions.map((ver) => {
                const isSelected = selectedVersion?.id === ver.id;
                return (
                  <div
                    key={ver.id || ver.version}
                    onClick={() => setSelectedVersion(ver)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'border-amber-400 bg-zinc-900 ring-1 ring-amber-400/20'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-zinc-100">
                        Version {ver.version}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {new Date(ver.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {ver.changelog || 'Published snapshot'}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Details / Preview info */}
          <div className="w-1/2 p-6 flex flex-col justify-between bg-zinc-900/30">
            {selectedVersion ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                    Snapshot Details
                  </span>
                  <h4 className="font-semibold text-sm text-zinc-100">
                    Version {selectedVersion.version}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Created on {new Date(selectedVersion.createdAt).toLocaleString()} by{' '}
                    <span className="text-zinc-200">{selectedVersion.author || 'admin'}</span>
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Root Sections:</span>
                    <span className="font-mono text-zinc-200">
                      {selectedVersion.content?.children?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Schema Version:</span>
                    <span className="font-mono text-zinc-200">
                      {selectedVersion.content?.version || 1}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Restoring this snapshot will set your active editor canvas to this version.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-zinc-500 my-auto">
                Select a version on the left to review.
              </div>
            )}

            <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                type="button"
                disabled={!selectedVersion}
                onClick={handleRestore}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black rounded text-xs font-bold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Version</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
