import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ learningPaths }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Your Progress
        </h2>
        <Link 
          to="/learning-path-progress"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-micro"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {learningPaths.slice(0, 3).map((path) => (
          <div key={path.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${path.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon name={path.icon} size={20} className={path.color} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    {path.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-caption">
                    {path.completedLessons} of {path.totalLessons} lessons
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-primary">
                {path.progress}%
              </span>
            </div>
            
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${path.progress}%` }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground font-caption">
              {path.motivationalMessage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;