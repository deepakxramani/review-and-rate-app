'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 28,
  };
  const starSize = sizeMap[size];

  const handleClick = (star: number) => {
    if (interactive && onRate) {
      onRate(star);
    }
  };

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;
    const fillPercentage = Math.min(Math.max(activeRating - index, 0), 1) * 100;

    return (
      <span
        key={index}
        className={`star-wrapper ${interactive ? 'star-interactive' : ''}`}
        style={{ width: starSize, height: starSize }}
        onClick={() => handleClick(starNumber)}
        onMouseEnter={() => interactive && setHoverRating(starNumber)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `Rate ${starNumber} stars` : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          width={starSize}
          height={starSize}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`star-grad-${index}-${rating}`}>
              <stop offset={`${fillPercentage}%`} stopColor="#FFC107" />
              <stop offset={`${fillPercentage}%`} stopColor="#E0E0E0" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#star-grad-${index}-${rating})`}
            stroke="#FFC107"
            strokeWidth="0.5"
          />
        </svg>
      </span>
    );
  };

  return (
    <div className="star-rating">
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
    </div>
  );
}
