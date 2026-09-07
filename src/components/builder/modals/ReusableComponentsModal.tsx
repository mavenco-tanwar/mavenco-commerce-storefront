'use client';

import React, { useEffect, useState } from 'react';
import { useBuilder } from '@/lib/builder/builder-state';
import { ReusableComponent } from '@/types/builder.types';
import { X, Component, Plus, Trash2, ArrowRight, Check, Box } from 'lucide-react';

export function ReusableComponentsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedElement, insertRawElement, document } = useBuilder();
  const [components, setComponents] = useState<ReusableComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'save'>('library');

  // New component form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sections');
  const [saving, setSaving] = useState(false);

  const fetchComponents = () => {
    setLoading(true);
    fetch('/api/v1/content/builder/components')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setComponents(data.data);
        }
      })
      .catch((err) => console.error('Failed to load components:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
      if (selectedElement) {
        setName(selectedElement.label || selectedElement.type);
      }
    }
  }, [isOpen, selectedElement]);

  if (!isOpen) return null;

  const handleSaveCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElement || !name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/v1/content/builder/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          elementTree: selectedElement,
        }),
      });

      if (res.ok) {
        fetchComponents();
        setActiveTab('library');
      } else {
        alert('Failed to save reusable component');
      }
    } catch {
      alert('Network error while saving component');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this reusable component?')) {
      try {
        const res = await fetch(`/api/v1/content/builder/components?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setComponents((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err) {
        console.error('Delete component error:', err);
      }
    }
  };

  const handleInsert = (comp: ReusableComponent) => {
    insertRawElement(comp.elementTree);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-[#14181F] text-zinc-100 border border-zinc-700/60 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Component className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm text-zinc-100">Reusable Components</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 border-b border-zinc-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'library'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Saved Components ({components.length})
          </button>
          {selectedElement && (
            <button
              onClick={() => setActiveTab('save')}
              className={`py-3 border-b-2 transition ${
                activeTab === 'save'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Save Selected Element
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' ? (
            loading ? (
              <div className="p-8 text-center text-xs text-zinc-500">Loading components...</div>
            ) : components.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 space-y-2">
                <Box className="w-8 h-8 text-zinc-600 mx-auto" />
                <p>No reusable components saved yet.</p>
                <p className="text-[11px] text-zinc-600">
                  Select any container or section on the canvas to save it as a reusable component.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-xs text-zinc-100">{comp.name}</h4>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                          {comp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Type: {comp.elementTree?.type}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => handleDelete(comp.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsert(comp)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black rounded text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>Insert</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Save Form
            <form onSubmit={handleSaveCurrent} className="space-y-4 max-w-md mx-auto">
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-400">
                Saving element: <b className="text-zinc-200">{selectedElement?.label || selectedElement?.type}</b>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Featured Atelier Grid"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Sections">Sections</option>
                  <option value="Headers">Headers</option>
                  <option value="Footers">Footers</option>
                  <option value="Product Blocks">Product Blocks</option>
                  <option value="Call to Action">Call to Action</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-md text-xs transition"
              >
                {saving ? 'Saving...' : 'Save Component'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
