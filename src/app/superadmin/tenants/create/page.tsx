'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertTriangle,
  Store,
  Layers,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
  Layout,
  RefreshCw,
  Boxes,
} from 'lucide-react';
import { PlatformModule } from '@/types/tenant-governance.types';

export default function TenantCreationWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [modules, setModules] = useState<PlatformModule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    tenantName: '',
    slug: '',
    email: '',
    country: 'US',
    timezone: 'America/New_York',
    storeName: '',
    defaultCurrency: 'USD',
    defaultLocale: 'en-US',
    selectedModules: ['dashboard', 'storefront', 'pages', 'products', 'orders', 'customers', 'payments'],
    adminName: '',
    adminEmail: '',
    storefrontTemplate: 'luxury' as 'blank' | 'luxury',
  });

  useEffect(() => {
    fetch('/api/v1/superadmin/modules')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setModules(json.data);
      });
  }, []);

  const handleSlugAutoFill = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      tenantName: name,
      slug: prev.slug ? prev.slug : slug,
      storeName: prev.storeName ? prev.storeName : `${name} Store`,
    }));
  };

  const toggleModule = (key: string) => {
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(key);
      const updated = exists
        ? prev.selectedModules.filter((m) => m !== key)
        : [...prev.selectedModules, key];
      return { ...prev, selectedModules: updated };
    });
  };

  // Check dependencies
  const getMissingDependencies = () => {
    const selectedSet = new Set(formData.selectedModules);
    const missing: { module: string; required: string }[] = [];
    for (const key of formData.selectedModules) {
      const def = modules.find((m) => m.key === key);
      if (def?.dependencies) {
        for (const dep of def.dependencies) {
          if (!selectedSet.has(dep)) {
            missing.push({ module: def.name, required: dep });
          }
        }
      }
    }
    return missing;
  };

  const missingDeps = getMissingDependencies();

  const handleAutoEnableDependencies = () => {
    const toAdd = missingDeps.map((d) => d.required);
    setFormData((prev) => ({
      ...prev,
      selectedModules: [...new Set([...prev.selectedModules, ...toAdd])],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/superadmin/tenants/${formData.slug}/storefront`);
      } else {
        setErrorMsg(data.error || 'Failed to provision tenant');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <Link
            href="/superadmin/tenants"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tenants</span>
          </Link>
          <span className="text-xs font-mono text-amber-400">Step {currentStep} of 7</span>
        </div>

        {/* Wizard Step Indicator */}
        <div className="grid grid-cols-7 gap-2">
          {['Tenant', 'Store', 'Modules', 'Config', 'Admin', 'Storefront', 'Review'].map(
            (label, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={label} className="text-center">
                  <div
                    className={`h-1.5 rounded-full mb-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-amber-400 shadow-md shadow-amber-400/30'
                        : 'bg-zinc-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold ${
                      isCurrent ? 'text-amber-400' : isDone ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wizard Step Forms */}
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 shadow-2xl space-y-6">
          {/* STEP 1: TENANT INFO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 1: Tenant Information</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  General brand identity and isolated database slug.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Tenant Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lumina Atelier"
                    value={formData.tenantName}
                    onChange={(e) => handleSlugAutoFill(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Tenant Slug (Isolated DB: tenant_slug) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. lumina"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Primary Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="concierge@atelier.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="US">United States (US)</option>
                    <option value="IN">India (IN)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="AE">United Arab Emirates (AE)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STORE INFO */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 2: Store Information</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Primary sales channel and currency.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Default Currency
                  </label>
                  <select
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AED">AED (AED)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT MODULES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 3: Select SaaS Modules</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select which capabilities to entitle for this tenant. Missing dependencies are checked in real time.
                </p>
              </div>

              {missingDeps.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <div>
                      <span className="font-semibold">Required Dependencies Missing:</span>
                      <ul className="list-disc pl-4 mt-0.5 text-[11px] text-zinc-300">
                        {missingDeps.map((d, i) => (
                          <li key={i}>
                            {d.module} requires module <span className="font-mono text-amber-400">{d.required}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={handleAutoEnableDependencies}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-sm"
                  >
                    Enable All Dependencies
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {modules.map((m) => {
                  const isSelected = formData.selectedModules.includes(m.key);
                  return (
                    <div
                      key={m.key}
                      onClick={() => toggleModule(m.key)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-xs transition ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-black'
                            : 'border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{m.name}</span>
                          {m.isEnterprise && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                              Enterprise
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                          {m.description}
                        </p>
                        {m.dependencies && m.dependencies.length > 0 && (
                          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                            Requires: {m.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: MODULE CONFIGURATION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 4: Module Configuration & Limits</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure limits for entitled modules. Stored directly in MongoDB.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs font-semibold text-amber-400">Products Limit</span>
                  <input
                    type="number"
                    defaultValue={5000}
                    className="w-full mt-2 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <span className="text-[10px] text-zinc-500 block mt-1">Maximum active catalog SKUs</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs font-semibold text-amber-400">Warehouses Limit</span>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full mt-2 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <span className="text-[10px] text-zinc-500 block mt-1">Fulfillment locations allowed</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TENANT ADMIN SETUP */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 5: Tenant Admin Owner</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Assign initial administrative credentials for the client.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Admin Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Sterling"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Admin Email (Owner Role Assigned)
                  </label>
                  <input
                    type="email"
                    placeholder="owner@atelier.com"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: STOREFRONT SETUP */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 6: Storefront Setup</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select initial starter composition for the visual builder.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setFormData({ ...formData, storefrontTemplate: 'luxury' })}
                  className={`p-5 rounded-xl border cursor-pointer transition select-none ${
                    formData.storefrontTemplate === 'luxury'
                      ? 'bg-amber-500/10 border-amber-400'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Luxury Boutique Preset</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Includes pre-configured Hero banner, Curated Categories, and Featured Products section.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, storefrontTemplate: 'blank' })}
                  className={`p-5 rounded-xl border cursor-pointer transition select-none ${
                    formData.storefrontTemplate === 'blank'
                      ? 'bg-amber-500/10 border-amber-400'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layout className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Blank Storefront</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Clean empty slate. No pre-filled sections. Ready for custom page design.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Step 7: Review & Provision</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Confirm tenant configuration before automated database provisioning.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-zinc-500">Tenant Brand:</span>
                  <span className="font-semibold text-white">{formData.tenantName}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-zinc-500">Database Name:</span>
                  <span className="font-mono text-amber-400">tenant_{formData.slug}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-zinc-500">Entitled Modules:</span>
                  <span className="font-medium text-emerald-400">
                    {formData.selectedModules.length} Modules Selected
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-zinc-500">Storefront Preset:</span>
                  <span className="font-semibold text-zinc-200 uppercase">
                    {formData.storefrontTemplate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                disabled={currentStep === 1 && (!formData.tenantName || !formData.slug)}
                onClick={() => setCurrentStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Provisioning Isolated Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm & Provision Tenant</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
