import React from 'react';
import { Review } from '../types/review';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 rounded-md">
          <p>Rating: {review.rating}/5</p>
          <p>{review.comment}</p>
          {review.adminReply && (
            <div className="mt-2 bg-gray-100 p-2 rounded-md">
              <p className="font-bold">Admin Reply:</p>
              <p>{review.adminReply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
