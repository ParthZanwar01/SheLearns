import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error
  const [pendingPosts, setPendingPosts] = useState(3);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      if (pendingPosts > 0) {
        setSyncStatus('syncing');
        // Simulate sync process
        setTimeout(() => {
          setSyncStatus('idle');
          setPendingPosts(0);
          setLastSyncTime(new Date());
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize last sync time
    if (!lastSyncTime && isOnline) {
      setLastSyncTime(new Date());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingPosts, lastSyncTime]);

  const handleManualSync = () => {
    if (isOnline && pendingPosts > 0) {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('idle');
        setPendingPosts(0);
        setLastSyncTime(new Date());
      }, 2000);
    }
  };

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

  // Don't show banner if online and no pending items
  if (isOnline && pendingPosts === 0 && syncStatus === 'idle') {
    return null;
  }

  return (
    <div className={`border-b ${
      !isOnline ? 'bg-error/10 border-error/20' :
      syncStatus === 'syncing' ? 'bg-warning/10 border-warning/20' :
      pendingPosts > 0 ? 'bg-primary/10 border-primary/20': 'bg-success/10 border-success/20'
    }`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon 
              name={
                !isOnline ? 'WifiOff' :
                syncStatus === 'syncing' ? 'RefreshCw' :
                pendingPosts > 0 ? 'Clock': 'CheckCircle'
              }
              size={20}
              className={`${
                !isOnline ? 'text-error' :
                syncStatus === 'syncing' ? 'text-warning animate-spin' :
                pendingPosts > 0 ? 'text-primary': 'text-success'
              }`}
            />
            
            <div>
              <p className={`text-sm font-medium ${
                !isOnline ? 'text-error' :
                syncStatus === 'syncing' ? 'text-warning' :
                pendingPosts > 0 ? 'text-primary': 'text-success'
              }`}>
                {!isOnline ? 'You\'re offline' :
                 syncStatus === 'syncing' ? 'Syncing your posts...' :
                 pendingPosts > 0 ? `${pendingPosts} posts waiting to sync` :
                 'All posts synced'}
              </p>
              
              <p className="text-xs text-muted-foreground">
                {!isOnline ? 'Your posts will be saved and synced when you reconnect' :
                 syncStatus === 'syncing' ? 'Please wait while we update your content' :
                 pendingPosts > 0 ? 'Connect to WiFi to publish your drafts' :
                 lastSyncTime ? `Last synced ${formatLastSync()}` : ''}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {isOnline && pendingPosts > 0 && syncStatus === 'idle' && (
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={handleManualSync}
              >
                Sync Now
              </Button>
            )}
            
            {!isOnline && (
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
              >
                View Drafts
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar for Syncing */}
        {syncStatus === 'syncing' && (
          <div className="mt-2">
            <div className="w-full bg-background rounded-full h-1 overflow-hidden">
              <div className="h-full bg-warning animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusBanner;