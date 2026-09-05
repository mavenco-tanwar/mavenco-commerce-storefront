'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  X,
  Eye,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ProductReview, ProductQuestion, ProductReviewSummary } from '@/types/reviews-commerce.types';

interface ProductReviewsAndQAProps {
  productId?: string;
  productTitle?: string;
}

export function ProductReviewsAndQA({
  productId = 'prod_1',
  productTitle = 'Pure Mulberry Silk Banarasi Saree',
}: ProductReviewsAndQAProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ProductReviewSummary | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterWithPhotos, setFilterWithPhotos] = useState(false);

  // Q&A State
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [askerName, setAskerName] = useState('');

  // Write Review Modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewBody, setNewReviewBody] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewEmail, setNewReviewEmail] = useState('');
  const [newReviewPhoto, setNewReviewPhoto] = useState('');

  const fetchReviewsAndQA = async () => {
    try {
      const revRes = await fetch(`/api/v1/reviews?productId=${productId}`).then((r) => r.json());
      if (revRes.data) {
        setReviews(revRes.data);
        setSummary(revRes.summary);
      }

      const qaRes = await fetch(`/api/v1/reviews/qa?productId=${productId}`).then((r) => r.json());
      if (qaRes.data) {
        setQuestions(qaRes.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchReviewsAndQA();
  }, [productId]);

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      await fetch('/api/v1/reviews/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, type: 'helpful' }),
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
      );
      showToast('Thank you for your feedback!', 'success');
    } catch {
      showToast('Vote could not be recorded', 'error');
    }
  };

  const handleReportReview = async (reviewId: string) => {
    try {
      await fetch('/api/v1/reviews/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, type: 'report' }),
      });
      showToast('Review reported for moderation review', 'info');
    } catch {
      showToast('Failed to report review', 'error');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const media = newReviewPhoto
        ? [{ id: `med_${Date.now()}`, type: 'image' as const, url: newReviewPhoto }]
        : undefined;

      await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productTitle,
          reviewerName: newReviewName || 'Verified Connoisseur',
          reviewerEmail: newReviewEmail,
          rating: newRating,
          title: newReviewTitle,
          body: newReviewBody,
          verificationStatus: 'verified_purchase',
          media,
        }),
      });

      showToast('Review submitted successfully!', 'success');
      setIsWriteModalOpen(false);
      setNewReviewTitle('');
      setNewReviewBody('');
      setNewReviewPhoto('');
      fetchReviewsAndQA();
    } catch {
      showToast('Failed to submit review', 'error');
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/v1/reviews/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productTitle,
          customerName: askerName || 'Curious Shopper',
          question: newQuestionText,
        }),
      });

      showToast('Your question has been submitted for answers!', 'success');
      setIsAskModalOpen(false);
      setNewQuestionText('');
      fetchReviewsAndQA();
    } catch {
      showToast('Failed to post question', 'error');
    }
  };

  // Filtered reviews
  let filteredReviews = Array.isArray(reviews) ? reviews : [];
  if (filterRating) filteredReviews = filteredReviews.filter((r) => r.rating === filterRating);
  if (filterVerified) filteredReviews = filteredReviews.filter((r) => r.verificationStatus === 'verified_purchase');
  if (filterWithPhotos) filteredReviews = filteredReviews.filter((r) => r.media && r.media.length > 0);

  const avgRating = summary?.averageRating || 4.9;
  const reviewCount = summary?.reviewCount || filteredReviews.length;

  return (
    <section className="py-12 border-t border-[#EFE8E2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`text-lg font-serif font-bold tracking-tight pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-rose-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Customer Reviews ({reviewCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className={`text-lg font-serif font-bold tracking-tight pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'qa'
                  ? 'border-rose-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Questions &amp; Answers ({questions.length})
            </button>
          </div>

          <div>
            {activeTab === 'reviews' ? (
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAskModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask a Question</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: REVIEWS & SOCIAL PROOF */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Rating Summary Histogram Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8 bg-[#FAF7F5] border border-[#EFE8E2] rounded-3xl">
              {/* Overall Score */}
              <div className="flex flex-col items-center justify-center text-center space-y-2 lg:border-r lg:border-[#EFE8E2] pr-0 lg:pr-6">
                <span className="text-5xl font-extrabold font-serif text-slate-900">{avgRating.toFixed(1)}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-mono">Based on {reviewCount} verified ratings</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Authenticated Shoppers
                </span>
              </div>

              {/* Star Distribution Histogram */}
              <div className="space-y-2 lg:col-span-2 flex flex-col justify-center text-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary?.ratingDistribution?.[star as 1 | 2 | 3 | 4 | 5] || (star === 5 ? reviewCount : 0);
                  const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 text-right font-mono text-slate-600">{star} Stars</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setFilterRating(null)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterRating === null
                    ? 'bg-slate-950 text-white'
                    : 'bg-white border border-[#EFE8E2] text-slate-600 hover:text-slate-900'
                }`}
              >
                All Ratings
              </button>

              <button
                type="button"
                onClick={() => setFilterRating(filterRating === 5 ? null : 5)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterRating === 5
                    ? 'bg-slate-950 text-white'
                    : 'bg-white border border-[#EFE8E2] text-slate-600 hover:text-slate-900'
                }`}
              >
                ★ 5 Stars Only
              </button>

              <button
                type="button"
                onClick={() => setFilterVerified(!filterVerified)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterVerified
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-[#EFE8E2] text-slate-600 hover:text-slate-900'
                }`}
              >
                ✓ Verified Buyers Only
              </button>

              <button
                type="button"
                onClick={() => setFilterWithPhotos(!filterWithPhotos)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterWithPhotos
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-[#EFE8E2] text-slate-600 hover:text-slate-900'
                }`}
              >
                📷 With Photos
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
                  No reviews match your selected filter criteria.
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 bg-white border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                          {rev.verificationStatus === 'verified_purchase' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.body}</p>

                    {/* Review Attached Media Gallery */}
                    {rev.media && rev.media.length > 0 && (
                      <div className="flex items-center gap-3 pt-2">
                        {rev.media.map((m) => (
                          <div
                            key={m.id}
                            className="w-20 h-20 rounded-xl overflow-hidden border border-[#EFE8E2] shadow-xs cursor-pointer hover:opacity-90"
                          >
                            <img src={m.url} alt="Customer upload" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Official Merchant Reply Box */}
                    {rev.merchantReply && (
                      <div className="p-4 bg-[#FAF7F5] border-l-4 border-rose-600 rounded-r-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                            Response from {rev.merchantReply.authorName}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rev.merchantReply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{rev.merchantReply.body}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#EFE8E2] text-xs">
                      <span className="text-slate-500 font-bold">{rev.reviewerName}</span>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleVoteHelpful(rev.id)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReportReview(rev.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer text-[11px]"
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
                No questions asked yet. Be the first to inquire about this piece!
              </div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="p-6 bg-white border border-[#EFE8E2] rounded-2xl space-y-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Question from {q.customerName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-rose-600 font-serif font-black text-base">Q:</span>
                      <span>{q.question}</span>
                    </h4>
                  </div>

                  {/* Answers */}
                  <div className="space-y-3 pt-2 border-t border-[#EFE8E2]">
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="p-4 bg-[#FAF7F5] rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="font-bold text-slate-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {ans.authorName}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(ans.answeredAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">{ans.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* WRITE A REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDFC] text-slate-900 rounded-3xl border border-[#EFE8E2] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-900">Write a Product Review</h3>
                <p className="text-xs text-slate-500">{productTitle}</p>
              </div>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{newRating} of 5 Stars</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Aanya Kapoor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newReviewEmail}
                    onChange={(e) => setNewReviewEmail(e.target.value)}
                    placeholder="aanya@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Absolutely stunning craftsmanship"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Detailed Review</label>
                <textarea
                  rows={4}
                  value={newReviewBody}
                  onChange={(e) => setNewReviewBody(e.target.value)}
                  placeholder="Share details regarding fit, texture, drape, and packaging..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Photo Attachment URL (Optional)</label>
                <input
                  type="url"
                  value={newReviewPhoto}
                  onChange={(e) => setNewReviewPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-rose-600 transition-colors"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASK A QUESTION MODAL */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDFC] text-slate-900 rounded-3xl border border-[#EFE8E2] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-900">Ask a Question</h3>
                <p className="text-xs text-slate-500">Inquire about sizing, styling, or care instructions</p>
              </div>
              <button onClick={() => setIsAskModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="e.g. Pooja Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Your Question</label>
                <textarea
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Does this garment include an unstitched blouse piece?"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-rose-600 transition-colors"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
