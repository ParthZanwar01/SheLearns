import axios from 'axios';
import localforage from 'localforage';
import { saveAs } from 'file-saver';

// Configure localforage for downloads
const downloadStore = localforage.createInstance({
  name: 'SkillBridge-Downloads',
  storeName: 'downloads'
});

const fileStore = localforage.createInstance({
  name: 'SkillBridge-Files',
  storeName: 'files'
});

const metadataStore = localforage.createInstance({
  name: 'SkillBridge-Metadata',
  storeName: 'metadata'
});

class DownloadManager {
  constructor() {
    this.activeDownloads = new Map();
    this.downloadQueue = [];
    this.isOnline = navigator.onLine;
    this.maxConcurrentDownloads = 3;
    this.downloadListeners = [];
    this.settings = {
      wifiOnly: true,
      autoSync: true,
      backgroundDownloads: true,
      maxRetries: 3,
      chunkSize: 1024 * 1024, // 1MB chunks
      timeout: 60000 // 1 minute timeout
    };

    this.initializeEventListeners();
    this.loadDownloadQueue();
  }

  initializeEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.resumeQueuedDownloads();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.pauseActiveDownloads();
    });
  }

  async loadDownloadQueue() {
    try {
      const queue = await downloadStore.getItem('downloadQueue');
      if (queue) {
        this.downloadQueue = queue;
        // Resume interrupted downloads
        this.resumeInterruptedDownloads();
      }
    } catch (error) {
      console.error('Failed to load download queue:', error);
    }
  }

  async saveDownloadQueue() {
    try {
      await downloadStore.setItem('downloadQueue', this.downloadQueue);
    } catch (error) {
      console.error('Failed to save download queue:', error);
    }
  }

  addDownloadListener(listener) {
    this.downloadListeners.push(listener);
  }

  removeDownloadListener(listener) {
    this.downloadListeners = this.downloadListeners.filter(l => l !== listener);
  }

  notifyListeners(event, data) {
    this.downloadListeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(event, data);
      }
    });
  }

  async downloadFile(resource, options = {}) {
    const downloadId = this.generateDownloadId();
    
    const downloadItem = {
      id: downloadId,
      resourceId: resource.id,
      name: resource.title,
      url: resource.downloadUrl || this.generateMockDownloadUrl(resource),
      category: resource.category,
      type: resource.type,
      size: resource.size * 1024 * 1024, // Convert MB to bytes
      downloadedSize: 0,
      progress: 0,
      status: 'queued',
      priority: options.priority || 'normal',
      createdAt: new Date(),
      retryCount: 0,
      chunks: [],
      metadata: {
        title: resource.title,
        author: resource.author,
        description: resource.description,
        thumbnail: resource.thumbnail,
        duration: resource.duration,
        rating: resource.rating
      }
    };

    // Add to queue
    this.downloadQueue.push(downloadItem);
    await this.saveDownloadQueue();

    this.notifyListeners('downloadAdded', downloadItem);

    // Start download if possible
    if (this.canStartDownload()) {
      this.startNextDownload();
    }

    return downloadId;
  }

  canStartDownload() {
    if (!this.isOnline && this.settings.wifiOnly) return false;
    return this.activeDownloads.size < this.maxConcurrentDownloads;
  }

  async startNextDownload() {
    if (!this.canStartDownload()) return;

    const nextDownload = this.downloadQueue.find(item => 
      item.status === 'queued' || item.status === 'paused'
    );

    if (!nextDownload) return;

    nextDownload.status = 'downloading';
    this.activeDownloads.set(nextDownload.id, nextDownload);

    try {
      await this.performDownload(nextDownload);
    } catch (error) {
      await this.handleDownloadError(nextDownload, error);
    }
  }

  async performDownload(downloadItem) {
    const { id, url, size } = downloadItem;

    try {
      this.notifyListeners('downloadStarted', downloadItem);

      // Create cancel token for this download
      const cancelToken = axios.CancelToken.source();
      downloadItem.cancelToken = cancelToken;

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob',
        timeout: this.settings.timeout,
        cancelToken: cancelToken.token,
        onDownloadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          downloadItem.progress = progress;
          downloadItem.downloadedSize = progressEvent.loaded;
          downloadItem.speed = this.calculateDownloadSpeed(downloadItem, progressEvent.loaded);
          downloadItem.timeRemaining = this.calculateTimeRemaining(downloadItem);

          this.notifyListeners('downloadProgress', downloadItem);
        }
      });

      // Store the file
      const fileData = response.data;
      await fileStore.setItem(`file_${id}`, fileData);
      
      // Store metadata
      await metadataStore.setItem(`metadata_${id}`, {
        ...downloadItem.metadata,
        fileSize: fileData.size,
        mimeType: fileData.type,
        downloadedAt: new Date(),
        localPath: `file_${id}`
      });

      // Update download status
      downloadItem.status = 'completed';
      downloadItem.progress = 100;
      downloadItem.downloadedSize = size;
      downloadItem.completedAt = new Date();

      // Remove from active downloads
      this.activeDownloads.delete(id);

      // Update queue
      const queueIndex = this.downloadQueue.findIndex(item => item.id === id);
      if (queueIndex !== -1) {
        this.downloadQueue[queueIndex] = downloadItem;
      }

      await this.saveDownloadQueue();
      this.notifyListeners('downloadCompleted', downloadItem);

      // Start next download
      this.startNextDownload();

    } catch (error) {
      if (axios.isCancel(error)) {
        downloadItem.status = 'cancelled';
        this.notifyListeners('downloadCancelled', downloadItem);
      } else {
        throw error;
      }
    }
  }

  async handleDownloadError(downloadItem, error) {
    downloadItem.retryCount++;
    downloadItem.error = error.message;

    if (downloadItem.retryCount < this.settings.maxRetries) {
      downloadItem.status = 'retrying';
      this.notifyListeners('downloadRetrying', downloadItem);
      
      // Retry after delay
      setTimeout(() => {
        this.performDownload(downloadItem);
      }, Math.pow(2, downloadItem.retryCount) * 1000); // Exponential backoff
    } else {
      downloadItem.status = 'failed';
      this.activeDownloads.delete(downloadItem.id);
      this.notifyListeners('downloadFailed', downloadItem);
      this.startNextDownload();
    }

    await this.saveDownloadQueue();
  }

  async pauseDownload(downloadId) {
    const download = this.activeDownloads.get(downloadId);
    if (download && download.cancelToken) {
      download.cancelToken.cancel('Download paused');
      download.status = 'paused';
      this.activeDownloads.delete(downloadId);
      
      const queueIndex = this.downloadQueue.findIndex(item => item.id === downloadId);
      if (queueIndex !== -1) {
        this.downloadQueue[queueIndex] = download;
      }
      
      await this.saveDownloadQueue();
      this.notifyListeners('downloadPaused', download);
    }
  }

  async resumeDownload(downloadId) {
    const queueIndex = this.downloadQueue.findIndex(item => item.id === downloadId);
    if (queueIndex !== -1 && this.downloadQueue[queueIndex].status === 'paused') {
      this.downloadQueue[queueIndex].status = 'queued';
      await this.saveDownloadQueue();
      this.startNextDownload();
    }
  }

  async cancelDownload(downloadId) {
    // Cancel active download
    const activeDownload = this.activeDownloads.get(downloadId);
    if (activeDownload && activeDownload.cancelToken) {
      activeDownload.cancelToken.cancel('Download cancelled');
      this.activeDownloads.delete(downloadId);
    }

    // Remove from queue
    this.downloadQueue = this.downloadQueue.filter(item => item.id !== downloadId);
    await this.saveDownloadQueue();

    // Clean up stored data
    await fileStore.removeItem(`file_${downloadId}`);
    await metadataStore.removeItem(`metadata_${downloadId}`);

    this.notifyListeners('downloadCancelled', { id: downloadId });
    this.startNextDownload();
  }

  async getDownloadedFile(downloadId) {
    try {
      const fileData = await fileStore.getItem(`file_${downloadId}`);
      const metadata = await metadataStore.getItem(`metadata_${downloadId}`);
      return { fileData, metadata };
    } catch (error) {
      console.error('Failed to retrieve downloaded file:', error);
      return null;
    }
  }

  async openDownloadedFile(downloadId) {
    const result = await this.getDownloadedFile(downloadId);
    if (result && result.fileData) {
      const { fileData, metadata } = result;
      
      // Create object URL and open
      const url = URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.download = metadata.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  async shareDownloadedFile(downloadId) {
    const result = await this.getDownloadedFile(downloadId);
    if (result && result.fileData) {
      const { fileData, metadata } = result;
      
      if (navigator.share && navigator.canShare({ files: [fileData] })) {
        try {
          await navigator.share({
            title: metadata.title,
            files: [new File([fileData], metadata.title, { type: fileData.type })]
          });
        } catch (error) {
          console.error('Failed to share file:', error);
          // Fallback to download
          saveAs(fileData, metadata.title);
        }
      } else {
        // Fallback to download
        saveAs(fileData, metadata.title);
      }
    }
  }

  calculateDownloadSpeed(downloadItem, currentBytes) {
    if (!downloadItem.lastProgressTime) {
      downloadItem.lastProgressTime = Date.now();
      downloadItem.lastProgressBytes = 0;
      return 0;
    }

    const now = Date.now();
    const timeDiff = now - downloadItem.lastProgressTime;
    const bytesDiff = currentBytes - downloadItem.lastProgressBytes;

    if (timeDiff > 1000) { // Update every second
      const speed = (bytesDiff / timeDiff) * 1000; // bytes per second
      downloadItem.lastProgressTime = now;
      downloadItem.lastProgressBytes = currentBytes;
      return speed;
    }

    return downloadItem.speed || 0;
  }

  calculateTimeRemaining(downloadItem) {
    if (!downloadItem.speed || downloadItem.speed === 0) return 0;
    
    const remainingBytes = downloadItem.size - downloadItem.downloadedSize;
    return Math.ceil(remainingBytes / downloadItem.speed); // seconds
  }

  generateDownloadId() {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateMockDownloadUrl(resource) {
    // Generate mock download URLs for demonstration
    const baseUrls = {
      video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      interactive: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
    };
    
    return baseUrls[resource.type] || baseUrls.pdf;
  }

  pauseActiveDownloads() {
    this.activeDownloads.forEach(async (download) => {
      await this.pauseDownload(download.id);
    });
  }

  resumeQueuedDownloads() {
    if (this.settings.autoSync) {
      const pausedDownloads = this.downloadQueue.filter(item => item.status === 'paused');
      pausedDownloads.forEach(async (download) => {
        await this.resumeDownload(download.id);
      });
    }
  }

  resumeInterruptedDownloads() {
    const interruptedDownloads = this.downloadQueue.filter(item => 
      item.status === 'downloading' || item.status === 'retrying'
    );
    
    interruptedDownloads.forEach(download => {
      download.status = 'queued';
    });

    this.startNextDownload();
  }

  getActiveDownloads() {
    return Array.from(this.activeDownloads.values());
  }

  getCompletedDownloads() {
    return this.downloadQueue.filter(item => item.status === 'completed');
  }

  getQueuedDownloads() {
    return this.downloadQueue.filter(item => 
      item.status === 'queued' || item.status === 'paused'
    );
  }

  async getStorageInfo() {
    try {
      const totalFiles = this.getCompletedDownloads().length;
      let totalSize = 0;

      for (const download of this.getCompletedDownloads()) {
        const fileData = await fileStore.getItem(`file_${download.id}`);
        if (fileData) {
          totalSize += fileData.size || download.size;
        }
      }

      // Estimate available storage (this is approximate)
      const estimate = await navigator.storage?.estimate();
      const totalStorage = estimate?.quota || 2 * 1024 * 1024 * 1024; // 2GB default
      const usedStorage = estimate?.usage || totalSize;

      return {
        totalFiles,
        totalSize,
        usedStorage,
        availableStorage: totalStorage - usedStorage,
        totalStorage
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        usedStorage: 0,
        availableStorage: 0,
        totalStorage: 0
      };
    }
  }

  async cleanupOldFiles(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const completedDownloads = this.getCompletedDownloads();
    const filesToCleanup = completedDownloads.filter(download => 
      new Date(download.completedAt) < cutoffDate
    );

    for (const download of filesToCleanup) {
      await this.cancelDownload(download.id);
    }

    return filesToCleanup.length;
  }
}

// Create singleton instance
export const downloadManager = new DownloadManager();

export default DownloadManager;