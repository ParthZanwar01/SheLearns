import { useState, useEffect, useCallback } from 'react';
import { downloadManager } from '../services/downloadManager';

export const useDownloads = () => {
  const [activeDownloads, setActiveDownloads] = useState([]);
  const [completedDownloads, setCompletedDownloads] = useState([]);
  const [queuedDownloads, setQueuedDownloads] = useState([]);
  const [storageInfo, setStorageInfo] = useState({
    totalFiles: 0,
    totalSize: 0,
    usedStorage: 0,
    availableStorage: 0,
    totalStorage: 0
  });

  const updateDownloadStates = useCallback(async () => {
    setActiveDownloads(downloadManager.getActiveDownloads());
    setCompletedDownloads(downloadManager.getCompletedDownloads());
    setQueuedDownloads(downloadManager.getQueuedDownloads());
    
    const storage = await downloadManager.getStorageInfo();
    setStorageInfo(storage);
  }, []);

  useEffect(() => {
    // Initial load
    updateDownloadStates();

    // Listen to download events
    const handleDownloadEvent = (event, data) => {
      switch (event) {
        case 'downloadAdded':
        case 'downloadProgress': case'downloadCompleted': case'downloadFailed': case'downloadPaused': case'downloadCancelled': case'downloadRetrying':
          updateDownloadStates();
          break;
        default:
          break;
      }
    };

    downloadManager.addDownloadListener(handleDownloadEvent);

    return () => {
      downloadManager.removeDownloadListener(handleDownloadEvent);
    };
  }, [updateDownloadStates]);

  const startDownload = useCallback(async (resource, options) => {
    return await downloadManager.downloadFile(resource, options);
  }, []);

  const pauseDownload = useCallback(async (downloadId) => {
    await downloadManager.pauseDownload(downloadId);
  }, []);

  const resumeDownload = useCallback(async (downloadId) => {
    await downloadManager.resumeDownload(downloadId);
  }, []);

  const cancelDownload = useCallback(async (downloadId) => {
    await downloadManager.cancelDownload(downloadId);
  }, []);

  const openFile = useCallback(async (downloadId) => {
    await downloadManager.openDownloadedFile(downloadId);
  }, []);

  const shareFile = useCallback(async (downloadId) => {
    await downloadManager.shareDownloadedFile(downloadId);
  }, []);

  const cleanupOldFiles = useCallback(async (daysOld = 30) => {
    return await downloadManager.cleanupOldFiles(daysOld);
  }, []);

  const formatFileSize = useCallback((sizeInBytes) => {
    if (sizeInBytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDownloadSpeed = useCallback((bytesPerSecond) => {
    return formatFileSize(bytesPerSecond) + '/s';
  }, [formatFileSize]);

  const formatTimeRemaining = useCallback((seconds) => {
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
    return `${Math.ceil(seconds / 3600)}h`;
  }, []);

  return {
    activeDownloads,
    completedDownloads,
    queuedDownloads,
    storageInfo,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    openFile,
    shareFile,
    cleanupOldFiles,
    formatFileSize,
    formatDownloadSpeed,
    formatTimeRemaining,
    refreshDownloads: updateDownloadStates
  };
};

export default useDownloads;