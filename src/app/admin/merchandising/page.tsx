'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Pin, ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { MerchandisingRule } from '@/types/pim-commerce.types';

export default function MerchandisingAdminPage() {
  const [rules, setRules] = useState<MerchandisingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [query, setQuery] = useState('');
  const [action, setAction] = useState<'boost' | 'bury' | 'pin'>('pin');
  const [targetProductId, setTargetProductId] = useState('prod-01');

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalog/merchandising');
      const data = await res.json();
      if (data.success) setRules(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !targetProductId) return;

    try {
      const res = await fetch('/api/v1/catalog/merchandising', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ruleName,
          query,
          action,
          targetProductId,
          pinPosition: action === 'pin' ? 1 : undefined,
          boostMultiplier: action === 'boost' ? 2.0 : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setRuleName('');
        fetchRules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await fetch(`/api/v1/catalog/merchandising?id=${id}`, { method: 'DELETE' });
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <span>Merchandising Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Collection ordering, manual ranking boosts, search query pins, and promotional placements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Merchandising Rule</span>
        </button>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Rule Name</th>
              <th className="p-3">Query / Scope</th>
              <th className="p-3">Merchandising Action</th>
              <th className="p-3">Target Product</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-zinc-200">{r.name}</td>
                <td className="p-3 font-mono text-amber-300">
                  {r.query ? `"${r.query}"` : 'All Catalog'}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase font-mono border ${
                      r.action === 'pin'
                        ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                        : r.action === 'boost'
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {r.action === 'pin' && <Pin className="w-3 h-3" />}
                    {r.action === 'boost' && <ArrowUp className="w-3 h-3" />}
                    {r.action === 'bury' && <ArrowDown className="w-3 h-3" />}
                    {r.action}
                  </span>
                </td>
                <td className="p-3 font-mono text-zinc-300">{r.targetProductName || r.targetProductId}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDeleteRule(r.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14171E] border border-zinc-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Add Merchandising Rule</span>
            </h2>

            <form onSubmit={handleCreateRule} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pin Velvet Dress on Evening Search"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Search Query (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. dress, velvet, party"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-100 outline-none cursor-pointer"
                  >
                    <option value="pin">Pin to Top (#1)</option>
                    <option value="boost">Score Boost (x2.0)</option>
                    <option value="bury">Score Demote (Bury)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Target Product ID</label>
                  <input
                    type="text"
                    required
                    value={targetProductId}
                    onChange={(e) => setTargetProductId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black rounded-lg text-xs font-semibold"
                >
                  Save Merchandising Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
