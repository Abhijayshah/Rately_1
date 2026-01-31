import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };
  
  const starSize = sizeClasses[size];
  const displayRating = hoverRating || rating;
  
  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };
  
  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex items-center space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= displayRating;
          
          return (
            <Star
              key={starValue}
              className={`
                ${starSize}
                ${readonly ? '' : 'cursor-pointer'}
                transition-colors duration-150
                ${
                  isFilled
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-400'
                }
              `}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
            />
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-400 ml-2">
          {rating > 0 ? rating.toFixed(1) : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default StarRating;