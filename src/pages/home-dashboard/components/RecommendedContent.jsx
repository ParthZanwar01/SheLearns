import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecommendedContent = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const visibleRecommendations = recommendations.slice(currentIndex, currentIndex + 2);
  if (visibleRecommendations.length === 1 && recommendations.length > 1) {
    visibleRecommendations.push(recommendations[0]);
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Recommended for You
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-micro"
            disabled={recommendations.length <= 2}
          >
            <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-micro"
            disabled={recommendations.length <= 2}
          >
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleRecommendations.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            to="/resource-library"
            className="block bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition-micro"
          >
            <div className="aspect-video bg-muted overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.categoryColor} ${item.categoryTextColor}`}>
                  {item.category}
                </span>
                <span className="text-xs text-muted-foreground font-caption">
                  {item.duration}
                </span>
              </div>
              <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground font-caption line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-xs font-medium text-foreground">
                    {item.rating}
                  </span>
                </div>
                <span className="text-xs text-primary font-medium">
                  {item.isNew ? 'New' : 'Popular'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedContent;