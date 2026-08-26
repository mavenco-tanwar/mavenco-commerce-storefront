'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Department } from '@/types/product';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department;
}

export function SizeGuideModal({ isOpen, onClose, department = 'women' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'women' | 'kids'>(
    department === 'kids' ? 'kids' : 'women'
  );

  const womenSizes = [
    { size: 'XS', bustIn: '32', waistIn: '26', hipIn: '35', bustCm: '81', waistCm: '66', hipCm: '89' },
    { size: 'S', bustIn: '34', waistIn: '28', hipIn: '37', bustCm: '86', waistCm: '71', hipCm: '94' },
    { size: 'M', bustIn: '36', waistIn: '30', hipIn: '39', bustCm: '91', waistCm: '76', hipCm: '99' },
    { size: 'L', bustIn: '38', waistIn: '32', hipIn: '41', bustCm: '96', waistCm: '81', hipCm: '104' },
    { size: 'XL', bustIn: '40', waistIn: '34', hipIn: '43', bustCm: '101', waistCm: '86', hipCm: '109' },
    { size: 'XXL', bustIn: '42', waistIn: '36', hipIn: '45', bustCm: '107', waistCm: '91', hipCm: '114' },
  ];

  const kidsSizes = [
    { size: '2-3Y', heightIn: '35-38', chestIn: '21', waistIn: '20', heightCm: '89-96', chestCm: '53', waistCm: '51' },
    { size: '3-4Y', heightIn: '38-41', chestIn: '22', waistIn: '21', heightCm: '96-104', chestCm: '56', waistCm: '53' },
    { size: '5-6Y', heightIn: '41-45', chestIn: '24', waistIn: '22', heightCm: '104-114', chestCm: '61', waistCm: '56' },
    { size: '7-8Y', heightIn: '45-50', chestIn: '26', waistIn: '23', heightCm: '114-127', chestCm: '66', waistCm: '58' },
    { size: '9-10Y', heightIn: '50-54', chestIn: '28', waistIn: '24', heightCm: '127-137', chestCm: '71', waistCm: '61' },
    { size: '11-12Y', heightIn: '54-58', chestIn: '30', waistIn: '25', heightCm: '137-147', chestCm: '76', waistCm: '64' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Size & Measurement Guide"
      subtitle="Find your perfect fit with our precision tailoring standard"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Tab & Unit Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED8]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('women')}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2 border transition-colors ${
                activeTab === 'women'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#F8F1EA] text-[#777777] border-[#E8DED8] hover:text-[#111111]'
              }`}
            >
              Women&apos;s Clothing
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2 border transition-colors ${
                activeTab === 'kids'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#F8F1EA] text-[#777777] border-[#E8DED8] hover:text-[#111111]'
              }`}
            >
              Kids&apos; Collection
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-[#F8F1EA] p-1 border border-[#E8DED8]">
            <button
              onClick={() => setUnit('in')}
              className={`text-xs font-semibold px-3 py-1 transition-colors ${
                unit === 'in' ? 'bg-[#FFFDFC] text-[#111111] shadow-xs' : 'text-[#777777]'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`text-xs font-semibold px-3 py-1 transition-colors ${
                unit === 'cm' ? 'bg-[#FFFDFC] text-[#111111] shadow-xs' : 'text-[#777777]'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="overflow-x-auto">
          {activeTab === 'women' ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F1EA] text-[#111111] uppercase font-bold tracking-wider border-b border-[#E8DED8]">
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Bust ({unit})</th>
                  <th className="py-3 px-4">Waist ({unit})</th>
                  <th className="py-3 px-4">Hip ({unit})</th>
                  <th className="py-3 px-4">Indian Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED8]">
                {womenSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF6F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111111]">{row.size}</td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.bustIn : row.bustCm}
                    </td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.waistIn : row.waistCm}
                    </td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.hipIn : row.hipCm}
                    </td>
                    <td className="py-3 px-4 text-[#B77A68] font-semibold">
                      {row.size === 'XS'
                        ? '32'
                        : row.size === 'S'
                        ? '34'
                        : row.size === 'M'
                        ? '36'
                        : row.size === 'L'
                        ? '38'
                        : row.size === 'XL'
                        ? '40'
                        : '42'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F1EA] text-[#111111] uppercase font-bold tracking-wider border-b border-[#E8DED8]">
                  <th className="py-3 px-4">Age / Size</th>
                  <th className="py-3 px-4">Height ({unit})</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Waist ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED8]">
                {kidsSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF6F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111111]">{row.size}</td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.heightIn : row.heightCm}
                    </td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.chestIn : row.chestCm}
                    </td>
                    <td className="py-3 px-4 text-[#777777]">
                      {unit === 'in' ? row.waistIn : row.waistCm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* How to Measure note */}
        <div className="bg-[#FAF6F2] border border-[#E8DED8] p-4 text-xs space-y-2">
          <h5 className="font-bold text-[#111111] uppercase tracking-wider">
            How to Measure For the Best Fit
          </h5>
          <ul className="list-disc pl-4 space-y-1 text-[#777777] font-sans">
            <li><strong>Bust/Chest:</strong> Measure around the fullest part of your chest with tape held level.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
            <li><strong>Hips:</strong> Measure around the fullest part of your hips, approximately 8 inches below waist.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
