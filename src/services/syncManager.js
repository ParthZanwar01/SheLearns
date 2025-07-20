import axios from 'axios';
import localforage from 'localforage';


// Configure localforage for sync data
const syncStore = localforage.createInstance({
  name: 'SkillBridge-Sync',
  storeName: 'sync'
});

class SyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.syncListeners = [];
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.syncInterval = null;

    this.initializeEventListeners();
    this.loadSyncData();
  }

  initializeEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.performAutoSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
    });
  }

  async loadSyncData() {
    try {
      const syncData = await syncStore.getItem('syncData');
      if (syncData) {
        this.syncQueue = syncData.syncQueue || [];
        this.lastSyncTime = syncData.lastSyncTime;
      }

      // Start periodic sync if online
      if (this.isOnline) {
        this.startPeriodicSync();
      }
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  }

  async saveSyncData() {
    try {
      await syncStore.setItem('syncData', {
        syncQueue: this.syncQueue,
        lastSyncTime: this.lastSyncTime
      });
    } catch (error) {
      console.error('Failed to save sync data:', error);
    }
  }

  addSyncListener(listener) {
    this.syncListeners.push(listener);
  }

  removeSyncListener(listener) {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  notifyListeners(event, data) {
    this.syncListeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(event, data);
      }
    });
  }

  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.performAutoSync();
    }, 5 * 60 * 1000);
  }

  async performAutoSync() {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    try {
      await this.syncWithServer();
    } catch (error) {
      console.error('Auto sync failed:', error);
    }
  }

  async syncWithServer() {
    if (this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    this.notifyListeners('syncStarted', {});

    try {
      // 1. Upload local changes
      await this.uploadLocalChanges();

      // 2. Download server updates
      await this.downloadServerUpdates();

      // 3. Resolve conflicts
      await this.resolveConflicts();

      // 4. Update sync status
      this.lastSyncTime = new Date();
      await this.saveSyncData();

      this.notifyListeners('syncCompleted', {
        lastSyncTime: this.lastSyncTime
      });

    } catch (error) {
      this.notifyListeners('syncFailed', { error: error.message });
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  async uploadLocalChanges() {
    const localChanges = this.syncQueue.filter(item => 
      item.action === 'upload' && item.status === 'pending'
    );

    for (const change of localChanges) {
      try {
        await this.uploadChange(change);
        change.status = 'completed';
      } catch (error) {
        change.status = 'failed';
        change.error = error.message;
      }
    }

    // Remove completed changes
    this.syncQueue = this.syncQueue.filter(item => 
      item.status !== 'completed'
    );
  }

  async uploadChange(change) {
    const { type, data } = change;

    switch (type) {
      case 'bookmark':
        await this.uploadBookmark(data);
        break;
      case 'progress':
        await this.uploadProgress(data);
        break;
      case 'rating':
        await this.uploadRating(data);
        break;
      case 'download_history':
        await this.uploadDownloadHistory(data);
        break;
      default:
        throw new Error(`Unknown change type: ${type}`);
    }
  }

  async downloadServerUpdates() {
    try {
      const lastSync = this.lastSyncTime?.toISOString() || '1970-01-01';
      
      const response = await axios.get('/api/sync/updates', {
        params: { since: lastSync },
        timeout: 30000
      });

      const updates = response.data;
      
      // Process different types of updates
      if (updates.resources) {
        await this.processResourceUpdates(updates.resources);
      }
      
      if (updates.bookmarks) {
        await this.processBookmarkUpdates(updates.bookmarks);
      }
      
      if (updates.progress) {
        await this.processProgressUpdates(updates.progress);
      }

    } catch (error) {
      if (error.response?.status === 404) {
        // No updates available
        return;
      }
      throw error;
    }
  }

  async processResourceUpdates(resources) {
    const resourceStore = localforage.createInstance({
      name: 'SkillBridge-Resources',
      storeName: 'resources'
    });

    for (const resource of resources) {
      await resourceStore.setItem(`resource_${resource.id}`, resource);
    }

    this.notifyListeners('resourcesUpdated', { count: resources.length });
  }

  async processBookmarkUpdates(bookmarks) {
    const bookmarkStore = localforage.createInstance({
      name: 'SkillBridge-Bookmarks',
      storeName: 'bookmarks'
    });

    for (const bookmark of bookmarks) {
      if (bookmark.deleted) {
        await bookmarkStore.removeItem(`bookmark_${bookmark.resourceId}`);
      } else {
        await bookmarkStore.setItem(`bookmark_${bookmark.resourceId}`, bookmark);
      }
    }

    this.notifyListeners('bookmarksUpdated', { count: bookmarks.length });
  }

  async processProgressUpdates(progressItems) {
    const progressStore = localforage.createInstance({
      name: 'SkillBridge-Progress',
      storeName: 'progress'
    });

    for (const progress of progressItems) {
      await progressStore.setItem(`progress_${progress.resourceId}`, progress);
    }

    this.notifyListeners('progressUpdated', { count: progressItems.length });
  }

  async resolveConflicts() {
    // Simple conflict resolution: server wins
    // In a real app, you might want more sophisticated conflict resolution
    const conflicts = this.syncQueue.filter(item => item.status === 'conflict');
    
    for (const conflict of conflicts) {
      // For now, just mark as resolved
      conflict.status = 'resolved';
      conflict.resolvedAt = new Date();
    }
  }

  async uploadBookmark(data) {
    await axios.post('/api/bookmarks', data);
  }

  async uploadProgress(data) {
    await axios.post('/api/progress', data);
  }

  async uploadRating(data) {
    await axios.post('/api/ratings', data);
  }

  async uploadDownloadHistory(data) {
    await axios.post('/api/download-history', data);
  }

  queueChange(type, data, action = 'upload') {
    const changeItem = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      action,
      status: 'pending',
      createdAt: new Date()
    };

    this.syncQueue.push(changeItem);
    this.saveSyncData();

    // Try to sync immediately if online
    if (this.isOnline) {
      setTimeout(() => this.performAutoSync(), 1000);
    }
  }

  async forceSyncNow() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    return await this.syncWithServer();
  }

  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime,
      pendingChanges: this.syncQueue.filter(item => item.status === 'pending').length,
      failedChanges: this.syncQueue.filter(item => item.status === 'failed').length
    };
  }

  async clearSyncData() {
    this.syncQueue = [];
    this.lastSyncTime = null;
    await this.saveSyncData();
  }
}

// Create singleton instance
export const syncManager = new SyncManager();

export default SyncManager;