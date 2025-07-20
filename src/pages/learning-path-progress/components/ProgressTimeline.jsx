import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTimeline = ({ modules, currentModuleId, onModuleClick }) => {
  const getModuleStatus = (module) => {
    if (module.completed) return 'completed';
    if (module.id === currentModuleId) return 'current';
    if (module.locked) return 'locked';
    return 'available';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Play';
      case 'locked':
        return 'Lock';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'current':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'locked':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-background border-border';
    }
  };

  return (
    <div className="bg-card p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-6">
          Learning Timeline
        </h2>

        {/* Mobile Timeline - Vertical */}
        <div className="md:hidden space-y-4">
          {modules.map((module, index) => {
            const status = getModuleStatus(module);
            const isClickable = status !== 'locked';

            return (
              <div key={module.id} className="flex items-start space-x-3">
                {/* Timeline Connector */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isClickable && onModuleClick(module)}
                    disabled={!isClickable}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-micro ${getStatusColor(status)} ${
                      isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <Icon name={getStatusIcon(status)} size={16} />
                  </button>
                  {index < modules.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      status === 'completed' ? 'bg-success' : 'bg-border'
                    }`} />
                  )}
                </div>

                {/* Module Info */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${
                      status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {module.title}
                    </h3>
                    {module.downloaded && (
                      <Icon name="Download" size={14} className="text-success" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{module.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Award" size={12} />
                      <span>{module.skillsCount} skills</span>
                    </span>
                  </div>

                  {status === 'current' && module.lastPosition && (
                    <div className="mt-2 text-xs text-primary">
                      Last position: {module.lastPosition}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            {modules.map((module, index) => {
              const status = getModuleStatus(module);
              const isClickable = status !== 'locked';

              return (
                <div key={module.id} className="flex flex-col items-center flex-1">
                  {/* Timeline Node */}
                  <div className="flex items-center w-full">
                    <button
                      onClick={() => isClickable && onModuleClick(module)}
                      disabled={!isClickable}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-micro ${getStatusColor(status)} ${
                        isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'
                      }`}
                    >
                      <Icon name={getStatusIcon(status)} size={18} />
                    </button>
                    
                    {index < modules.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        status === 'completed' ? 'bg-success' : 'bg-border'
                      }`} />
                    )}
                  </div>

                  {/* Module Details */}
                  <div className="mt-4 text-center max-w-xs">
                    <h3 className={`font-medium text-sm mb-1 ${
                      status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {module.title}
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-3 text-xs text-muted-foreground mb-1">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={10} />
                        <span>{module.duration}</span>
                      </span>
                      {module.downloaded && (
                        <Icon name="Download" size={10} className="text-success" />
                      )}
                    </div>

                    {status === 'current' && module.lastPosition && (
                      <div className="text-xs text-primary">
                        Resume: {module.lastPosition}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;