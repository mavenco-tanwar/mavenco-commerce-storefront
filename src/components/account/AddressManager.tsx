'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Building, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { indianStates, pincodesDirectory } from '@/data/pincodes';

export function AddressManager() {
  const { user, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    isDefault: false,
  });

  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/[^0-9]/g, '');
    const match = pincodesDirectory[clean];
    if (match) {
      setFormData((prev) => ({
        ...prev,
        pincode: clean,
        city: match.city,
        state: match.state,
      }));
    } else {
      setFormData((prev) => ({ ...prev, pincode: clean }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.pincode || !formData.addressLine1) return;

    addAddress(formData);
    setIsAddModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
      isDefault: false,
    });
  };

  const savedAddresses = user?.savedAddresses || [];

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#111111]">
            Saved Delivery Addresses
          </h3>
          <p className="text-xs text-[#777777] font-sans">
            Manage your default and secondary shipping destinations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Address
        </Button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedAddresses.map((addr: any) => (
          <div
            key={addr.id}
            className={`p-6 bg-[#FFFDFC] border transition-all relative ${
              addr.isDefault
                ? 'border-[#B77A68] bg-[#FAF6F2] ring-1 ring-[#B77A68]'
                : 'border-[#E8DED8]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                <MapPin className="w-3.5 h-3.5 text-[#B77A68]" />
                {addr.fullName}
              </span>

              {addr.isDefault && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#B77A68] text-white">
                  Default
                </span>
              )}
            </div>

            <p className="text-xs text-[#777777] font-sans leading-relaxed">
              {addr.addressLine1}
              {addr.addressLine2 && <><br />{addr.addressLine2}</>}
              {addr.landmark && <><br />Landmark: {addr.landmark}</>}
              <br />
              {addr.city}, {addr.state} - {addr.pincode}
              <br />
              Phone: {addr.phone}
            </p>

            <div className="mt-4 pt-3 border-t border-[#E8DED8] flex items-center justify-between text-xs font-semibold">
              {!addr.isDefault ? (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[#B77A68] hover:underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] text-[#777777]">Primary shipping address</span>
              )}

              <button
                onClick={() => deleteAddress(addr.id)}
                className="text-[#777777] hover:text-[#C98282] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Delivery Address"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                6-Digit PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-[#777777] cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="text-[#B77A68] focus:ring-0"
            />
            <span>Set as default shipping address</span>
          </label>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
