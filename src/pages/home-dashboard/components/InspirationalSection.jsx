import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const InspirationalSection = ({ quotes, upcomingEvents }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="mb-6">
      {/* Inspirational Quote */}
      <div className="bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-lg p-6 mb-4">
        <div className="flex items-start space-x-3">
          <Icon name="Quote" size={24} className="text-accent flex-shrink-0 mt-1" />
          <div className="flex-1">
            <blockquote className="text-foreground font-medium mb-2">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground font-caption">
              — {currentQuote.author}
            </cite>
          </div>
        </div>
        
        <div className="flex justify-center mt-4 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuoteIndex(index)}
              className={`w-2 h-2 rounded-full transition-micro ${
                index === currentQuoteIndex ? 'bg-accent' : 'bg-accent/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Calendar" size={16} className="text-primary" />
            <h3 className="font-medium text-foreground text-sm">
              Upcoming Local Events
            </h3>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs text-primary font-caption">
                    {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-caption">
                      {event.location}
                    </span>
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspirationalSection;