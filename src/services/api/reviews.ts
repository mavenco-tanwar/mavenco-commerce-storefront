import { Review, ReviewSummary } from '@/types/review';

export class ReviewApiService {
  private static mockReviews: Record<string, Review[]> = {
    prod_jq_01: [
      {
        id: 'rev_1',
        productId: 'prod_jq_01',
        authorName: 'Priya Sundaram',
        rating: 5,
        title: 'Breathtaking Summer Dress!',
        comment: 'The fabric is so light and breathable. Wore it to an outdoor Sunday brunch in Bengaluru and received so many compliments!',
        verifiedPurchase: true,
        likesCount: 14,
        date: '15 Aug 2026',
        sizePurchased: 'S',
        colorPurchased: 'Blush Pink',
      },
      {
        id: 'rev_2',
        productId: 'prod_jq_01',
        authorName: 'Sneha Roy',
        rating: 5,
        title: 'Perfect Fit & Stunning Georgette',
        comment: 'True to size. The tiered flow is very flattering. The lining ensures it is not see-through at all.',
        verifiedPurchase: true,
        likesCount: 9,
        date: '10 Aug 2026',
        sizePurchased: 'M',
        colorPurchased: 'Dusty Rose',
      },
    ],
  };

  public static async getReviewsForProduct(productId: string): Promise<{ data: { reviews: Review[]; summary: ReviewSummary } }> {
    const list = this.mockReviews[productId] || [
      {
        id: 'rev_default_1',
        productId,
        authorName: 'Aanya K.',
        rating: 5,
        title: 'Exquisite Craftsmanship',
        comment: 'High boutique quality fabric and stitching. Looks exactly like the photos.',
        verifiedPurchase: true,
        likesCount: 6,
        date: '20 Aug 2026',
        sizePurchased: 'M',
        colorPurchased: 'Blush Pink',
      },
    ];

    const total = list.length;
    const avg = +(list.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);

    return {
      data: {
        reviews: list,
        summary: {
          averageRating: avg || 4.9,
          totalReviews: total || 1,
          ratingDistribution: { 5: total, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
    };
  }

  public static async submitReview(
    arg1: string | { productId: string; authorName: string; rating: number; title: string; comment: string; likesCount?: number },
    arg2?: { authorName: string; rating: number; title: string; comment: string; sizePurchased?: string; colorPurchased?: string }
  ): Promise<{ data: Review }> {
    let pid = '';
    let payload: any = {};

    if (typeof arg1 === 'string') {
      pid = arg1;
      payload = arg2 || {};
    } else {
      pid = arg1.productId;
      payload = arg1;
    }

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      productId: pid,
      authorName: payload.authorName || 'Verified Buyer',
      rating: payload.rating || 5,
      title: payload.title || 'Loved this purchase!',
      comment: payload.comment || '',
      verifiedPurchase: true,
      likesCount: 0,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sizePurchased: payload.sizePurchased,
      colorPurchased: payload.colorPurchased,
    };

    if (!this.mockReviews[pid]) {
      this.mockReviews[pid] = [];
    }
    this.mockReviews[pid].unshift(newRev);

    return { data: newRev };
  }
}
