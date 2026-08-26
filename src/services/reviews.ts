import { Review, ReviewSummary } from '@/types/review';
import { customerReviewsData } from '@/data/reviews';
import { ApiClient, ApiResponse } from './api';

let reviewsDatabase = [...customerReviewsData];

export class ReviewService {
  public static async getReviewsForProduct(productId: string): Promise<ApiResponse<{ reviews: Review[]; summary: ReviewSummary }>> {
    const reviews = reviewsDatabase.filter((r) => r.productId === productId || !productId);
    const pool = reviews.length > 0 ? reviews : customerReviewsData.slice(0, 3);

    const averageRating = pool.reduce((acc, r) => acc + r.rating, 0) / (pool.length || 1);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    pool.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
    });

    return ApiClient.simulateRequest({
      reviews: pool,
      summary: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: pool.length,
        ratingDistribution: distribution,
      },
    }, 60);
  }

  public static async submitReview(newReview: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>): Promise<ApiResponse<Review>> {
    const created: Review = {
      ...newReview,
      id: 'rev-' + Date.now(),
      date: 'Today',
      verifiedPurchase: true,
    };
    reviewsDatabase.unshift(created);
    return ApiClient.simulateRequest(created, 100);
  }

  public static async getFeaturedTestimonials(): Promise<ApiResponse<Review[]>> {
    return ApiClient.simulateRequest<Review[]>(customerReviewsData, 50);
  }
}
