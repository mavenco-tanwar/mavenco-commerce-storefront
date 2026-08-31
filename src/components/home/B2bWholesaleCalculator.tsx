'use client';

import React, { useState } from 'react';
import { Building2, Calculator, ArrowRight, ShieldCheck, Download, MessageSquare, Percent, Check } from 'lucide-react';

export function B2bWholesaleCalculator() {
  const [quantity, setQuantity] = useState<number>(50);
  const [unitRetailPrice, setUnitRetailPrice] = useState<number>(2499);
  const [category, setCategory] = useState<string>('apparel');
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; label: string; price: number }>>([
    { id: 'apparel', label: 'Ethnic Pret', price: 2499 },
    { id: 'decor', label: 'Home Living', price: 3999 },
    { id: 'activewear', label: 'Activewear', price: 1899 },
  ]);

  React.useEffect(() => {
    fetch('/api/v1/products?limit=6')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const dynamicCats = json.data.slice(0, 3).map((p: any) => ({
            id: p.slug || p.id,
            label: p.category || p.title?.substring(0, 14) || 'Catalog SKU',
            price: Number(p.price) || 2499,
          }));
          setCategoriesList(dynamicCats);
          if (dynamicCats[0]) {
            setCategory(dynamicCats[0].id);
            setUnitRetailPrice(dynamicCats[0].price);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Tier Calculation
  let discountPercentage = 0;
  if (quantity >= 200) {
    discountPercentage = 40; // 40% off
  } else if (quantity >= 100) {
    discountPercentage = 30; // 30% off
  } else if (quantity >= 50) {
    discountPercentage = 22; // 22% off
  } else if (quantity >= 20) {
    discountPercentage = 15; // 15% off
  } else {
    discountPercentage = 5; // 5% sample discount
  }

  const wholesaleUnitPrice = Math.round(unitRetailPrice * (1 - discountPercentage / 100));
  const subtotal = wholesaleUnitPrice * quantity;
  const gstAmount = Math.round(subtotal * 0.12); // 12% GST
  const grandTotal = subtotal + gstAmount;
  const totalRetailValue = unitRetailPrice * quantity;
  const buyerSavings = totalRetailValue - subtotal;

  const handleDownloadB2bQuotePdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>B2B Wholesale Commercial Quotation - Mavenco</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #111; max-width: 650px; margin: 0 auto; line-height: 1.5; }
            .header { border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
            .badge { background: #E0E7FF; color: #3730A3; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: monospace; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { text-align: left; background: #f8fafc; padding: 8px 4px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
            td { padding: 8px 4px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 24px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
            @media print { button { display: none; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin: 0; font-size: 20px;">MAVENCO COMMERCE</h2>
              <div style="font-size: 11px; color: #64748b;">Official B2B Wholesale Commercial Quotation</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">QUOTE #MVC-B2B-${Date.now().toString().slice(-6)}</span>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px;">
            <div>
              <strong>Order Tier:</strong> ${quantity} Units (Bulk Batch)<br/>
              <strong>Category:</strong> ${category.toUpperCase()}<br/>
              <strong>Volume Discount:</strong> ${discountPercentage}% Off Retail
            </div>
            <div style="text-align: right;">
              <strong>Unit MRP:</strong> ₹${unitRetailPrice.toLocaleString('en-IN')}<br/>
              <strong>Wholesale Rate:</strong> ₹${wholesaleUnitPrice.toLocaleString('en-IN')}/unit<br/>
              <strong>Total Profit Margin:</strong> ₹${buyerSavings.toLocaleString('en-IN')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Wholesale Rate</th>
                <th style="text-align: right;">Taxable Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>B2B Wholesale Capsule Batch</strong> (${category.toUpperCase()} Catalog Allocation)</td>
                <td style="text-align: center;">${quantity}</td>
                <td style="text-align: right;">₹${wholesaleUnitPrice.toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal (Excl. Tax):</td>
                <td style="text-align: right; font-weight: bold;">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right; color: #64748b;">Applicable GST (12%):</td>
                <td style="text-align: right; color: #64748b;">₹${gstAmount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold; font-size: 14px;">Grand Total (Incl. GST):</td>
                <td style="text-align: right; font-weight: bold; font-size: 14px; color: #059669;">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            Valid for 15 days • Dispatched via Surface Freight • support@mavenco.com • +91 82390 19096
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleWhatsAppB2bInquiry = () => {
    const text = `Hi Mavenco Solutions Team,\n\nI want to place a B2B Wholesale / Bulk Order:\n\n📦 *Quantity:* ${quantity} units\n🏷️ *Category:* ${category.toUpperCase()}\n💰 *Target Rate:* ₹${wholesaleUnitPrice.toLocaleString('en-IN')}/unit (${discountPercentage}% Discount)\n💼 *Estimated Order Value:* ₹${grandTotal.toLocaleString('en-IN')}\n\nPlease share the bulk swatch catalog and dispatch timeline!`;
    const cleanPhone = '918239019096';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>B2B Wholesale &amp; Volume Tier Engine</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          B2B Wholesale Tier Pricing Calculator
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Simulate multi-tier volume discounts, GST tax splits, and profit margins for corporate, retail, and export bulk buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Slider (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Order Volume Quantity (MOQ)
              </label>
              <span className="text-sm font-extrabold font-mono text-amber-400">
                {quantity} Units
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>10 MOQ</span>
              <span>100 (Bulk)</span>
              <span>500 (Enterprise)</span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Garment / Product Taxonomy
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setUnitRetailPrice(cat.price);
                  }}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    category === cat.id
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-[#121522] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-[#121522] rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Tier Discount</div>
            <div className="flex justify-between text-slate-300">
              <span>Retail Unit MRP:</span>
              <span className="font-mono text-slate-400 line-through">₹{unitRetailPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Wholesale Rate:</span>
              <span className="font-bold font-mono text-emerald-400">
                ₹{wholesaleUnitPrice.toLocaleString('en-IN')} / unit ({discountPercentage}% OFF)
              </span>
            </div>
          </div>
        </div>

        {/* Right Live Commercial Quote Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400">COMMERCIAL INVOICE ESTIMATE</span>
            <span className="text-emerald-400 font-bold">Tier Discount Applied</span>
          </div>

          {/* 3 Metric Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Taxable Value</div>
              <div className="text-2xl font-black font-mono text-white">
                ₹{subtotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">+ 12% GST (₹{gstAmount.toLocaleString('en-IN')})</div>
            </div>

            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Buyer Profit Margin</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ₹{buyerSavings.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Instant Bulk Savings</div>
            </div>
          </div>

          {/* Grand Total Bar */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-300 font-bold block">Estimated Grand Total (with GST):</span>
              <span className="text-[10px] text-slate-400 font-mono">Includes Surface Cargo Dispatch</span>
            </div>
            <div className="text-xl font-black font-mono text-emerald-300">
              ₹{grandTotal.toLocaleString('en-IN')}
            </div>
          </div>

          {/* 2 Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadB2bQuotePdf}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download B2B Quote (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppB2bInquiry}
              className="py-3 px-4 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Lock Bulk Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
