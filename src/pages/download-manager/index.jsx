import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalHeader from '../../components/ui/GlobalHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ActiveDownloadsTab from './components/ActiveDownloadsTab';
import CompletedDownloadsTab from './components/CompletedDownloadsTab';
import StorageManagementTab from './components/StorageManagementTab';
import DownloadSettings from './components/DownloadSettings';
import ConnectivityStatus from './components/ConnectivityStatus';
import { useDownloads } from '../../hooks/useDownloads';
import { useSync } from '../../hooks/useSync';

const DownloadManager = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    activeDownloads, 
    completedDownloads, 
    queuedDownloads, 
    storageInfo,
    cleanupOldFiles 
  } = useDownloads();

  const { syncStatus, syncNow } = useSync();

  const handleSyncNow = async () => {
    const result = await syncNow();
    if (!result.success) {
      console.error('Sync failed:', result.error);
    }
  };

  const handleCleanupFiles = async () => {
    const cleanedCount = await cleanupOldFiles(30);
    console.log(`Cleaned up ${cleanedCount} old files`);
  };

  const tabs = [
    {
      id: 'active',
      label: 'Active',
      icon: 'Download',
      count: activeDownloads.length + queuedDownloads.length
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'CheckCircle',
      count: completedDownloads.length
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: 'HardDrive',
      count: null
    }
  ];

  return (
    <>
      <Helmet>
        <title>Download Manager - SkillBridge</title>
        <meta name="description" content="Manage your offline content downloads and storage efficiently" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />
        
        <main className="pt-16 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Download Manager
                </h1>
                <p className="text-muted-foreground">
                  Manage your offline content and storage efficiently
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {syncStatus.pendingChanges > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleSyncNow}
                    disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
                    className="flex items-center space-x-2"
                  >
                    <Icon name={syncStatus.syncInProgress ? "RotateCcw" : "RefreshCw"} size={16} 
                          className={syncStatus.syncInProgress ? "animate-spin" : ""} />
                    <span className="hidden sm:inline">
                      {syncStatus.syncInProgress ? 'Syncing...' : 'Sync'}
                    </span>
                    {syncStatus.pendingChanges > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {syncStatus.pendingChanges}
                      </span>
                    )}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Settings" size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>

            {/* Connectivity Status */}
            <div className="mb-6">
              <ConnectivityStatus />
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <input
                  type="text"
                  placeholder="Search downloads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-micro ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                      {tab.count !== null && tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'active' && <ActiveDownloadsTab />}
              {activeTab === 'completed' && <CompletedDownloadsTab />}
              {activeTab === 'storage' && (
                <StorageManagementTab
                  storageData={storageInfo}
                  onCleanup={handleCleanupFiles}
                  onOptimize={() => console.log('Optimizing storage...')}
                />
              )}
            </div>
          </div>
        </main>

        <BottomTabNavigation />

        {/* Settings Modal */}
        {showSettings && (
          <DownloadSettings
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </>
  );
};

export default DownloadManager;