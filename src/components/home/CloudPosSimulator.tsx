'use client';

import React, { useState } from 'react';
import { Store, Scan, Printer, CreditCard, Banknote, QrCode, Check, RefreshCw, Sparkles, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  sku: string;
  price: number;
  qty: number;
  barcode: string;
}

export function CloudPosSimulator() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'item_1',
      title: 'Banarasi Katan Silk Saree (Plum)',
      sku: 'BKS-PLUM-01',
      price: 2999,
      qty: 1,
      barcode: '8901234567890',
    },
    {
      id: 'item_2',
      title: 'Chanderi Gold Embroidered Dupatta',
      sku: 'CHD-GOLD-02',
      price: 1499,
      qty: 1,
      barcode: '8901234567891',
    },
  ]);

  const [scannedCode, setScannedCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/v1/products?limit=10')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          setDbProducts(json.data);
          const initialCart: CartItem[] = json.data.slice(0, 2).map((p: any, idx: number) => ({
            id: p.id || `item_${idx + 1}`,
            title: p.title || 'Curated Design Piece',
            sku: p.sku || `SKU-POS-${p.slug ? p.slug.substring(0, 4).toUpperCase() : idx + 101}`,
            price: Number(p.price) || 2499,
            qty: 1,
            barcode: `890${Math.floor(1000000000 + (p.price || 1) * 123).toString().slice(0, 10)}`,
          }));
          setCart(initialCart);
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  const handleScanSampleItem = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const nextProduct = dbProducts[cart.length % (dbProducts.length || 1)] || {
        title: 'Artisanal Travertine Candle Holder',
        price: 899,
        sku: 'LUM-CANDLE-03',
      };
      const barcodeNum = `890${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 10)}`;
      const newItem: CartItem = {
        id: `item_${Date.now()}`,
        title: nextProduct.title || 'Scanned Retail SKU',
        sku: nextProduct.sku || `SKU-RET-${cart.length + 101}`,
        price: Number(nextProduct.price) || 1299,
        qty: 1,
        barcode: barcodeNum,
      };
      setCart((prev) => [...prev, newItem]);
      setScannedCode(barcodeNum);
    }, 500);
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = cart
      .map(
        (item) => `
        <tr>
          <td style="padding: 4px 0;">${item.title}<br/><span style="font-size: 9px; color: #666;">${item.sku}</span></td>
          <td style="text-align: center; padding: 4px 0;">x${item.qty}</td>
          <td style="text-align: right; padding: 4px 0;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Retail POS Receipt</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 280px; margin: 0 auto; padding: 12px; font-size: 11px; color: #000; }
            .text-center { text-align: center; }
            .header { border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10px; }
            .totals { border-top: 1px dashed #000; padding-top: 6px; margin-top: 6px; }
            .footer { border-top: 1px dashed #000; margin-top: 12px; padding-top: 8px; text-align: center; font-size: 9px; }
            @media print { body { padding: 0; width: 100%; } }
          </style>
        </head>
        <body>
          <div class="header text-center">
            <h3 style="margin: 0; font-size: 14px;">MAVENCO FLAGSHIP BOUTIQUE</h3>
            <div>Indiranagar 100ft Rd, Bengaluru</div>
            <div>GSTIN: 29AAACM1234F1Z5</div>
            <div style="margin-top: 4px; font-size: 9px;">Receipt #: POS-${Date.now().toString().slice(-6)}</div>
            <div style="font-size: 9px;">Date: ${new Date().toLocaleString('en-IN')}</div>
          </div>

          <table>
            <thead>
              <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal:</span>
              <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>GST (12%):</span>
              <span>₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-top: 4px;">
              <span>GRAND TOTAL:</span>
              <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; margin-top: 2px;">
              <span>Payment Tender:</span>
              <span>${paymentMethod.toUpperCase()} (PAID)</span>
            </div>
          </div>

          <div class="footer">
            Thank you for visiting Mavenco Boutique!<br/>
            Exchange allowed within 7 days with bill.
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

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-purple-400" />
          <span>Omnichannel Retail Point-of-Sale (POS)</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cloud POS &amp; Retail Barcode Terminal
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Sync physical retail boutique checkouts, barcode scanning, and multi-tender payments directly with your online headless catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left POS Terminal Screen (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">POS Terminal #01 • Bengaluru Boutique</span>
            </div>
            <span className="font-mono text-slate-400 text-[10px]">Cashier: Priya K.</span>
          </div>

          {/* Barcode Scanner Bar */}
          <div className="p-2 bg-[#121522] rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-2 text-xs">
              <Scan className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="font-mono text-slate-300 text-[11px]">
                {scannedCode ? `Last Scanned: ${scannedCode}` : 'Ready for Barcode Scan / RFID'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleScanSampleItem}
              disabled={isScanning}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />}
              <span>Simulate Barcode Beep</span>
            </button>
          </div>

          {/* Scanned Cart Table */}
          <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto pr-1 text-xs">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-white text-xs">{item.title}</div>
                  <div className="font-mono text-[10px] text-slate-500">
                    SKU: {item.sku} • {item.barcode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white">₹{item.price.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">Qty: {item.qty}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="p-3.5 bg-[#121522] rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Retail GST (12%):</span>
              <span className="font-mono text-white">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-slate-800">
              <span>Total Payable:</span>
              <span className="font-mono text-emerald-400 font-extrabold text-base">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Payment Tender & Receipt Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Payment Tender
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'upi', label: 'UPI QR', icon: <QrCode className="w-4 h-4 text-emerald-400" /> },
              { id: 'card', label: 'Card POS', icon: <CreditCard className="w-4 h-4 text-sky-400" /> },
              { id: 'cash', label: 'Cash Tender', icon: <Banknote className="w-4 h-4 text-amber-400" /> },
            ].map((tender) => (
              <button
                key={tender.id}
                onClick={() => setPaymentMethod(tender.id as any)}
                className={`p-3 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === tender.id
                    ? 'border-purple-500 bg-purple-500/15 text-white shadow-lg'
                    : 'border-slate-800 bg-[#121522] text-slate-400 hover:text-white'
                }`}
              >
                {tender.icon}
                <span className="text-[11px]">{tender.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs space-y-1 text-emerald-300">
            <div className="font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Unified Inventory Sync</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Retail barcode sale instantly deducts stock from online store &amp; database partition.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
