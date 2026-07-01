'use client';

import React from 'react';
import StarRating from './StarRating';
import { Review } from '@/services/reviewService';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}, ${hh}:${min}`;
  };

  // Generate avatar color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#7C3AED', '#EC4899', '#EF4444', '#F59E0B',
      '#10B981', '#3B82F6', '#8B5CF6', '#06B6D4',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = review.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="review-card" id={`review-${review._id}`}>
      <div className="review-header">
        <div
          className="review-avatar"
          style={{ backgroundColor: getAvatarColor(review.fullName) }}
        >
          {initials}
        </div>
        <div className="review-meta">
          <h4 className="review-author">{review.fullName}</h4>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
        <div className="review-rating-badge">
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      {review.subject && (
        <h5 className="review-subject">{review.subject}</h5>
      )}

      <p className="review-text">{review.review}</p>
    </div>
  );
}
