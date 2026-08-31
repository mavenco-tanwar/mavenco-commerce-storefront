'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, Sparkles, CheckCircle2, Clock, Zap, ArrowRight, Loader2 } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  status: string;
  statusColor: string;
  votes: number;
  desc: string;
  hasVoted?: boolean;
}

export function PlatformRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  const loadRoadmapFromDb = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/platform/roadmap').then((r) => r.json());
      if (res?.data && Array.isArray(res.data)) {
        // Read local storage to see which items this user voted on
        const votedIds: string[] = JSON.parse(localStorage.getItem('mavenco_roadmap_votes') || '[]');
        const hydrated = res.data.map((item: RoadmapItem) => ({
          ...item,
          hasVoted: votedIds.includes(item.id),
        }));
        setItems(hydrated);
      }
    } catch (e) {
      console.warn('Failed to load roadmap from MongoDB Atlas:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmapFromDb();
  }, []);

  const handleVote = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || votingId) return;

    const willVote = !item.hasVoted;
    const delta = willVote ? 1 : -1;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, votes: i.votes + delta, hasVoted: willVote } : i))
    );

    // Save vote to local storage
    const votedIds: string[] = JSON.parse(localStorage.getItem('mavenco_roadmap_votes') || '[]');
    if (willVote) {
      localStorage.setItem('mavenco_roadmap_votes', JSON.stringify([...votedIds, id]));
    } else {
      localStorage.setItem('mavenco_roadmap_votes', JSON.stringify(votedIds.filter((v) => v !== id)));
    }

    setVotingId(id);
    try {
      await fetch('/api/v1/platform/roadmap/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta }),
      });
    } catch (e) {
      console.error('Failed to record vote to MongoDB:', e);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Transparent Platform Roadmap (MongoDB Atlas Live)</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Shaping the Future of Headless D2C
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Upvote upcoming capabilities or request custom integrations. All votes are recorded live to the platform database.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span>Connecting to MongoDB Atlas Cluster...</span>
        </div>
      ) : (
        /* Roadmap Grid */
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
                  disabled={votingId === item.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    item.hasVoted
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-[#121522] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${item.hasVoted ? 'fill-white' : ''}`} />
                  <span>{item.votes} Upvotes</span>
                </button>

                <span className="text-[11px] text-slate-500 font-mono">DB Synced</span>
              </div>
            </div>
          ))}
        </div>
      )}

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
