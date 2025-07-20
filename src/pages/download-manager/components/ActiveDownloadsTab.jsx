import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDownloads } from '../../../hooks/useDownloads';

const ActiveDownloadsTab = () => {
  const {
    activeDownloads,
    queuedDownloads,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    formatFileSize,
    formatDownloadSpeed,
    formatTimeRemaining
  } = useDownloads();

  const allDownloads = [...activeDownloads, ...queuedDownloads];

  const handlePauseResume = (download) => {
    if (download.status === 'downloading') {
      pauseDownload(download.id);
    } else if (download.status === 'paused' || download.status === 'queued') {
      resumeDownload(download.id);
    }
  };

  const handleCancel = (download) => {
    cancelDownload(download.id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'downloading': return 'Download';
      case 'paused': return 'Pause';
      case 'queued': return 'Clock';
      case 'failed': return 'AlertCircle';
      case 'retrying': return 'RotateCcw';
      default: return 'Download';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'downloading': return 'text-primary';
      case 'paused': return 'text-warning';
      case 'queued': return 'text-muted-foreground';
      case 'failed': return 'text-error';
      case 'retrying': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority) => {
    const configs = {
      high: 'bg-error/10 text-error border-error/20',
      normal: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    
    return configs[priority] || configs.normal;
  };

  if (allDownloads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Download" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No active downloads
        </h3>
        <p className="text-muted-foreground max-w-md">
          When you start downloading resources, they'll appear here with real-time progress tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Download Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {activeDownloads.filter(d => d.status === 'downloading').length}
              </p>
              <p className="text-xs text-muted-foreground">Downloading</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {queuedDownloads.length}
              </p>
              <p className="text-xs text-muted-foreground">In Queue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {activeDownloads.filter(d => d.status === 'paused').length}
              </p>
              <p className="text-xs text-muted-foreground">Paused</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              Total Speed
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDownloadSpeed(
                activeDownloads.reduce((total, d) => total + (d.speed || 0), 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-3">
        {allDownloads.map((download) => (
          <div
            key={download.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {download.name}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {download.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(download.priority)}`}>
                    {download.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className={`flex items-center space-x-1 ${getStatusColor(download.status)}`}>
                  <Icon name={getStatusIcon(download.status)} size={14} />
                  <span className="text-xs font-medium capitalize">
                    {download.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {formatFileSize(download.downloadedSize || 0)} / {formatFileSize(download.size)}
                </span>
                <span>{Math.round(download.progress || 0)}%</span>
              </div>
              
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    download.status === 'failed' ? 'bg-error' :
                    download.status === 'paused' ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${download.progress || 0}%` }}
                />
              </div>

              {/* Download Stats */}
              {download.status === 'downloading' && download.speed > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDownloadSpeed(download.speed)}</span>
                  {download.timeRemaining > 0 && (
                    <span>{formatTimeRemaining(download.timeRemaining)} remaining</span>
                  )}
                </div>
              )}

              {/* Error Message */}
              {download.error && (
                <div className="flex items-center space-x-2 text-xs text-error bg-error/10 px-2 py-1 rounded">
                  <Icon name="AlertCircle" size={12} />
                  <span>{download.error}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePauseResume(download)}
                  disabled={download.status === 'failed' || download.status === 'retrying'}
                >
                  <Icon 
                    name={
                      download.status === 'downloading' ? 'Pause' :
                      download.status === 'paused' ? 'Play' : 'Play'
                    } 
                    size={14} 
                  />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(download)}
                  className="text-error hover:text-error hover:bg-error/10 hover:border-error/20"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>

              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                {download.retryCount > 0 && (
                  <span>Retry #{download.retryCount}</span>
                )}
                <span>
                  Started {new Date(download.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveDownloadsTab;