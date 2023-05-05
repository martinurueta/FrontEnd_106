import React, { useState } from 'react';

type CourseRatingProps = {
  onRating: (rating: number) => void;
};

const CourseRating: React.FC<CourseRatingProps> = ({ onRating }) => {
    
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleMouseOver = (event: React.MouseEvent<HTMLSpanElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const half = offsetX < rect.width / 2;
    setHoveredRating(index + (half ? 0.5 : 1));
  };

  const handleMouseOut = () => {
    setHoveredRating(0);
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    onRating(rating);
  };

  const renderStar = (index: number) => {
    const isFullStar = (hoveredRating !== 0 ? hoveredRating : selectedRating) >= index + 1;
    const isHalfStar =
      (hoveredRating !== 0 ? hoveredRating : selectedRating) >= index + 0.5 && !isFullStar;

    return (
      <span
        className={`star fa ${isFullStar ? 'fa-star' : isHalfStar ? 'fa-star-half-o' : 'fa-star-o'}`}
        onMouseMove={(event) => handleMouseOver(event, index)}
        onMouseOut={handleMouseOut}
        onClick={() => handleClick(hoveredRating)}
      />
    );
  };

  return (
    <div className="star-rating">
      {Array.from({ length: 5 }, (_, i) => i).map(renderStar)}
    </div>
  );
};

export default CourseRating;
