import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectivityIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      if (syncStatus === 'idle') {
        setSyncStatus('syncing');
        // Simulate sync process
        setTimeout(() => {
          setSyncStatus('idle');
          setLastSyncTime(new Date());
        }, 2000);
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
  }, [syncStatus, lastSyncTime]);

  const getStatusIcon = () => {
    if (!isOnline) return 'WifiOff';
    if (syncStatus === 'syncing') return 'RefreshCw';
    if (syncStatus === 'error') return 'AlertCircle';
    return 'Wifi';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-muted-foreground';
    if (syncStatus === 'syncing') return 'text-warning';
    if (syncStatus === 'error') return 'text-error';
    return 'text-success';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync Error';
    return 'Online';
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSyncTime) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Mobile: Icon only */}
      <div className="sm:hidden">
        <Icon 
          name={getStatusIcon()} 
          size={18} 
          className={`${getStatusColor()} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
        />
      </div>

      {/* Desktop: Icon + Text */}
      <div className="hidden sm:flex items-center space-x-2">
        <Icon 
          name={getStatusIcon()} 
          size={16} 
          className={`${getStatusColor()} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
        />
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {isOnline && lastSyncTime && syncStatus === 'idle' && (
            <span className="text-xs text-muted-foreground font-caption">
              {formatLastSync()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectivityIndicator;