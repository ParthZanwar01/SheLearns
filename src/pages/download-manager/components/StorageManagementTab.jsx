import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StorageManagementTab = ({ storageData, onCleanup, onOptimize }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCleanupModal, setShowCleanupModal] = useState(false);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getUsagePercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const getStorageColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const categories = [
    {
      id: 'videos',
      name: 'Videos',
      icon: 'Play',
      size: storageData.categories.videos,
      color: 'bg-blue-500',
      items: 45,
      description: 'Training videos and tutorials'
    },
    {
      id: 'pdfs',
      name: 'PDFs',
      icon: 'FileText',
      size: storageData.categories.pdfs,
      color: 'bg-red-500',
      items: 128,
      description: 'Documents and guides'
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: 'Volume2',
      size: storageData.categories.audio,
      color: 'bg-green-500',
      items: 67,
      description: 'Podcasts and audio lessons'
    },
    {
      id: 'images',
      name: 'Images',
      icon: 'Image',
      size: storageData.categories.images,
      color: 'bg-purple-500',
      items: 234,
      description: 'Infographics and visual aids'
    },
    {
      id: 'cache',
      name: 'Cache',
      icon: 'Database',
      size: storageData.categories.cache,
      color: 'bg-gray-500',
      items: 1,
      description: 'Temporary files and thumbnails'
    }
  ];

  const cleanupRecommendations = [
    {
      id: 'old-cache',
      title: 'Clear old cache files',
      description: 'Remove temporary files older than 30 days',
      size: 45 * 1024 * 1024,
      impact: 'Safe to remove',
      type: 'cache'
    },
    {
      id: 'duplicate-files',
      title: 'Remove duplicate downloads',
      description: '3 duplicate files found',
      size: 12 * 1024 * 1024,
      impact: 'Safe to remove',
      type: 'duplicates'
    },
    {
      id: 'unused-content',
      title: 'Archive unused content',
      description: 'Content not accessed in 60+ days',
      size: 156 * 1024 * 1024,
      impact: 'Move to cloud storage',
      type: 'archive'
    }
  ];

  const usagePercentage = getUsagePercentage(storageData.used, storageData.total);

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Storage Overview
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="HardDrive" size={16} />
            <span>Device Storage</span>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {formatBytes(storageData.used)} used of {formatBytes(storageData.total)}
            </span>
            <span className={`font-medium ${usagePercentage >= 90 ? 'text-error' : usagePercentage >= 75 ? 'text-warning' : 'text-foreground'}`}>
              {usagePercentage}% full
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getStorageColor(usagePercentage)}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatBytes(storageData.available)}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {storageData.totalFiles}
            </div>
            <div className="text-sm text-muted-foreground">Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {storageData.offlineFiles}
            </div>
            <div className="text-sm text-muted-foreground">Offline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(storageData.compressionRatio * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Compressed</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Storage by Category
        </h3>
        
        <div className="space-y-4">
          {categories.map((category) => {
            const percentage = getUsagePercentage(category.size, storageData.used);
            
            return (
              <div
                key={category.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-border/80 hover:bg-muted/30'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={category.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {formatBytes(category.size)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.items} items
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{percentage}% of total</span>
                    <span>Avg: {formatBytes(category.size / category.items)} per file</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cleanup Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Cleanup Recommendations
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCleanupModal(true)}
            className="flex items-center space-x-2"
          >
            <Icon name="Trash2" size={16} />
            <span>Clean Up</span>
          </Button>
        </div>

        <div className="space-y-3">
          {cleanupRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-success text-sm">
                  +{formatBytes(rec.size)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {rec.impact}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              Potential savings: {formatBytes(cleanupRecommendations.reduce((sum, rec) => sum + rec.size, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Storage Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Auto-cleanup</h4>
              <p className="text-sm text-muted-foreground">
                Automatically remove old cache files
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Compression</h4>
              <p className="text-sm text-muted-foreground">
                Compress downloads to save space
              </p>
            </div>
            <select className="text-sm bg-background border border-border rounded px-3 py-1.5 text-foreground">
              <option value="high">High compression</option>
              <option value="medium">Medium compression</option>
              <option value="low">Low compression</option>
              <option value="none">No compression</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Storage limit</h4>
              <p className="text-sm text-muted-foreground">
                Maximum storage for offline content
              </p>
            </div>
            <select className="text-sm bg-background border border-border rounded px-3 py-1.5 text-foreground">
              <option value="1gb">1 GB</option>
              <option value="2gb">2 GB</option>
              <option value="5gb">5 GB</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cleanup Modal */}
      {showCleanupModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-1001"
            onClick={() => setShowCleanupModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-1002">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  Confirm Cleanup
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCleanupModal(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6">
                This will free up approximately {formatBytes(cleanupRecommendations.reduce((sum, rec) => sum + rec.size, 0))} of storage space. This action cannot be undone.
              </p>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCleanupModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onCleanup();
                    setShowCleanupModal(false);
                  }}
                  className="flex-1"
                >
                  Clean Up
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageManagementTab;