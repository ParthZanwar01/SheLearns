import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModuleCard = ({ module, isCurrentModule, onContinue, onReview }) => {
  const getStatusBadge = () => {
    if (module.completed) {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
          <Icon name="CheckCircle" size={12} />
          <span>Completed</span>
        </div>
      );
    }
    
    if (isCurrentModule) {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          <Icon name="Play" size={12} />
          <span>In Progress</span>
        </div>
      );
    }
    
    if (module.locked) {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
          <Icon name="Lock" size={12} />
          <span>Locked</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
        <Icon name="Circle" size={12} />
        <span>Available</span>
      </div>
    );
  };

  return (
    <div className={`bg-card border rounded-lg p-4 md:p-6 transition-micro ${
      isCurrentModule ? 'border-primary shadow-card' : 'border-border hover:border-primary/30'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusBadge()}
            {module.downloaded && (
              <div className="flex items-center space-x-1 text-success text-xs">
                <Icon name="Download" size={12} />
                <span>Downloaded</span>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            {module.title}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {module.description}
          </p>
        </div>

        {module.completed && module.achievementBadge && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Award" size={20} className="text-warning" />
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {(isCurrentModule || module.completed) && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{module.progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Module Stats */}
      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>{module.duration}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Icon name="FileText" size={12} />
          <span>{module.lessonsCount} lessons</span>
        </span>
        <span className="flex items-center space-x-1">
          <Icon name="Award" size={12} />
          <span>{module.skillsCount} skills</span>
        </span>
      </div>

      {/* Skills Preview */}
      {module.keySkills && module.keySkills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Key Skills:</p>
          <div className="flex flex-wrap gap-1">
            {module.keySkills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {module.keySkills.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                +{module.keySkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {module.locked && module.prerequisites && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
          <p className="text-xs text-foreground">{module.prerequisites}</p>
        </div>
      )}

      {/* Last Position */}
      {isCurrentModule && module.lastPosition && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
          <p className="text-xs text-primary font-medium">
            Resume from: {module.lastPosition}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {module.completed ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReview(module)}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Review Module
          </Button>
        ) : isCurrentModule ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => onContinue(module)}
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            Continue Learning
          </Button>
        ) : !module.locked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContinue(module)}
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            Start Module
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            iconName="Lock"
            iconPosition="left"
            className="flex-1"
          >
            Locked
          </Button>
        )}

        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
          <Icon name="MoreVertical" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;