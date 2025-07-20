import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementModal = ({ achievement, isOpen, onClose, onShare }) => {
  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1002 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 text-center bg-gradient-to-br from-primary/5 to-success/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>

          {/* Achievement Icon */}
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Award" size={40} className="text-warning" />
          </div>

          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Congratulations! 🎉
          </h2>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {achievement.title}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        {/* Achievement Details */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-md">
              <div className="text-lg font-bold text-foreground">
                {achievement.completionTime}
              </div>
              <div className="text-xs text-muted-foreground">
                Completion Time
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-md">
              <div className="text-lg font-bold text-foreground">
                {achievement.skillsGained}
              </div>
              <div className="text-xs text-muted-foreground">
                Skills Gained
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="mb-6 p-4 border-2 border-dashed border-border rounded-lg text-center">
            <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">
              Certificate Available
            </p>
            <p className="text-xs text-muted-foreground">
              Download your completion certificate
            </p>
          </div>

          {/* Skills Earned */}
          {achievement.skills && achievement.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Skills You've Mastered:
              </h4>
              <div className="flex flex-wrap gap-2">
                {achievement.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-success/10 text-success text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-md">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="ArrowRight" size={16} className="mr-2" />
              What's Next?
            </h4>
            <p className="text-sm text-muted-foreground">
              {achievement.nextSteps || "Continue with the next module in your learning path to build on these skills."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={onShare}
              iconName="Share2"
              iconPosition="left"
              className="flex-1"
            >
              Share Achievement
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Handle certificate download
                console.log('Downloading certificate...');
              }}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              Get Certificate
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full mt-3"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;