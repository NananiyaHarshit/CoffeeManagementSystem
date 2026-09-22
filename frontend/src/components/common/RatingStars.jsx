import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating = 5, reviewCount, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-amber-500 inline" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-500 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-amber-300 inline" />);
    }
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1.5 ${iconSizes[size]}`}>
      <div className="flex gap-0.5">{stars}</div>
      <span className="font-semibold text-dark-espresso text-xs ml-1">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-coffee-brown/70">({reviewCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
