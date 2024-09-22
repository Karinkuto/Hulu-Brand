// @ts-nocheck
import create from "zustand";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  date: Date;
  adminReply?: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  addAdminReply: (reviewId: string, reply: string) => void;
  getProductReviews: (productId: string) => Review[];
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  addReview: (review) => {
    set((state) => ({
      reviews: [
        ...state.reviews,
        { ...review, id: Date.now().toString(), date: new Date() },
      ],
    }));
  },
  addAdminReply: (reviewId, reply) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, adminReply: reply } : review
      ),
    }));
  },
  getProductReviews: (productId) => {
    return get().reviews.filter((review) => review.productId === productId);
  },
}));
