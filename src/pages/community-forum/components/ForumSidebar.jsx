import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ForumSidebar = ({ onJoinEvent, onConnectMentor }) => {
  const trendingTopics = [
    { id: 1, name: 'Digital Marketing', posts: 45, trend: 'up' },
    { id: 2, name: 'Financial Planning', posts: 32, trend: 'up' },
    { id: 3, name: 'E-commerce Setup', posts: 28, trend: 'stable' },
    { id: 4, name: 'Social Media Strategy', posts: 24, trend: 'down' },
    { id: 5, name: 'Business Networking', posts: 19, trend: 'up' }
  ];

  const featuredMentors = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      expertise: 'E-commerce & Digital Marketing',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4.9,
      sessions: 127,
      available: true
    },
    {
      id: 2,
      name: 'Aisha Patel',
      expertise: 'Financial Planning & Investment',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      sessions: 89,
      available: false
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      expertise: 'Business Strategy & Leadership',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4.9,
      sessions: 156,
      available: true
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Women in Tech Networking',
      date: new Date('2025-01-25T18:00:00'),
      attendees: 45,
      type: 'virtual',
      category: 'networking'
    },
    {
      id: 2,
      title: 'Financial Literacy Workshop',
      date: new Date('2025-01-28T14:00:00'),
      attendees: 32,
      type: 'hybrid',
      category: 'education'
    },
    {
      id: 3,
      title: 'Local Business Meetup - Lagos',
      date: new Date('2025-02-02T16:00:00'),
      attendees: 18,
      type: 'in-person',
      category: 'local'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatEventDate = (date) => {
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="hidden lg:block w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Community Guidelines */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-primary" />
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Community Guidelines
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Help us maintain a supportive and respectful environment for all members.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Read Guidelines
          </Button>
        </div>

        {/* Trending Topics */}
        <div>
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
            Trending Topics
          </h3>
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-micro"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {topic.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topic.posts} posts
                  </p>
                </div>
                <Icon 
                  name={getTrendIcon(topic.trend)} 
                  size={14} 
                  className={getTrendColor(topic.trend)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Featured Mentors */}
        <div>
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
            Featured Mentors
          </h3>
          <div className="space-y-3">
            {featuredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-start space-x-3 mb-2">
                  <div className="relative">
                    <Image
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                      mentor.available ? 'bg-success' : 'bg-muted-foreground'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {mentor.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {mentor.expertise}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs font-medium text-foreground">
                      {mentor.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mentor.sessions} sessions
                  </span>
                </div>
                
                <Button
                  variant={mentor.available ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={!mentor.available}
                  onClick={() => onConnectMentor(mentor.id)}
                >
                  {mentor.available ? 'Connect' : 'Unavailable'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground line-clamp-2">
                    {event.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    event.type === 'virtual' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'hybrid'? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{event.attendees}</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onJoinEvent(event.id)}
                >
                  Join Event
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
            Your Impact
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Posts Created</span>
              <span className="text-sm font-medium text-foreground">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Helpful Replies</span>
              <span className="text-sm font-medium text-foreground">34</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Community Rank</span>
              <span className="text-sm font-medium text-primary">Helper</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumSidebar;