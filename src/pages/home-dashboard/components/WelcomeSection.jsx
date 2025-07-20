import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ user, streak, achievements }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold mb-1">
            Welcome back, {user.name}!
          </h1>
          <p className="text-white/80 font-caption">
            Continue your entrepreneurial journey
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Icon name="Zap" size={32} color="white" />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Icon name="Flame" size={20} color="white" />
          <div>
            <p className="text-sm font-medium">{streak} day streak</p>
            <p className="text-xs text-white/70 font-caption">Keep it up!</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Award" size={20} color="white" />
          <div>
            <p className="text-sm font-medium">{achievements} achievements</p>
            <p className="text-xs text-white/70 font-caption">Well done!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;