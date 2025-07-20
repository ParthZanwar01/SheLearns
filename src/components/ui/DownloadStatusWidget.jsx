import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const DownloadStatusWidget = () => {
  const [downloads, setDownloads] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);

  // Simulate download data
  useEffect(() => {
    const mockDownloads = [
      {
        id: 1,
        name: 'Business Plan Template.pdf',
        progress: 75,
        size: '2.4 MB',
        status: 'downloading'
      },
      {
        id: 2,
        name: 'Marketing Strategies Video.mp4',
        progress: 45,
        size: '15.8 MB',
        status: 'downloading'
      },
      {
        id: 3,
        name: 'Financial Planning Guide.pdf',
        progress: 100,
        size: '1.2 MB',
        status: 'completed'
      }
    ];

    setDownloads(mockDownloads);

    // Calculate total progress
    const activeDownloads = mockDownloads.filter(d => d.status === 'downloading');
    if (activeDownloads.length > 0) {
      const avgProgress = activeDownloads.reduce((sum, d) => sum + d.progress, 0) / activeDownloads.length;
      setTotalProgress(Math.round(avgProgress));
    }
  }, []);

  const activeDownloads = downloads.filter(d => d.status === 'downloading');
  const hasActiveDownloads = activeDownloads.length > 0;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const pauseDownload = (id) => {
    setDownloads(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'downloading' ? 'paused' : 'downloading' } : d
    ));
  };

  const cancelDownload = (id) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  if (!hasActiveDownloads && downloads.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Mobile: Compact indicator */}
      <div className="sm:hidden">
        {hasActiveDownloads && (
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-1 p-2 rounded-md text-primary hover:bg-muted transition-micro"
          >
            <Icon name="Download" size={16} />
            <span className="text-xs font-medium">{activeDownloads.length}</span>
          </button>
        )}
      </div>

      {/* Desktop: Progress bar */}
      <div className="hidden sm:block">
        {hasActiveDownloads && (
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-micro"
          >
            <Icon name="Download" size={14} className="text-primary" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium text-foreground">
                {activeDownloads.length} downloading
              </span>
              <div className="w-16 h-1 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {totalProgress}%
            </span>
          </button>
        )}
      </div>

      {/* Expanded Download Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-1001"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-modal z-1002 animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-sm text-foreground">
                  Downloads ({downloads.length})
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {downloads.map((download) => (
                  <div key={download.id} className="flex items-center space-x-3 p-2 rounded-md bg-muted/50">
                    <div className="flex-shrink-0">
                      <Icon 
                        name={download.status === 'completed' ? 'CheckCircle' : 'FileText'} 
                        size={16} 
                        className={download.status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {download.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground font-caption">
                          {download.size}
                        </span>
                        {download.status === 'downloading' && (
                          <span className="text-xs text-primary font-mono">
                            {download.progress}%
                          </span>
                        )}
                      </div>
                      
                      {download.status === 'downloading' && (
                        <div className="w-full h-1 bg-background rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {download.status === 'downloading' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => pauseDownload(download.id)}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                        >
                          <Icon name="Pause" size={12} />
                        </button>
                        <button
                          onClick={() => cancelDownload(download.id)}
                          className="p-1 rounded-md text-muted-foreground hover:text-error hover:bg-muted transition-micro"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasActiveDownloads && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-caption">
                      Storage used: 45.2 MB / 500 MB
                    </span>
                    <button className="text-primary hover:text-primary/80 font-medium transition-micro">
                      Manage
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadStatusWidget;