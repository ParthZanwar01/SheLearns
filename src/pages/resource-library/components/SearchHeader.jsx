import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchHeader = ({ searchQuery, onSearchChange, isOnline, syncStatus }) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsVoiceActive(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsVoiceActive(false);
        onSearchChange('business planning');
      }, 2000);
    }
  };

  const getConnectivityStatus = () => {
    if (!isOnline) return { icon: 'WifiOff', color: 'text-muted-foreground', text: 'Offline' };
    if (syncStatus === 'syncing') return { icon: 'RefreshCw', color: 'text-warning', text: 'Syncing...' };
    return { icon: 'Wifi', color: 'text-success', text: 'Online' };
  };

  const status = getConnectivityStatus();

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search resources, skills, topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-12"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button
              onClick={handleVoiceSearch}
              className={`p-1 rounded-md transition-micro ${
                isVoiceActive 
                  ? 'text-error bg-error/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Voice search"
            >
              <Icon 
                name={isVoiceActive ? 'MicOff' : 'Mic'} 
                size={16} 
                className={isVoiceActive ? 'animate-pulse' : ''}
              />
            </button>
          </div>
        </div>

        {/* Connectivity Status */}
        <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted">
          <Icon 
            name={status.icon} 
            size={16} 
            className={`${status.color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
          />
          <span className={`text-xs font-medium ${status.color} hidden sm:block`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Voice Search Feedback */}
      {isVoiceActive && (
        <div className="mt-3 p-3 bg-primary/10 rounded-md border border-primary/20">
          <div className="flex items-center space-x-2">
            <Icon name="Mic" size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              Listening... Say your search terms
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;