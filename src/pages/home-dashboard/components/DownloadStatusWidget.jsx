import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const DownloadStatusWidget = ({ storageUsed, storageTotal, activeDownloads, queuedDownloads }) => {
  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);
  const totalDownloads = activeDownloads + queuedDownloads;

  const getStorageColor = () => {
    if (storagePercentage >= 90) return 'text-error';
    if (storagePercentage >= 75) return 'text-warning';
    return 'text-success';
  };

  const getStorageBarColor = () => {
    if (storagePercentage >= 90) return 'bg-error';
    if (storagePercentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Storage & Downloads
        </h2>
        <Link 
          to="/download-manager"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-micro"
        >
          Manage
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="HardDrive" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Storage Used
            </span>
          </div>
          <span className={`text-sm font-medium ${getStorageColor()}`}>
            {storageUsed} MB / {storageTotal} MB
          </span>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full ${getStorageBarColor()} transition-all duration-300`}
            style={{ width: `${storagePercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Download" size={16} className="text-primary" />
              <span className="text-lg font-heading font-bold text-primary">
                {activeDownloads}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-caption">
              Active Downloads
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Clock" size={16} className="text-secondary" />
              <span className="text-lg font-heading font-bold text-secondary">
                {queuedDownloads}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-caption">
              In Queue
            </p>
          </div>
        </div>

        {totalDownloads > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-caption">
                {totalDownloads} total downloads
              </span>
              <Link
                to="/download-manager"
                className="text-xs text-primary hover:text-primary/80 font-medium transition-micro"
              >
                View queue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadStatusWidget;