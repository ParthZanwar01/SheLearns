import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CommunityHighlights = ({ discussions, mentorConnections, isOnline }) => {
  if (!isOnline) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Community Highlights
        </h2>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="WifiOff" size={32} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-2">
            Connect to see community updates
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            Community discussions and mentor connections will appear here when you're online
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Community Highlights
        </h2>
        <Link 
          to="/community-forum"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-micro"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {/* Recent Discussions */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="MessageSquare" size={16} className="text-primary" />
            <h3 className="font-medium text-foreground text-sm">
              Recent Discussions
            </h3>
          </div>
          
          <div className="space-y-3">
            {discussions.slice(0, 2).map((discussion) => (
              <div key={discussion.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">
                    {discussion.author.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">
                    {discussion.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground font-caption">
                      by {discussion.author}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground font-caption">
                      {discussion.replies} replies
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor Connections */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Users" size={16} className="text-secondary" />
            <h3 className="font-medium text-foreground text-sm">
              Mentor Connections
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {mentorConnections.slice(0, 3).map((mentor, index) => (
                  <div 
                    key={mentor.id}
                    className="w-8 h-8 bg-secondary/10 border-2 border-card rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-secondary">
                      {mentor.name.charAt(0)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-foreground">
                {mentorConnections.length} mentors available
              </span>
            </div>
            <Link
              to="/community-forum"
              className="text-xs text-secondary hover:text-secondary/80 font-medium transition-micro"
            >
              Connect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHighlights;