import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DownloadSettings = ({ settings, onSettingsChange, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-1001"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-1002">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-heading font-semibold text-xl text-foreground">
              Download Settings
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-8">
              {/* Connection Settings */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Connection Preferences
                </h3>
                <div className="space-y-4">
                  <Checkbox
                    label="WiFi only downloads"
                    description="Only download when connected to WiFi to save mobile data"
                    checked={localSettings.wifiOnly}
                    onChange={(e) => updateSetting('wifiOnly', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="Auto-sync when online"
                    description="Automatically sync content when internet connection is available"
                    checked={localSettings.autoSync}
                    onChange={(e) => updateSetting('autoSync', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="Background downloads"
                    description="Continue downloads when app is in background"
                    checked={localSettings.backgroundDownloads}
                    onChange={(e) => updateSetting('backgroundDownloads', e.target.checked)}
                  />
                </div>
              </div>

              {/* Download Quality */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Quality & Compression
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Video Quality
                    </label>
                    <select
                      value={localSettings.videoQuality}
                      onChange={(e) => updateSetting('videoQuality', e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      <option value="auto">Auto (based on connection)</option>
                      <option value="high">High (1080p)</option>
                      <option value="medium">Medium (720p)</option>
                      <option value="low">Low (480p)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Audio Quality
                    </label>
                    <select
                      value={localSettings.audioQuality}
                      onChange={(e) => updateSetting('audioQuality', e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      <option value="high">High (320 kbps)</option>
                      <option value="medium">Medium (192 kbps)</option>
                      <option value="low">Low (128 kbps)</option>
                    </select>
                  </div>

                  <Checkbox
                    label="Compress PDFs"
                    description="Reduce PDF file sizes to save storage space"
                    checked={localSettings.compressPdfs}
                    onChange={(e) => updateSetting('compressPdfs', e.target.checked)}
                  />
                </div>
              </div>

              {/* Storage Management */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Storage Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Maximum Storage Limit
                    </label>
                    <select
                      value={localSettings.storageLimit}
                      onChange={(e) => updateSetting('storageLimit', e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      <option value="500mb">500 MB</option>
                      <option value="1gb">1 GB</option>
                      <option value="2gb">2 GB</option>
                      <option value="5gb">5 GB</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>

                  <Checkbox
                    label="Auto-cleanup old files"
                    description="Automatically remove files not accessed in 30 days"
                    checked={localSettings.autoCleanup}
                    onChange={(e) => updateSetting('autoCleanup', e.target.checked)}
                  />

                  <Checkbox
                    label="Smart storage optimization"
                    description="Automatically manage storage based on usage patterns"
                    checked={localSettings.smartOptimization}
                    onChange={(e) => updateSetting('smartOptimization', e.target.checked)}
                  />
                </div>
              </div>

              {/* Download Behavior */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Download Behavior
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Concurrent Downloads
                    </label>
                    <select
                      value={localSettings.maxConcurrentDownloads}
                      onChange={(e) => updateSetting('maxConcurrentDownloads', parseInt(e.target.value))}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      <option value={1}>1 download at a time</option>
                      <option value={2}>2 downloads at a time</option>
                      <option value={3}>3 downloads at a time</option>
                      <option value={5}>5 downloads at a time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Retry Failed Downloads
                    </label>
                    <select
                      value={localSettings.retryAttempts}
                      onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value))}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      <option value={0}>Never retry</option>
                      <option value={1}>Retry once</option>
                      <option value={3}>Retry 3 times</option>
                      <option value={5}>Retry 5 times</option>
                    </select>
                  </div>

                  <Checkbox
                    label="Resume interrupted downloads"
                    description="Automatically resume downloads that were interrupted"
                    checked={localSettings.resumeDownloads}
                    onChange={(e) => updateSetting('resumeDownloads', e.target.checked)}
                  />
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Notifications
                </h3>
                <div className="space-y-4">
                  <Checkbox
                    label="Download completion notifications"
                    description="Get notified when downloads finish"
                    checked={localSettings.notifyOnComplete}
                    onChange={(e) => updateSetting('notifyOnComplete', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="Storage warnings"
                    description="Get notified when storage is running low"
                    checked={localSettings.storageWarnings}
                    onChange={(e) => updateSetting('storageWarnings', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="Sync notifications"
                    description="Get notified about sync status and errors"
                    checked={localSettings.syncNotifications}
                    onChange={(e) => updateSetting('syncNotifications', e.target.checked)}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Advanced
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Download timeout (seconds)"
                    type="number"
                    value={localSettings.downloadTimeout}
                    onChange={(e) => updateSetting('downloadTimeout', parseInt(e.target.value))}
                    min={30}
                    max={300}
                    description="How long to wait before timing out a download"
                  />

                  <Checkbox
                    label="Enable download analytics"
                    description="Help improve download performance by sharing anonymous usage data"
                    checked={localSettings.enableAnalytics}
                    onChange={(e) => updateSetting('enableAnalytics', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Reset Changes
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadSettings;