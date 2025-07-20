import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectivityStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate speed test when coming online
      setTimeout(() => {
        setDownloadSpeed(Math.random() * 10 + 1); // 1-11 Mbps
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDownloadSpeed(null);
    };

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const updateConnection = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', updateConnection);
      
      return () => {
        connection.removeEventListener('change', updateConnection);
      };
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize
    if (isOnline) {
      setLastSyncTime(new Date());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  const getConnectionIcon = () => {
    if (!isOnline) return 'WifiOff';
    
    switch (connectionType) {
      case '4g':
        return 'Smartphone';
      case '3g':
        return 'Smartphone';
      case '2g':
        return 'Smartphone';
      default:
        return 'Wifi';
    }
  };

  const getConnectionColor = () => {
    if (!isOnline) return 'text-error';
    if (downloadSpeed && downloadSpeed < 1) return 'text-warning';
    return 'text-success';
  };

  const getConnectionText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync Error';
    
    if (downloadSpeed) {
      return `${downloadSpeed.toFixed(1)} Mbps`;
    }
    
    return connectionType.toUpperCase() || 'Online';
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now - lastSyncTime) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  const handleSync = () => {
    if (!isOnline || syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('idle');
      setLastSyncTime(new Date());
    }, 3000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isOnline ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <Icon 
              name={getConnectionIcon()} 
              size={20} 
              className={getConnectionColor()}
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-foreground">
                {getConnectionText()}
              </h4>
              {syncStatus === 'syncing' && (
                <Icon name="RefreshCw" size={14} className="text-warning animate-spin" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Last sync: {formatLastSync()}</span>
              {isOnline && downloadSpeed && (
                <span className="flex items-center space-x-1">
                  <Icon name="Download" size={12} />
                  <span>Good for downloads</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {isOnline && (
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className={`p-2 rounded-md transition-micro ${
              syncStatus === 'syncing' ?'text-muted-foreground cursor-not-allowed' :'text-primary hover:bg-primary/10'
            }`}
          >
            <Icon 
              name="RefreshCw" 
              size={16} 
              className={syncStatus === 'syncing' ? 'animate-spin' : ''}
            />
          </button>
        )}
      </div>

      {/* Connection Quality Indicator */}
      {isOnline && downloadSpeed && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Connection Quality</span>
            <span className={`font-medium ${
              downloadSpeed >= 5 ? 'text-success' : 
              downloadSpeed >= 2 ? 'text-warning' : 'text-error'
            }`}>
              {downloadSpeed >= 5 ? 'Excellent' : 
               downloadSpeed >= 2 ? 'Good' : 'Poor'}
            </span>
          </div>
          
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                downloadSpeed >= 5 ? 'bg-success' : 
                downloadSpeed >= 2 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${Math.min(downloadSpeed * 10, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Offline Message */}
      {!isOnline && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>You can still manage downloaded content while offline</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectivityStatus;