'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, ThumbsUp } from 'lucide-react';
import { Review, ReviewSummary } from '@/types/review';
import { ReviewService } from '@/services/reviews';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

export interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await ReviewService.getReviewsForProduct(productId);
        setReviews(res.data.reviews);
        setSummary(res.data.summary);
      } catch (e) {
        console.error('Failed to load reviews', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await ReviewService.submitReview({
        productId,
        authorName: formName,
        rating: formRating,
        title: formTitle || 'Loved this purchase!',
        comment: formComment,
        likesCount: 0,
      });

      setReviews((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormName('');
      setFormTitle('');
      setFormComment('');
      showToast('Review Submitted', 'Thank you for sharing your experience!', 'success');
    } catch {
      showToast('Failed to submit review', undefined, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !summary) {
    return <div className="py-8 text-center text-xs text-[#777777]">Loading customer reviews...</div>;
  }

  return (
    <div className="pt-12 border-t border-[#E8DED8]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E8DED8]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            Customer Feedback
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#111111] mt-1">
            Ratings &amp; Verified Reviews
          </h3>
        </div>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<MessageSquarePlus className="w-4 h-4 text-[#B77A68]" />}
          onClick={() => setIsModalOpen(true)}
        >
          Write a Review
        </Button>
      </div>

      {/* Summary Scorecard & Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-[#E8DED8]">
        {/* Left: Big Score */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#FAF6F2] border border-[#E8DED8] text-center">
          <span className="text-5xl font-serif font-bold text-[#111111]">
            {summary.averageRating}
          </span>
          <div className="my-2">
            <RatingStars rating={summary.averageRating} size="md" />
          </div>
          <span className="text-xs text-[#777777]">
            Based on {summary.totalReviews} verified verified customer ratings
          </span>
        </div>

        {/* Middle & Right: Star Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.ratingDistribution[star as keyof typeof summary.ratingDistribution] || 0;
            const percent = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#111111] font-semibold flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-[#B77A68] text-[#B77A68]" />
                </span>
                <div className="flex-1 h-2 bg-[#F8F1EA] overflow-hidden rounded-full border border-[#E8DED8]">
                  <div
                    className="h-full bg-[#B77A68] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[#777777]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-[#E8DED8]">
        {reviews.map((rev) => (
          <div key={rev.id} className="py-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RatingStars rating={rev.rating} size="xs" />
                <span className="text-xs font-bold text-[#111111]">{rev.authorName}</span>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#B77A68] font-semibold bg-[#F7EBEA] px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-xs text-[#777777]">{rev.date}</span>
            </div>

            {(rev.sizePurchased || rev.colorPurchased) && (
              <div className="text-[11px] text-[#777777]">
                {rev.sizePurchased && <span>Size: {rev.sizePurchased}</span>}
                {rev.sizePurchased && rev.colorPurchased && <span> • </span>}
                {rev.colorPurchased && <span>Color: {rev.colorPurchased}</span>}
              </div>
            )}

            <h5 className="text-sm font-semibold text-[#111111]">{rev.title}</h5>
            <p className="text-xs text-[#777777] leading-relaxed font-sans">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Customer Review"
        subtitle={`Reviewing: ${productName}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formRating
                        ? 'fill-[#B77A68] text-[#B77A68]'
                        : 'text-[#E8DED8]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Review Headline
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Stunning fabric and perfect fit!"
              className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Your Review *
            </label>
            <textarea
              required
              rows={4}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Tell others what you loved about the fit, texture, and styling..."
              className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
