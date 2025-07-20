import { useState, useEffect, useCallback } from 'react';
import { syncManager } from '../services/syncManager';

export const useSync = () => {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: navigator.onLine,
    syncInProgress: false,
    lastSyncTime: null,
    pendingChanges: 0,
    failedChanges: 0
  });

  const updateSyncStatus = useCallback(() => {
    setSyncStatus(syncManager.getSyncStatus());
  }, []);

  useEffect(() => {
    // Initial status
    updateSyncStatus();

    // Listen to sync events
    const handleSyncEvent = (event, data) => {
      switch (event) {
        case 'syncStarted': case'syncCompleted': case'syncFailed': case'resourcesUpdated': case'bookmarksUpdated': case'progressUpdated':
          updateSyncStatus();
          break;
        default:
          break;
      }
    };

    syncManager.addSyncListener(handleSyncEvent);

    // Listen to online/offline events
    const handleOnline = () => updateSyncStatus();
    const handleOffline = () => updateSyncStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      syncManager.removeSyncListener(handleSyncEvent);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateSyncStatus]);

  const syncNow = useCallback(async () => {
    try {
      await syncManager.forceSyncNow();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const queueBookmark = useCallback((resourceId, isBookmarked) => {
    syncManager.queueChange('bookmark', {
      resourceId,
      isBookmarked,
      timestamp: new Date()
    });
  }, []);

  const queueProgress = useCallback((resourceId, progress, completed = false) => {
    syncManager.queueChange('progress', {
      resourceId,
      progress,
      completed,
      timestamp: new Date()
    });
  }, []);

  const queueRating = useCallback((resourceId, rating) => {
    syncManager.queueChange('rating', {
      resourceId,
      rating,
      timestamp: new Date()
    });
  }, []);

  const queueDownloadHistory = useCallback((downloadData) => {
    syncManager.queueChange('download_history', downloadData);
  }, []);

  const clearSyncData = useCallback(async () => {
    await syncManager.clearSyncData();
    updateSyncStatus();
  }, [updateSyncStatus]);

  const formatLastSyncTime = useCallback((lastSyncTime) => {
    if (!lastSyncTime) return 'Never';
    
    const now = new Date();
    const diff = now - new Date(lastSyncTime);
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, []);

  return {
    syncStatus,
    syncNow,
    queueBookmark,
    queueProgress,
    queueRating,
    queueDownloadHistory,
    clearSyncData,
    formatLastSyncTime,
    refreshSyncStatus: updateSyncStatus
  };
};

export default useSync;