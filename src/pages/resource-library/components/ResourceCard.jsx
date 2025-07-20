import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useDownloads } from '../../../hooks/useDownloads';
import { useSync } from '../../../hooks/useSync';

const ResourceCard = ({ resource, onBookmark, onPreview, isOnline }) => {
  const { startDownload, activeDownloads } = useDownloads();
  const { queueBookmark } = useSync();
  const [isProcessing, setIsProcessing] = useState(false);

  // Find active download for this resource
  const activeDownload = activeDownloads.find(download => 
    download.resourceId === resource.id
  );

  const handleDownload = async () => {
    if (resource.isDownloaded) {
      onPreview(resource);
      return;
    }

    if (activeDownload) {
      // Already downloading, show preview or status
      return;
    }

    setIsProcessing(true);
    try {
      // Enhanced resource with download URL
      const enhancedResource = {
        ...resource,
        downloadUrl: generateRealDownloadUrl(resource)
      };

      await startDownload(enhancedResource, {
        priority: 'normal'
      });
    } catch (error) {
      console.error('Failed to start download:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookmark = () => {
    onBookmark(resource);
    // Queue sync for bookmark change
    queueBookmark(resource.id, !resource.isBookmarked);
  };

  const generateRealDownloadUrl = (resource) => {
    // Generate realistic download URLs based on resource type
    const baseUrls = {
      video: {
        small: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        medium: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        large: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_5mb.mp4'
      },
      pdf: {
        small: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        medium: 'https://www.africau.edu/images/default/sample.pdf',
        large: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
      },
      audio: {
        small: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        medium: 'https://file-examples.com/storage/fe68c44085b606c838dd67d/2017/11/file_example_MP3_700KB.mp3',
        large: 'https://file-examples.com/storage/fe68c44085b606c838dd67d/2017/11/file_example_MP3_5MG.mp3'
      },
      interactive: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
    };

    // Select URL based on file size
    const sizeCategory = resource.size < 10 ? 'small' : resource.size < 50 ? 'medium' : 'large';
    
    if (resource.type === 'interactive') {
      return baseUrls.interactive;
    }

    return baseUrls[resource.type]?.[sizeCategory] || baseUrls.pdf.small;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) return `${Math.round(sizeInMB * 1024)}KB`;
    if (sizeInMB < 1024) return `${Math.round(sizeInMB)}MB`;
    return `${(sizeInMB / 1024).toFixed(1)}GB`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-success bg-success/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return 'Play';
      case 'pdf': return 'FileText';
      case 'audio': return 'Headphones';
      case 'interactive': return 'MousePointer';
      default: return 'File';
    }
  };

  const getDownloadButtonState = () => {
    if (resource.isDownloaded) {
      return {
        variant: 'outline',
        iconName: 'Eye',
        text: 'View',
        disabled: false,
        loading: false
      };
    }

    if (activeDownload) {
      const statusConfig = {
        downloading: {
          variant: 'outline',
          iconName: 'Download',
          text: `${Math.round(activeDownload.progress)}%`,
          disabled: true,
          loading: true
        },
        paused: {
          variant: 'outline',
          iconName: 'Pause',
          text: 'Paused',
          disabled: false,
          loading: false
        },
        failed: {
          variant: 'outline',
          iconName: 'AlertCircle',
          text: 'Retry',
          disabled: false,
          loading: false
        },
        retrying: {
          variant: 'outline',
          iconName: 'RotateCcw',
          text: 'Retrying',
          disabled: true,
          loading: true
        }
      };

      return statusConfig[activeDownload.status] || statusConfig.downloading;
    }

    return {
      variant: 'default',
      iconName: 'Download',
      text: 'Download',
      disabled: isProcessing || (!isOnline && !resource.isDownloaded),
      loading: isProcessing
    };
  };

  const buttonState = getDownloadButtonState();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white flex items-center space-x-1">
            <Icon name={getTypeIcon(resource.type)} size={12} />
            <span>{resource.type.toUpperCase()}</span>
          </span>
        </div>

        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          {resource.isDownloaded && (
            <div className="p-1.5 rounded-full bg-success text-success-foreground">
              <Icon name="CheckCircle" size={14} />
            </div>
          )}
          {activeDownload && (
            <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
              <Icon name="Download" size={14} />
            </div>
          )}
          {!isOnline && !resource.isDownloaded && (
            <div className="p-1.5 rounded-full bg-muted-foreground/50 text-white">
              <Icon name="WifiOff" size={14} />
            </div>
          )}
        </div>

        {/* Play button for videos */}
        {resource.type === 'video' && (
          <button
            onClick={() => onPreview(resource)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-micro"
          >
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Icon name="Play" size={20} className="text-foreground ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 flex-1">
            {resource.title}
          </h3>
          <button
            onClick={handleBookmark}
            className={`ml-2 p-1 rounded-md transition-micro ${
              resource.isBookmarked
                ? 'text-warning bg-warning/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={resource.isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={16} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>{formatDuration(resource.duration)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="HardDrive" size={12} />
              <span>{formatFileSize(resource.size)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={12} className="text-warning" />
            <span>{resource.rating}</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-secondary-foreground text-xs font-medium">
              {resource.author.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{resource.author}</span>
        </div>

        {/* Download Progress */}
        {activeDownload && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{activeDownload.status === 'downloading' ? 'Downloading...' : activeDownload.status}</span>
              <span>{Math.round(activeDownload.progress)}%</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${activeDownload.progress}%` }}
              />
            </div>
            {activeDownload.speed > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{formatFileSize(activeDownload.speed)}/s</span>
                <span>{activeDownload.timeRemaining > 0 && `${Math.ceil(activeDownload.timeRemaining)}s left`}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={buttonState.variant}
          size="sm"
          fullWidth
          onClick={handleDownload}
          disabled={buttonState.disabled}
          loading={buttonState.loading}
          iconName={buttonState.iconName}
          iconPosition="left"
        >
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;