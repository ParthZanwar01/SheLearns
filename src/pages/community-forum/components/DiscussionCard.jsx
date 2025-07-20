import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DiscussionCard = ({ discussion, onThreadClick, onReact, onBookmark }) => {
  const {
    id,
    author,
    title,
    content,
    category,
    timestamp,
    replies,
    likes,
    bookmarked,
    isOffline,
    hasUnread,
    mentorVerified,
    tags,
    attachments
  } = discussion;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'bg-blue-100 text-blue-800',
      'business-tips': 'bg-green-100 text-green-800',
      'success-stories': 'bg-purple-100 text-purple-800',
      'qa': 'bg-orange-100 text-orange-800',
      'local-events': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-4 hover:shadow-card transition-micro cursor-pointer ${
        hasUnread ? 'border-l-4 border-l-primary' : ''
      } ${isOffline ? 'opacity-75' : ''}`}
      onClick={() => onThreadClick(id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="relative flex-shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {mentorVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} className="text-success-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-foreground truncate">
                {author.name}
              </h3>
              {mentorVerified && (
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                  Mentor
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(timestamp)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(category)}`}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              {isOffline && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="WifiOff" size={12} />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          iconName={bookmarked ? "Bookmark" : "BookmarkPlus"}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(id);
          }}
          className={bookmarked ? 'text-warning' : 'text-muted-foreground'}
        />
      </div>

      {/* Content */}
      <div className="mb-3">
        <h2 className="font-heading font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {content}
        </p>
      </div>

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Paperclip" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReact(id, 'like');
            }}
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-micro"
          >
            <Icon name="Heart" size={16} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="MessageCircle" size={16} />
            <span className="text-sm font-medium">{replies}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasUnread && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;