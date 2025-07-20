import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const DownloadQueue = ({ downloads, onPause, onResume, onCancel, onPriorityChange, isVisible, onToggle }) => {
  const [expandedDownload, setExpandedDownload] = useState(null);

  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused');
  const completedDownloads = downloads.filter(d => d.status === 'completed');

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) return `${Math.round(sizeInMB * 1024)}KB`;
    if (sizeInMB < 1024) return `${Math.round(sizeInMB)}MB`;
    return `${(sizeInMB / 1024).toFixed(1)}GB`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'downloading': return 'Download';
      case 'paused': return 'Pause';
      case 'completed': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'downloading': return 'text-primary';
      case 'paused': return 'text-warning';
      case 'completed': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 md:bottom-4 right-4 z-1001">
        {activeDownloads.length > 0 && (
          <button
            onClick={onToggle}
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-modal hover:bg-primary/90 transition-micro"
          >
            <div className="relative">
              <Icon name="Download" size={20} />
              <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {activeDownloads.length}
              </span>
            </div>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-1000"
        onClick={onToggle}
      />
      
      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-1001 max-h-[70vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Downloads
            </h3>
            {activeDownloads.length > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {activeDownloads.length} active
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Icon name="Download" size={24} className="text-muted-foreground" />
              </div>
              <h4 className="font-heading font-semibold text-foreground mb-2">
                No downloads yet
              </h4>
              <p className="text-sm text-muted-foreground">
                Downloaded resources will appear here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Active Downloads */}
              {activeDownloads.length > 0 && (
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                    Active Downloads ({activeDownloads.length})
                  </h4>
                  <div className="space-y-3">
                    {activeDownloads.map((download) => (
                      <div key={download.id} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Icon 
                              name={getStatusIcon(download.status)} 
                              size={20} 
                              className={getStatusColor(download.status)}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-foreground truncate">
                              {download.title}
                            </h5>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(download.size)}
                              </span>
                              <span className="text-xs text-primary font-mono">
                                {download.progress}%
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-background rounded-full overflow-hidden mt-2">
                              <div 
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${download.progress}%` }}
                              />
                            </div>

                            {/* Priority Indicator */}
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                download.priority === 'high' ?'bg-error/10 text-error' 
                                  : download.priority === 'medium' ?'bg-warning/10 text-warning' :'bg-muted text-muted-foreground'
                              }`}>
                                {download.priority} priority
                              </span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => onPriorityChange(download.id, 'high')}
                                  className="p-1 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-micro"
                                  title="High priority"
                                >
                                  <Icon name="ArrowUp" size={12} />
                                </button>
                                <button
                                  onClick={() => onPriorityChange(download.id, 'low')}
                                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                                  title="Low priority"
                                >
                                  <Icon name="ArrowDown" size={12} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1">
                            {download.status === 'downloading' ? (
                              <button
                                onClick={() => onPause(download.id)}
                                className="p-2 rounded-md text-muted-foreground hover:text-warning hover:bg-warning/10 transition-micro"
                                title="Pause"
                              >
                                <Icon name="Pause" size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => onResume(download.id)}
                                className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-micro"
                                title="Resume"
                              >
                                <Icon name="Play" size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => onCancel(download.id)}
                              className="p-2 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-micro"
                              title="Cancel"
                            >
                              <Icon name="X" size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Downloads */}
              {completedDownloads.length > 0 && (
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                    Completed ({completedDownloads.length})
                  </h4>
                  <div className="space-y-2">
                    {completedDownloads.slice(0, 5).map((download) => (
                      <div key={download.id} className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {download.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(download.size)} • Completed
                          </p>
                        </div>
                        <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
                          <Icon name="ExternalLink" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadQueue;