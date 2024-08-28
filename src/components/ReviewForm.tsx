import React, { useState } from 'react';
import { useReviewStore } from '../stores/reviewStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { addReview } = useReviewStore();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      addReview({
        productId,
        userId: user.id,
        rating,
        comment,
      });
      setRating(5);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating">Rating</label>
        <Input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="comment">Comment</label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
}