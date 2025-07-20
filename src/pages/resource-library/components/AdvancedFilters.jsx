import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const AdvancedFilters = ({ filters, onFiltersChange, isVisible, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const businessStageOptions = [
    { value: 'idea', label: 'Idea Stage' },
    { value: 'startup', label: 'Startup' },
    { value: 'growth', label: 'Growth Stage' },
    { value: 'established', label: 'Established Business' }
  ];

  const marketOptions = [
    { value: 'urban', label: 'Urban Markets' },
    { value: 'rural', label: 'Rural Markets' },
    { value: 'online', label: 'Online/Digital' },
    { value: 'local', label: 'Local Community' }
  ];

  const mentorOptions = [
    { value: 'recommended', label: 'Mentor Recommended' },
    { value: 'trending', label: 'Trending in Community' },
    { value: 'beginner-friendly', label: 'Beginner Friendly' },
    { value: 'expert-level', label: 'Expert Level' }
  ];

  const durationRanges = [
    { value: '0-15', label: 'Under 15 minutes' },
    { value: '15-30', label: '15-30 minutes' },
    { value: '30-60', label: '30-60 minutes' },
    { value: '60+', label: 'Over 1 hour' }
  ];

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onToggle();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      businessStage: [],
      marketType: [],
      mentorRecommended: [],
      duration: [],
      hasSubtitles: false,
      isInteractive: false,
      hasWorksheets: false,
      isCertified: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (typeof value === 'boolean' && value) {
        count += 1;
      }
    });
    return count;
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-44 md:bottom-28 right-4 z-1001">
        <button
          onClick={onToggle}
          className="bg-card border border-border text-foreground p-3 rounded-full shadow-modal hover:bg-muted transition-micro"
        >
          <div className="relative">
            <Icon name="Filter" size={20} />
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-1000"
        onClick={onToggle}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border z-1001 flex flex-col animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Advanced Filters
          </h3>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Business Stage */}
          <div>
            <Select
              label="Business Stage"
              description="Filter by your current business development stage"
              options={businessStageOptions}
              value={localFilters.businessStage}
              onChange={(value) => handleLocalFilterChange('businessStage', value)}
              multiple
              searchable
              clearable
              placeholder="Select business stages..."
            />
          </div>

          {/* Market Type */}
          <div>
            <Select
              label="Market Applicability"
              description="Choose content relevant to your target market"
              options={marketOptions}
              value={localFilters.marketType}
              onChange={(value) => handleLocalFilterChange('marketType', value)}
              multiple
              searchable
              clearable
              placeholder="Select market types..."
            />
          </div>

          {/* Mentor Recommendations */}
          <div>
            <Select
              label="Recommendations"
              description="Filter by mentor and community recommendations"
              options={mentorOptions}
              value={localFilters.mentorRecommended}
              onChange={(value) => handleLocalFilterChange('mentorRecommended', value)}
              multiple
              searchable
              clearable
              placeholder="Select recommendation types..."
            />
          </div>

          {/* Duration */}
          <div>
            <Select
              label="Content Duration"
              description="Filter by time commitment required"
              options={durationRanges}
              value={localFilters.duration}
              onChange={(value) => handleLocalFilterChange('duration', value)}
              multiple
              clearable
              placeholder="Select duration ranges..."
            />
          </div>

          {/* Feature Filters */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
              Content Features
            </h4>
            <div className="space-y-3">
              <Checkbox
                label="Has Subtitles"
                description="Content includes subtitle support"
                checked={localFilters.hasSubtitles}
                onChange={(e) => handleLocalFilterChange('hasSubtitles', e.target.checked)}
              />
              
              <Checkbox
                label="Interactive Content"
                description="Includes quizzes, exercises, or interactive elements"
                checked={localFilters.isInteractive}
                onChange={(e) => handleLocalFilterChange('isInteractive', e.target.checked)}
              />
              
              <Checkbox
                label="Has Worksheets"
                description="Includes downloadable worksheets or templates"
                checked={localFilters.hasWorksheets}
                onChange={(e) => handleLocalFilterChange('hasWorksheets', e.target.checked)}
              />
              
              <Checkbox
                label="Certified Content"
                description="Provides completion certificates"
                checked={localFilters.isCertified}
                onChange={(e) => handleLocalFilterChange('isCertified', e.target.checked)}
              />
            </div>
          </div>

          {/* Content Quality */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
              Quality Indicators
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Minimum Rating</p>
                  <p className="text-xs text-muted-foreground">Show only highly rated content</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleLocalFilterChange('minRating', star)}
                      className={`p-1 ${
                        star <= (localFilters.minRating || 0)
                          ? 'text-warning' :'text-muted-foreground hover:text-warning'
                      } transition-micro`}
                    >
                      <Icon name="Star" size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{getActiveFilterCount()} filters active</span>
            <button
              onClick={handleResetFilters}
              className="text-primary hover:text-primary/80 font-medium transition-micro"
            >
              Reset All
            </button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onToggle}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleApplyFilters}
              className="flex-1"
              iconName="Check"
              iconPosition="left"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilters;