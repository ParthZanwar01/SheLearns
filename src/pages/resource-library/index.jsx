import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SearchHeader from './components/SearchHeader';
import FilterChips from './components/FilterChips';
import ResourceCard from './components/ResourceCard';
import DownloadQueue from './components/DownloadQueue';
import StorageUsage from './components/StorageUsage';
import AdvancedFilters from './components/AdvancedFilters';
import Icon from '../../components/AppIcon';

const ResourceLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    type: [],
    difficulty: [],
    language: []
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    businessStage: [],
    marketType: [],
    mentorRecommended: [],
    duration: [],
    hasSubtitles: false,
    isInteractive: false,
    hasWorksheets: false,
    isCertified: false,
    minRating: 0
  });
  const [resources, setResources] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [showDownloadQueue, setShowDownloadQueue] = useState(false);
  const [showStorageUsage, setShowStorageUsage] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Mock data for resources
  const mockResources = [
    {
      id: 1,
      title: "Financial Planning for Small Business Owners",
      description: "Learn essential financial planning strategies to manage cash flow, budgeting, and investment decisions for your growing business.",
      thumbnail: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
      author: "Sarah Johnson",
      type: "video",
      category: "finance",
      difficulty: "intermediate",
      language: "english",
      duration: 45,
      size: 125.5,
      rating: 4.8,
      isBookmarked: false,
      isDownloaded: false,
      businessStage: ["startup", "growth"],
      marketType: ["urban", "online"],
      hasSubtitles: true,
      isInteractive: true,
      hasWorksheets: true,
      isCertified: true
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      description: "Master the basics of digital marketing including social media, email marketing, and online advertising strategies.",
      thumbnail: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
      author: "Maria Rodriguez",
      type: "pdf",
      category: "marketing",
      difficulty: "beginner",
      language: "english",
      duration: 30,
      size: 15.2,
      rating: 4.6,
      isBookmarked: true,
      isDownloaded: true,
      businessStage: ["idea", "startup"],
      marketType: ["online", "local"],
      hasSubtitles: false,
      isInteractive: false,
      hasWorksheets: true,
      isCertified: false
    },
    {
      id: 3,
      title: "Entrepreneurship Mindset Development",
      description: "Develop the entrepreneurial mindset needed to identify opportunities, take calculated risks, and build resilient businesses.",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      author: "Dr. Amara Okafor",
      type: "audio",
      category: "entrepreneurship",
      difficulty: "intermediate",
      language: "english",
      duration: 60,
      size: 45.8,
      rating: 4.9,
      isBookmarked: false,
      isDownloaded: false,
      businessStage: ["idea", "startup", "growth"],
      marketType: ["urban", "rural"],
      hasSubtitles: true,
      isInteractive: false,
      hasWorksheets: false,
      isCertified: true
    },
    {
      id: 4,
      title: "Basic Computer Skills for Business",
      description: "Essential computer and digital literacy skills for modern business operations including email, documents, and online tools.",
      thumbnail: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
      author: "Tech Academy",
      type: "interactive",
      category: "digital-literacy",
      difficulty: "beginner",
      language: "english",
      duration: 90,
      size: 78.3,
      rating: 4.4,
      isBookmarked: true,
      isDownloaded: false,
      businessStage: ["idea", "startup"],
      marketType: ["rural", "local"],
      hasSubtitles: true,
      isInteractive: true,
      hasWorksheets: true,
      isCertified: true
    },
    {
      id: 5,
      title: "Market Research and Customer Analysis",
      description: "Learn how to conduct effective market research, understand your target customers, and validate business ideas.",
      thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
      author: "Business Institute",
      type: "video",
      category: "marketing",
      difficulty: "advanced",
      language: "english",
      duration: 75,
      size: 156.7,
      rating: 4.7,
      isBookmarked: false,
      isDownloaded: true,
      businessStage: ["startup", "growth", "established"],
      marketType: ["urban", "online"],
      hasSubtitles: true,
      isInteractive: false,
      hasWorksheets: true,
      isCertified: true
    },
    {
      id: 6,
      title: "Legal Basics for Women Entrepreneurs",
      description: "Understanding legal requirements, business registration, contracts, and intellectual property protection for women-owned businesses.",
      thumbnail: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
      author: "Legal Advisory Group",
      type: "pdf",
      category: "entrepreneurship",
      difficulty: "intermediate",
      language: "english",
      duration: 40,
      size: 22.1,
      rating: 4.5,
      isBookmarked: false,
      isDownloaded: false,
      businessStage: ["startup", "growth"],
      marketType: ["urban", "rural", "local"],
      hasSubtitles: false,
      isInteractive: false,
      hasWorksheets: true,
      isCertified: false
    }
  ];

  // Mock downloads data
  const mockDownloads = [
    {
      id: 1,
      title: "Financial Planning for Small Business Owners",
      progress: 75,
      size: 125.5,
      status: 'downloading',
      priority: 'high'
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      progress: 100,
      size: 15.2,
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      title: "Market Research and Customer Analysis",
      progress: 45,
      size: 156.7,
      status: 'downloading',
      priority: 'medium'
    }
  ];

  // Initialize data
  useEffect(() => {
    setResources(mockResources);
    setDownloads(mockDownloads);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    // Search query filter
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.author.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Basic filters
    if (activeFilters.category.length > 0 && !activeFilters.category.includes(resource.category)) {
      return false;
    }
    if (activeFilters.type.length > 0 && !activeFilters.type.includes(resource.type)) {
      return false;
    }
    if (activeFilters.difficulty.length > 0 && !activeFilters.difficulty.includes(resource.difficulty)) {
      return false;
    }
    if (activeFilters.language.length > 0 && !activeFilters.language.includes(resource.language)) {
      return false;
    }

    // Advanced filters
    if (advancedFilters.businessStage.length > 0 && 
        !advancedFilters.businessStage.some(stage => resource.businessStage.includes(stage))) {
      return false;
    }
    if (advancedFilters.marketType.length > 0 && 
        !advancedFilters.marketType.some(market => resource.marketType.includes(market))) {
      return false;
    }
    if (advancedFilters.hasSubtitles && !resource.hasSubtitles) {
      return false;
    }
    if (advancedFilters.isInteractive && !resource.isInteractive) {
      return false;
    }
    if (advancedFilters.hasWorksheets && !resource.hasWorksheets) {
      return false;
    }
    if (advancedFilters.isCertified && !resource.isCertified) {
      return false;
    }
    if (advancedFilters.minRating > 0 && resource.rating < advancedFilters.minRating) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (category, filters) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: filters
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      category: [],
      type: [],
      difficulty: [],
      language: []
    });
    setAdvancedFilters({
      businessStage: [],
      marketType: [],
      mentorRecommended: [],
      duration: [],
      hasSubtitles: false,
      isInteractive: false,
      hasWorksheets: false,
      isCertified: false,
      minRating: 0
    });
  };

  const handleDownload = (resource) => {
    const newDownload = {
      id: Date.now(),
      title: resource.title,
      progress: 0,
      size: resource.size,
      status: 'downloading',
      priority: 'medium'
    };
    setDownloads(prev => [...prev, newDownload]);
    
    // Update resource as downloaded after completion
    setTimeout(() => {
      setResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, isDownloaded: true } : r
      ));
    }, 3000);
  };

  const handleBookmark = (resource) => {
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, isBookmarked: !r.isBookmarked } : r
    ));
  };

  const handlePreview = (resource) => {
    console.log('Preview resource:', resource.title);
  };

  const handleDownloadPause = (downloadId) => {
    setDownloads(prev => prev.map(d => 
      d.id === downloadId ? { ...d, status: 'paused' } : d
    ));
  };

  const handleDownloadResume = (downloadId) => {
    setDownloads(prev => prev.map(d => 
      d.id === downloadId ? { ...d, status: 'downloading' } : d
    ));
  };

  const handleDownloadCancel = (downloadId) => {
    setDownloads(prev => prev.filter(d => d.id !== downloadId));
  };

  const handlePriorityChange = (downloadId, priority) => {
    setDownloads(prev => prev.map(d => 
      d.id === downloadId ? { ...d, priority } : d
    ));
  };

  const handleStorageCleanup = (type) => {
    console.log('Cleanup:', type);
    // Implement cleanup logic
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="pt-16 pb-20 md:pb-4">
        {/* Search Header */}
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOnline={isOnline}
          syncStatus={syncStatus}
        />

        {/* Filter Chips */}
        <FilterChips
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
        />

        {/* Results Summary */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredResources.length} resources found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
                <Icon name="ArrowUpDown" size={14} />
                <span>Sort</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-8 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Icon name="Search" size={24} className="text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                No resources found
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Try adjusting your search terms or filters to find the content you're looking for.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="text-primary hover:text-primary/80 font-medium transition-micro"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDownload={handleDownload}
                  onBookmark={handleBookmark}
                  onPreview={handlePreview}
                  isOnline={isOnline}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredResources.length > 0 && filteredResources.length >= 6 && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-micro"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More Resources'
              )}
            </button>
          </div>
        )}
      </main>

      {/* Download Queue */}
      <DownloadQueue
        downloads={downloads}
        onPause={handleDownloadPause}
        onResume={handleDownloadResume}
        onCancel={handleDownloadCancel}
        onPriorityChange={handlePriorityChange}
        isVisible={showDownloadQueue}
        onToggle={() => setShowDownloadQueue(!showDownloadQueue)}
      />

      {/* Storage Usage */}
      <StorageUsage
        usedStorage={245.8}
        totalStorage={500}
        onCleanup={handleStorageCleanup}
        isVisible={showStorageUsage}
        onToggle={() => setShowStorageUsage(!showStorageUsage)}
      />

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        isVisible={showAdvancedFilters}
        onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      <BottomTabNavigation />
    </div>
  );
};

export default ResourceLibrary;