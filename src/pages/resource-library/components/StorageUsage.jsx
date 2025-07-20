import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StorageUsage = ({ usedStorage, totalStorage, onCleanup, isVisible, onToggle }) => {
  const [showCleanupOptions, setShowCleanupOptions] = useState(false);

  const usagePercentage = (usedStorage / totalStorage) * 100;
  const availableStorage = totalStorage - usedStorage;

  const formatStorage = (sizeInMB) => {
    if (sizeInMB < 1024) return `${Math.round(sizeInMB)}MB`;
    return `${(sizeInMB / 1024).toFixed(1)}GB`;
  };

  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-error';
    if (usagePercentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const cleanupSuggestions = [
    {
      id: 'old-downloads',
      title: 'Old Downloads',
      description: 'Remove downloads older than 30 days',
      size: 45.2,
      count: 12
    },
    {
      id: 'large-files',
      title: 'Large Files',
      description: 'Remove files larger than 50MB',
      size: 128.5,
      count: 3
    },
    {
      id: 'duplicate-content',
      title: 'Duplicate Content',
      description: 'Remove duplicate or similar resources',
      size: 23.8,
      count: 7
    },
    {
      id: 'cache-data',
      title: 'Cache Data',
      description: 'Clear temporary files and thumbnails',
      size: 15.3,
      count: 1
    }
  ];

  if (!isVisible) {
    return (
      <div className="fixed bottom-32 md:bottom-16 right-4 z-1001">
        <button
          onClick={onToggle}
          className={`p-3 rounded-full shadow-modal transition-micro ${
            usagePercentage >= 90 
              ? 'bg-error text-error-foreground hover:bg-error/90'
              : usagePercentage >= 75
              ? 'bg-warning text-warning-foreground hover:bg-warning/90'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="HardDrive" size={20} />
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
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-1001 max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Storage Usage
          </h3>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Storage Overview */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-semibold text-foreground">
                Device Storage
              </h4>
              <span className="text-sm text-muted-foreground">
                {formatStorage(usedStorage)} / {formatStorage(totalStorage)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-background rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-500 ${getUsageColor()}`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatStorage(availableStorage)} available
              </span>
              <span className={`font-medium ${
                usagePercentage >= 90 ? 'text-error' :
                usagePercentage >= 75 ? 'text-warning' : 'text-foreground'
              }`}>
                {Math.round(usagePercentage)}% used
              </span>
            </div>

            {usagePercentage >= 75 && (
              <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">
                      Storage Almost Full
                    </p>
                    <p className="text-xs text-warning/80 mt-1">
                      Consider cleaning up old downloads to free up space
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cleanup Options */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-semibold text-foreground">
                Cleanup Suggestions
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCleanupOptions(!showCleanupOptions)}
                iconName={showCleanupOptions ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                {showCleanupOptions ? 'Hide' : 'Show'} Options
              </Button>
            </div>

            {showCleanupOptions && (
              <div className="space-y-3">
                {cleanupSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">
                        {suggestion.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                        <span>{formatStorage(suggestion.size)} to free</span>
                        <span>•</span>
                        <span>{suggestion.count} items</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCleanup(suggestion.id)}
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      Clean
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground">
              Quick Actions
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => onCleanup('all-cache')}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Clear All Cache
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onCleanup('optimize')}
                iconName="Zap"
                iconPosition="left"
              >
                Optimize Storage
              </Button>
            </div>

            <Button
              variant="destructive"
              fullWidth
              onClick={() => onCleanup('reset-all')}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Reset All Downloads
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorageUsage;