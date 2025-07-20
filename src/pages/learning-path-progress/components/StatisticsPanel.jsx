import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsPanel = ({ stats }) => {
  const statItems = [
    {
      icon: 'Flame',
      label: 'Learning Streak',
      value: `${stats.streak} days`,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: 'Clock',
      label: 'Total Hours',
      value: `${stats.totalHours}h`,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: 'Award',
      label: 'Skills Mastered',
      value: stats.skillsMastered,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: 'Target',
      label: 'Modules Completed',
      value: `${stats.completedModules}/${stats.totalModules}`,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Your Progress
        </h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-micro">
          View Details
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <Icon name={item.icon} size={20} className={item.color} />
            </div>
            <div className="text-lg font-bold text-foreground mb-1">
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">
              Great Progress!
            </h3>
            <p className="text-sm text-muted-foreground">
              You're {stats.progressPercentage}% through your current learning path. 
              Keep up the excellent work! You're building valuable skills that will help you succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="mt-4 p-4 bg-muted/30 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Weekly Goal</span>
          <span className="text-xs text-muted-foreground">{stats.weeklyProgress}/5 hours</span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <div 
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${(stats.weeklyProgress / 5) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {5 - stats.weeklyProgress > 0 
            ? `${5 - stats.weeklyProgress} hours left to reach your weekly goal`
            : 'Weekly goal achieved! 🎉'
          }
        </p>
      </div>
    </div>
  );
};

export default StatisticsPanel;