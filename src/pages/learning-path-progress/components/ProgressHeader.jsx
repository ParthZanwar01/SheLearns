import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressHeader = ({ currentPath, overallProgress, timeRemaining }) => {
  return (
    <div className="bg-card border-b border-border p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
          <Icon name="BookOpen" size={16} />
          <span>Learning Paths</span>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">{currentPath.title}</span>
        </div>

        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
              {currentPath.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {currentPath.description}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Progress Circle */}
            <div className="flex items-center space-x-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="var(--color-muted)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallProgress / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">{overallProgress}%</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-xs text-muted-foreground">
                  {timeRemaining} remaining
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
                <Icon name="Share2" size={18} />
              </button>
              <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
                <Icon name="Bookmark" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;