import React from 'react';

type GetStarProps = {
  rating: number;
};

const GetStar: React.FC<GetStarProps> = ({ rating }) => {
  const renderStar = (index: number) => {
    const isFullStar = rating >= index + 1;
    const isHalfStar = rating >= index + 0.5 && !isFullStar;

    return (
      <span
        className={`star fa ${isFullStar ? 'fa-star' : isHalfStar ? 'fa-star-half-o' : 'fa-star-o'}`}
      />
    );
  };

  return (
    <div className="star-rating non-interactive">
        {Array.from({ length: 5 }, (_, i) => i).map(renderStar)}
    </div>
  );
};

export default GetStar;
