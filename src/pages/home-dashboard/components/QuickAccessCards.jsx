import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessCards = ({ recentCourses, bookmarkedResources, downloadQueue }) => {
  const quickAccessItems = [
    {
      title: 'Continue Learning',
      subtitle: `${recentCourses.length} courses in progress`,
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/learning-path-progress',
      count: recentCourses.length
    },
    {
      title: 'Bookmarked Resources',
      subtitle: `${bookmarkedResources.length} saved items`,
      icon: 'Bookmark',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      link: '/resource-library',
      count: bookmarkedResources.length
    },
    {
      title: 'Download Queue',
      subtitle: `${downloadQueue.length} items pending`,
      icon: 'Download',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      link: '/download-manager',
      count: downloadQueue.length
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickAccessItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="block p-4 bg-card border border-border rounded-lg hover:shadow-card transition-micro touch-target"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={item.icon} size={24} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground font-caption">
                  {item.subtitle}
                </p>
              </div>
              {item.count > 0 && (
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCards;