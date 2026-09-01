import React from 'react';
import { MapPin, Phone, Clock, Mail, Building, Send, Sparkles } from 'lucide-react';
import { getDatabase } from '@/lib/mongodb';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { PlatformFooter } from '@/components/layout/PlatformFooter';

export const revalidate = 0; // Dynamic on request

async function getContactPageConfig() {
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        type: 'contact-page',
      });
      if (doc?.config) {
        return doc.config;
      }
    }
  } catch (err) {
    console.error('Failed to load contact page from MongoDB:', err);
  }

  return {
    pageTitle: 'Visit Our Ateliers & Concierge Desk',
    pageSubtitle: 'Experience our curated haute collections in person or connect with our master stylists.',
    notificationEmail: 'ammar.tanwar.dev@gmail.com',
    stores: [
      {
        city: 'Bengaluru Flagship Atelier',
        address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
        phone: '+91 82390 19096',
        hours: 'Mon-Sun: 11:00 AM – 9:00 PM',
      },
      {
        city: 'Mumbai Design Studio',
        address: 'Kala Ghoda Arts Precinct, Fort, Mumbai, Maharashtra 400001',
        phone: '+91 82390 19096',
        hours: 'Mon-Sat: 10:30 AM – 8:00 PM',
      },
    ],
    formSubjectOptions: [
      'Bespoke Bridal Appointment',
      'B2B Wholesale Inquiry',
      'Order Delivery & Exchange Assistance',
      'Press & Media Collaborations',
    ],
  };
}

export default async function ContactPage() {
  const config = await getContactPageConfig();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            DIRECT ATELIER ACCESS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            {config.pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {config.pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Physical Stores (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-rose-400" />
              <span>Flagship Boutiques</span>
            </h2>

            <div className="space-y-4">
              {config.stores.map((store: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#0E111C] border border-slate-800 hover:border-rose-500/30 transition-all space-y-3"
                >
                  <h3 className="text-base font-bold text-white text-rose-300">{store.city}</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`tel:${store.phone}`} className="hover:text-rose-400 transition-colors">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Inquiry Desk (6 Cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#101320] border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" />
                <span>Concierge &amp; Order Desk</span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct dispatch to <span className="text-rose-400 font-mono">{config.notificationEmail}</span>
              </p>
            </div>

            <form
              action={`mailto:${config.notificationEmail}`}
              method="GET"
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Your Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="priya@example.com"
                    className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Inquiry Topic</label>
                <select
                  name="subject"
                  className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                >
                  {config.formSubjectOptions?.map((opt: string, i: number) => (
                    <option key={i} value={opt} className="bg-[#101320] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Your Message / Requirements</label>
                <textarea
                  required
                  rows={4}
                  name="body"
                  placeholder="How may our stylists or fulfillment specialists assist you?"
                  className="w-full p-3 bg-[#080A10] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>Send Direct Inquiry to Stylist Concierge</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <PlatformFooter />
    </div>
  );
}
