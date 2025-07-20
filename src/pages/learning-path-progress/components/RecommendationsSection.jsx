import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationsSection = ({ recommendations, onStartPath }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Recommended Next Paths
        </h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-micro">
          View All
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Based on your progress and interests, here are some paths that could help you grow further.
      </p>

      <div className="space-y-4">
        {recommendations.map((path) => (
          <div key={path.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-micro">
            <div className="flex items-start space-x-4">
              {/* Path Icon */}
              <div className={`w-12 h-12 ${path.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={path.icon} size={20} className={path.iconColor} />
              </div>

              {/* Path Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground">{path.title}</h3>
                  {path.isNew && (
                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                      New
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {path.description}
                </p>

                {/* Path Stats */}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{path.duration}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="BookOpen" size={12} />
                    <span>{path.modulesCount} modules</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{path.enrolledCount} enrolled</span>
                  </span>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {path.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {path.skills.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                      +{path.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Match Reason */}
                <div className="flex items-start space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-md mb-3">
                  <Icon name="Lightbulb" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground">
                    <span className="font-medium">Why this path? </span>
                    {path.matchReason}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartPath(path)}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Start Learning Path
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse More */}
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          iconName="Search"
          iconPosition="left"
        >
          Browse All Learning Paths
        </Button>
      </div>
    </div>
  );
};

export default RecommendationsSection;