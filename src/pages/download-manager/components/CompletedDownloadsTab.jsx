import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDownloads } from '../../../hooks/useDownloads';

const CompletedDownloadsTab = () => {
  const {
    completedDownloads,
    openFile,
    shareFile,
    cancelDownload,
    formatFileSize
  } = useDownloads();
  
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

  const handleSelectFile = (downloadId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(downloadId)) {
      newSelected.delete(downloadId);
    } else {
      newSelected.add(downloadId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === completedDownloads.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(completedDownloads.map(d => d.id)));
    }
  };

  const handleBulkDelete = () => {
    selectedFiles.forEach(downloadId => {
      cancelDownload(downloadId);
    });
    setSelectedFiles(new Set());
  };

  const handleOpenFile = (download) => {
    openFile(download.id);
  };

  const handleShareFile = (download) => {
    shareFile(download.id);
  };

  const handleDeleteFile = (download) => {
    cancelDownload(download.id);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'video': return 'Play';
      case 'pdf': return 'FileText';
      case 'audio': return 'Headphones';
      case 'interactive': return 'MousePointer';
      default: return 'File';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'video': return 'text-red-500 bg-red-50';
      case 'pdf': return 'text-blue-500 bg-blue-50';
      case 'audio': return 'text-green-500 bg-green-50';
      case 'interactive': return 'text-purple-500 bg-purple-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort downloads
  let filteredDownloads = completedDownloads;
  
  if (filterBy !== 'all') {
    filteredDownloads = filteredDownloads.filter(download => 
      download.metadata.category === filterBy
    );
  }

  filteredDownloads.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.completedAt) - new Date(a.completedAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  if (completedDownloads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="CheckCircle" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No completed downloads
        </h3>
        <p className="text-muted-foreground max-w-md">
          Your completed downloads will appear here. You can open, share, or manage them offline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFiles.size === completedDownloads.length && completedDownloads.length > 0}
              onChange={handleSelectAll}
              className="rounded border-border"
            />
            <span className="text-sm text-muted-foreground">
              {selectedFiles.size > 0 ? `${selectedFiles.size} selected` : 'Select all'}
            </span>
          </div>
          
          {selectedFiles.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="text-error hover:text-error hover:bg-error/10"
            >
              <Icon name="Trash2" size={14} />
              Delete Selected
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="audio">Audio</option>
            <option value="interactive">Interactive</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            <option value="recent">Recently Downloaded</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">File Size</option>
            <option value="type">File Type</option>
          </select>
        </div>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDownloads.map((download) => (
          <div
            key={download.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow"
          >
            {/* Thumbnail/Icon */}
            <div className="relative h-32 bg-muted flex items-center justify-center">
              {download.metadata.thumbnail ? (
                <img
                  src={download.metadata.thumbnail}
                  alt={download.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileTypeColor(download.type)}`}>
                  <Icon name={getFileIcon(download.type)} size={24} />
                </div>
              )}
              
              {/* Selection checkbox */}
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedFiles.has(download.id)}
                  onChange={() => handleSelectFile(download.id)}
                  className="rounded border-border"
                />
              </div>
              
              {/* File type badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(download.type)}`}>
                  {download.type.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4">
              {/* File name */}
              <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                {download.name}
              </h3>

              {/* Metadata */}
              <div className="space-y-1 mb-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span>{formatFileSize(download.size)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Downloaded</span>
                  <span>{formatDate(download.completedAt)}</span>
                </div>
                {download.metadata.author && (
                  <div className="flex items-center justify-between">
                    <span>Author</span>
                    <span className="truncate ml-2">{download.metadata.author}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleOpenFile(download)}
                  className="flex-1"
                >
                  <Icon name="ExternalLink" size={14} />
                  Open
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareFile(download)}
                >
                  <Icon name="Share" size={14} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteFile(download)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDownloads.length === 0 && filterBy !== 'all' && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="Filter" size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            No files match your filter
          </h3>
          <p className="text-muted-foreground">
            Try changing your filter or download more content.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedDownloadsTab;