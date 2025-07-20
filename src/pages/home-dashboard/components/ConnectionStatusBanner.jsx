import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatusBanner = ({ isOnline, syncProgress, lastSyncTime }) => {
  const formatLastSync = () => {
    if (!lastSyncTime) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSyncTime) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  if (isOnline && syncProgress === null) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Wifi" size={20} className="text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">Connected</p>
            <p className="text-xs text-muted-foreground font-caption">
              Last synced {formatLastSync()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isOnline && syncProgress !== null) {
    return (
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="RefreshCw" size={20} className="text-warning animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-warning">Syncing content...</p>
            <div className="w-full h-2 bg-background rounded-full mt-2">
              <div 
                className="h-full bg-warning rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono text-warning">{syncProgress}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <Icon name="WifiOff" size={20} className="text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Offline Mode</p>
          <p className="text-xs text-muted-foreground font-caption">
            Using cached content • Will sync when connected
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatusBanner;