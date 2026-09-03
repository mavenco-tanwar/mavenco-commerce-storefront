'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Plus, CheckCircle2, Search } from 'lucide-react';
import { AttributeDefinition, AttributeGroup } from '@/types/pim-commerce.types';

export default function AttributesAdminPage() {
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const [groups, setGroups] = useState<AttributeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('text');
  const [group, setGroup] = useState('General');
  const [required, setRequired] = useState(false);
  const [facetable, setFacetable] = useState(true);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalog/attributes');
      const data = await res.json();
      if (data.success) {
        setAttributes(data.data.attributes || []);
        setGroups(data.data.groups || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    try {
      const res = await fetch('/api/v1/catalog/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          code,
          type,
          group,
          required,
          facetable,
          filterable: true,
          searchable: true,
          sortable: false,
          localized: true,
          marketSpecific: false,
          channelSpecific: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateOpen(false);
        setName('');
        setCode('');
        fetchAttributes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = attributes.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-amber-400" />
            <span>Attribute Definitions & Groups</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic 16-type attributes with validation rules, faceting, searchability, and localization.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Attribute</span>
        </button>
      </div>

      <div className="bg-[#12151B] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search attributes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
            />
          </div>
          <span className="text-xs text-zinc-500">{attributes.length} total definitions</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0F1217] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-3">Attribute Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Group</th>
              <th className="p-3">Facetable</th>
              <th className="p-3">Required</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map((attr) => (
              <tr key={attr.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-zinc-200">{attr.name}</td>
                <td className="p-3 font-mono text-zinc-400">{attr.code}</td>
                <td className="p-3 font-mono text-amber-400/90 uppercase text-[10px]">{attr.type}</td>
                <td className="p-3">{attr.group}</td>
                <td className="p-3">
                  {attr.facetable ? (
                    <span className="text-emerald-400 font-medium">Yes</span>
                  ) : (
                    <span className="text-zinc-600">No</span>
                  )}
                </td>
                <td className="p-3">
                  {attr.required ? (
                    <span className="text-amber-400 font-medium">Yes</span>
                  ) : (
                    <span className="text-zinc-600">No</span>
                  )}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14171E] border border-zinc-700/80 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Define Attribute</span>
            </h2>

            <form onSubmit={handleCreateAttribute} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scent Profile"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!code) setCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. scent_profile"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-100 outline-none cursor-pointer"
                  >
                    <option value="text">text</option>
                    <option value="textarea">textarea</option>
                    <option value="number">number</option>
                    <option value="decimal">decimal</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="select">select</option>
                    <option value="multi_select">multi_select</option>
                    <option value="color">color</option>
                    <option value="measurement">measurement</option>
                    <option value="currency">currency</option>
                    <option value="url">url</option>
                    <option value="json">json</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-100 outline-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Materials">Materials</option>
                    <option value="Care">Care</option>
                    <option value="Dimensions">Dimensions</option>
                    <option value="Technical">Technical</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500"
                  />
                  <span>Required Field</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={facetable}
                    onChange={(e) => setFacetable(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500"
                  />
                  <span>Facetable Filter</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black rounded-lg text-xs font-semibold"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
