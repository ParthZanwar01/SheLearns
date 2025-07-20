import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import WelcomeSection from './components/WelcomeSection';
import ConnectionStatusBanner from './components/ConnectionStatusBanner';
import QuickAccessCards from './components/QuickAccessCards';
import ProgressOverview from './components/ProgressOverview';
import RecommendedContent from './components/RecommendedContent';
import DownloadStatusWidget from './components/DownloadStatusWidget';
import CommunityHighlights from './components/CommunityHighlights';
import InspirationalSection from './components/InspirationalSection';

const HomeDashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncProgress, setSyncProgress] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date(Date.now() - 300000)); // 5 minutes ago

  // Mock user data
  const user = {
    name: "Priya",
    streak: 7,
    achievements: 12
  };

  // Mock learning paths data
  const learningPaths = [
    {
      id: 1,
      title: "Business Fundamentals",
      icon: "Briefcase",
      color: "text-primary",
      bgColor: "bg-primary/10",
      progress: 75,
      completedLessons: 9,
      totalLessons: 12,
      motivationalMessage: "You\'re almost there! Keep pushing forward."
    },
    {
      id: 2,
      title: "Digital Marketing Basics",
      icon: "Megaphone",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      progress: 45,
      completedLessons: 5,
      totalLessons: 11,
      motivationalMessage: "Great progress! Marketing skills are powerful tools."
    },
    {
      id: 3,
      title: "Financial Literacy",
      icon: "DollarSign",
      color: "text-accent",
      bgColor: "bg-accent/10",
      progress: 30,
      completedLessons: 3,
      totalLessons: 10,
      motivationalMessage: "Every step builds your financial confidence."
    }
  ];

  // Mock recent courses
  const recentCourses = [
    { id: 1, title: "Business Plan Writing", progress: 60 },
    { id: 2, title: "Social Media Marketing", progress: 30 },
    { id: 3, title: "Budget Management", progress: 80 }
  ];

  // Mock bookmarked resources
  const bookmarkedResources = [
    { id: 1, title: "Startup Checklist Template", type: "PDF" },
    { id: 2, title: "Customer Interview Guide", type: "Document" },
    { id: 3, title: "Pricing Strategy Video", type: "Video" },
    { id: 4, title: "Market Research Tools", type: "Article" },
    { id: 5, title: "Legal Business Forms", type: "PDF" }
  ];

  // Mock download queue
  const downloadQueue = [
    { id: 1, title: "Business Plan Template.pdf", size: "2.4 MB", status: "downloading" },
    { id: 2, title: "Marketing Guide.mp4", size: "15.8 MB", status: "queued" },
    { id: 3, title: "Financial Calculator.xlsx", size: "1.2 MB", status: "queued" }
  ];

  // Mock recommended content
  const recommendations = [
    {
      id: 1,
      title: "Building Your First Business Plan",
      description: "Learn how to create a comprehensive business plan that attracts investors and guides your startup journey.",
      category: "Business Planning",
      categoryColor: "bg-primary/10",
      categoryTextColor: "text-primary",
      duration: "45 min",
      rating: 4.8,
      isNew: true,
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    },
    {
      id: 2,
      title: "Social Media Marketing for Small Business",
      description: "Master the art of social media marketing to grow your business and connect with customers effectively.",
      category: "Marketing",
      categoryColor: "bg-secondary/10",
      categoryTextColor: "text-secondary",
      duration: "30 min",
      rating: 4.6,
      isNew: false,
      thumbnail: "https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg"
    },
    {
      id: 3,
      title: "Financial Management Essentials",
      description: "Understand cash flow, budgeting, and financial planning to keep your business financially healthy.",
      category: "Finance",
      categoryColor: "bg-accent/10",
      categoryTextColor: "text-accent",
      duration: "60 min",
      rating: 4.9,
      isNew: true,
      thumbnail: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
    },
    {
      id: 4,
      title: "Customer Service Excellence",
      description: "Build lasting customer relationships through exceptional service and communication skills.",
      category: "Customer Relations",
      categoryColor: "bg-success/10",
      categoryTextColor: "text-success",
      duration: "25 min",
      rating: 4.7,
      isNew: false,
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
    }
  ];

  // Mock community data
  const discussions = [
    {
      id: 1,
      title: "How to price your products competitively?",
      author: "Sarah M.",
      replies: 12,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      title: "Best practices for customer retention",
      author: "Maria L.",
      replies: 8,
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  const mentorConnections = [
    { id: 1, name: "Dr. Amara", expertise: "Business Strategy" },
    { id: 2, name: "Lisa Chen", expertise: "Digital Marketing" },
    { id: 3, name: "Fatima Al", expertise: "Finance" },
    { id: 4, name: "Rosa Martinez", expertise: "Operations" },
    { id: 5, name: "Aisha Patel", expertise: "Legal" }
  ];

  // Mock inspirational quotes
  const quotes = [
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "Don\'t be afraid to give up the good to go for the great.",
      author: "John D. Rockefeller"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins"
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Women Entrepreneurs Meetup",
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      location: "Community Center"
    },
    {
      id: 2,
      title: "Digital Skills Workshop",
      date: new Date(Date.now() + 86400000 * 7), // 1 week from now
      location: "Local Library"
    }
  ];

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate sync process
      setSyncProgress(0);
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setSyncProgress(null);
            setLastSyncTime(new Date());
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncProgress(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="py-6 space-y-6">
              <WelcomeSection 
                user={user}
                streak={user.streak}
                achievements={user.achievements}
              />
              
              <ConnectionStatusBanner
                isOnline={isOnline}
                syncProgress={syncProgress}
                lastSyncTime={lastSyncTime}
              />
              
              <QuickAccessCards
                recentCourses={recentCourses}
                bookmarkedResources={bookmarkedResources}
                downloadQueue={downloadQueue}
              />
              
              <ProgressOverview learningPaths={learningPaths} />
              
              <RecommendedContent recommendations={recommendations} />
              
              <DownloadStatusWidget
                storageUsed={156}
                storageTotal={500}
                activeDownloads={1}
                queuedDownloads={2}
              />
              
              <CommunityHighlights
                discussions={discussions}
                mentorConnections={mentorConnections}
                isOnline={isOnline}
              />
              
              <InspirationalSection
                quotes={quotes}
                upcomingEvents={upcomingEvents}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="col-span-8">
                  <WelcomeSection 
                    user={user}
                    streak={user.streak}
                    achievements={user.achievements}
                  />
                  
                  <ConnectionStatusBanner
                    isOnline={isOnline}
                    syncProgress={syncProgress}
                    lastSyncTime={lastSyncTime}
                  />
                  
                  <QuickAccessCards
                    recentCourses={recentCourses}
                    bookmarkedResources={bookmarkedResources}
                    downloadQueue={downloadQueue}
                  />
                  
                  <ProgressOverview learningPaths={learningPaths} />
                  
                  <RecommendedContent recommendations={recommendations} />
                </div>

                {/* Right Column */}
                <div className="col-span-4">
                  <div className="space-y-6">
                    <DownloadStatusWidget
                      storageUsed={156}
                      storageTotal={500}
                      activeDownloads={1}
                      queuedDownloads={2}
                    />
                    
                    <CommunityHighlights
                      discussions={discussions}
                      mentorConnections={mentorConnections}
                      isOnline={isOnline}
                    />
                    
                    <InspirationalSection
                      quotes={quotes}
                      upcomingEvents={upcomingEvents}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomTabNavigation />
    </div>
  );
};

export default HomeDashboard;