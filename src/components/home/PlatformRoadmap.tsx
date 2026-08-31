'use client';

import React, { useState } from 'react';
import { ThumbsUp, Sparkles, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';

export function PlatformRoadmap() {
  const [items, setItems] = useState([
    {
      id: 'road_1',
      title: 'Automated Shiprocket & Delhivery Logistics Sync',
      category: 'Fulfillment & Operations',
      status: 'In Progress',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      votes: 142,
      hasVoted: false,
      desc: 'Auto-generate AWB tracking numbers and print thermal shipping labels with 1 click directly from the Merchant Admin.',
    },
    {
      id: 'road_2',
      title: 'AI Fashion Model Photo Replacement Studio',
      category: 'Visual AI Studio',
      status: 'Planned (Q4)',
      statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      votes: 98,
      hasVoted: false,
      desc: 'Swap product mannequins into editorial fashion models across diverse ethnicities with zero studio photography costs.',
    },
    {
      id: 'road_3',
      title: 'Sub-40ms Anycast Edge Dynamic Routing',
      category: 'Cloud Infrastructure',
      status: 'Live in Production',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      votes: 215,
      hasVoted: true,
      desc: 'Global Anycast CDN with sub-40ms TTFB across 280+ edge points of presence on Next.js 16 Edge runtime.',
    },
    {
      id: 'road_4',
      title: 'Multi-Warehouse Inventory & Split Fulfillment',
      category: 'Enterprise Scaling',
      status: 'In Progress',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      votes: 76,
      hasVoted: false,
      desc: 'Route orders automatically to the nearest regional warehouse (Delhi NCR, Mumbai, Bengaluru) for same-day delivery.',
    },
  ]);

  const handleVote = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            votes: item.hasVoted ? item.votes - 1 : item.votes + 1,
            hasVoted: !item.hasVoted,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Transparent Platform Roadmap</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Shaping the Future of Headless D2C
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Upvote upcoming capabilities or request custom integrations with our core engineering team.
        </p>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#0A0C10] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">{item.category}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleVote(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  item.hasVoted
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#121522] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${item.hasVoted ? 'fill-white' : ''}`} />
                <span>{item.votes} Upvotes</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono">Quarterly Cycle</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <a
          href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20have%20a%20feature%20request%20for%20the%20platform%20roadmap."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline"
        >
          <span>Submit a Custom Integration Request</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
