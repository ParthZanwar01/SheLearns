import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/home-dashboard', 
      label: 'Home', 
      icon: 'Home',
      badge: null
    },
    { 
      path: '/resource-library', 
      label: 'Library', 
      icon: 'BookOpen',
      badge: null
    },
    { 
      path: '/learning-path-progress', 
      label: 'Progress', 
      icon: 'TrendingUp',
      badge: null
    },
    { 
      path: '/download-manager', 
      label: 'Downloads', 
      icon: 'Download',
      badge: 3 // Example badge count
    },
    { 
      path: '/community-forum', 
      label: 'Community', 
      icon: 'Users',
      badge: 5 // Example badge count
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-1001">
      <div className="flex items-center justify-around h-14 px-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-micro touch-target ${
                isActive
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon 
                  name={item.icon} 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-caption mt-1 truncate max-w-full ${
                isActive ? 'font-medium' : 'font-normal'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;