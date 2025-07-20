import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ProgressHeader from './components/ProgressHeader';
import ProgressTimeline from './components/ProgressTimeline';
import ModuleCard from './components/ModuleCard';
import StatisticsPanel from './components/StatisticsPanel';
import AchievementModal from './components/AchievementModal';
import RecommendationsSection from './components/RecommendationsSection';

const LearningPathProgress = () => {
  const navigate = useNavigate();
  const [currentModuleId, setCurrentModuleId] = useState(2);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState(null);

  // Mock data for current learning path
  const currentPath = {
    id: 1,
    title: "Digital Marketing Fundamentals",
    description: "Master the essentials of digital marketing to grow your business online and reach more customers effectively."
  };

  // Mock modules data
  const modules = [
    {
      id: 1,
      title: "Introduction to Digital Marketing",
      description: "Learn the basics of digital marketing and understand different channels available for business growth.",
      duration: "45 min",
      lessonsCount: 6,
      skillsCount: 4,
      progress: 100,
      completed: true,
      downloaded: true,
      keySkills: ["Marketing Strategy", "Customer Analysis", "Channel Selection", "Goal Setting"],
      achievementBadge: true
    },
    {
      id: 2,
      title: "Social Media Marketing",
      description: "Discover how to leverage social media platforms to build brand awareness and engage with customers.",
      duration: "1h 20min",
      lessonsCount: 8,
      skillsCount: 6,
      progress: 65,
      completed: false,
      downloaded: true,
      keySkills: ["Content Creation", "Community Management", "Social Analytics", "Paid Advertising"],
      lastPosition: "Lesson 5: Creating Engaging Content"
    },
    {
      id: 3,
      title: "Email Marketing Campaigns",
      description: "Build effective email marketing campaigns that convert subscribers into loyal customers.",
      duration: "1h 10min",
      lessonsCount: 7,
      skillsCount: 5,
      progress: 0,
      completed: false,
      downloaded: false,
      locked: false,
      keySkills: ["Email Design", "Automation", "Segmentation", "Analytics", "A/B Testing"]
    },
    {
      id: 4,
      title: "Search Engine Optimization",
      description: "Optimize your website and content to rank higher in search results and attract organic traffic.",
      duration: "1h 30min",
      lessonsCount: 9,
      skillsCount: 7,
      progress: 0,
      completed: false,
      downloaded: false,
      locked: true,
      prerequisites: "Complete Social Media Marketing module",
      keySkills: ["Keyword Research", "On-page SEO", "Technical SEO", "Link Building"]
    },
    {
      id: 5,
      title: "Analytics & Performance Tracking",
      description: "Learn to measure and analyze your digital marketing efforts to optimize for better results.",
      duration: "1h 15min",
      lessonsCount: 8,
      skillsCount: 6,
      progress: 0,
      completed: false,
      downloaded: false,
      locked: true,
      prerequisites: "Complete Email Marketing Campaigns module",
      keySkills: ["Google Analytics", "KPI Tracking", "ROI Analysis", "Reporting"]
    }
  ];

  // Mock statistics
  const stats = {
    streak: 12,
    totalHours: 28,
    skillsMastered: 15,
    completedModules: 1,
    totalModules: 5,
    progressPercentage: 33,
    weeklyProgress: 3.5
  };

  // Mock recommendations
  const recommendations = [
    {
      id: 2,
      title: "E-commerce Business Setup",
      description: "Learn how to start and manage an online store, from product selection to customer service.",
      duration: "6 hours",
      modulesCount: 8,
      enrolledCount: 1247,
      skills: ["Product Research", "Store Setup", "Payment Processing", "Inventory Management", "Customer Service"],
      icon: "ShoppingCart",
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      isNew: true,
      matchReason: "Perfect next step after mastering digital marketing to apply your skills to e-commerce."
    },
    {
      id: 3,
      title: "Financial Planning for Entrepreneurs",
      description: "Master personal and business financial management to build a sustainable and profitable venture.",
      duration: "4.5 hours",
      modulesCount: 6,
      enrolledCount: 892,
      skills: ["Budgeting", "Cash Flow", "Investment Planning", "Tax Management", "Financial Reporting"],
      icon: "TrendingUp",
      iconColor: "text-success",
      bgColor: "bg-success/10",
      isNew: false,
      matchReason: "Complement your marketing skills with financial literacy to run a successful business."
    }
  ];

  // Calculate overall progress
  const overallProgress = Math.round(
    (modules.filter(m => m.completed).length / modules.length) * 100
  );

  const timeRemaining = "4h 15min";

  // Handle module interactions
  const handleModuleClick = (module) => {
    if (!module.locked) {
      setCurrentModuleId(module.id);
      // Navigate to module content or show module details
      console.log('Opening module:', module.title);
    }
  };

  const handleContinueModule = (module) => {
    console.log('Continuing module:', module.title);
    // Navigate to learning interface
  };

  const handleReviewModule = (module) => {
    console.log('Reviewing module:', module.title);
    // Navigate to module review
  };

  const handleStartPath = (path) => {
    console.log('Starting new path:', path.title);
    navigate('/resource-library');
  };

  const handleShareAchievement = () => {
    console.log('Sharing achievement...');
    // Implement sharing functionality
  };

  // Simulate achievement unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      if (modules.find(m => m.id === 1)?.completed) {
        setAchievementData({
          title: "Digital Marketing Basics Mastered!",
          description: "You've successfully completed your first module and gained essential marketing knowledge.",
          completionTime: "45 min",
          skillsGained: 4,
          skills: ["Marketing Strategy", "Customer Analysis", "Channel Selection", "Goal Setting"],
          nextSteps: "Continue with Social Media Marketing to build on your foundation and learn practical application techniques."
        });
        setShowAchievement(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="pt-16 pb-20 md:pb-8">
        {/* Progress Header */}
        <ProgressHeader 
          currentPath={currentPath}
          overallProgress={overallProgress}
          timeRemaining={timeRemaining}
        />

        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
          {/* Progress Timeline */}
          <ProgressTimeline 
            modules={modules}
            currentModuleId={currentModuleId}
            onModuleClick={handleModuleClick}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Module Card */}
              <div>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Current Module
                </h2>
                {modules
                  .filter(module => module.id === currentModuleId)
                  .map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCurrentModule={true}
                      onContinue={handleContinueModule}
                      onReview={handleReviewModule}
                    />
                  ))
                }
              </div>

              {/* All Modules */}
              <div>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  All Modules
                </h2>
                <div className="space-y-4">
                  {modules.map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCurrentModule={module.id === currentModuleId}
                      onContinue={handleContinueModule}
                      onReview={handleReviewModule}
                    />
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <RecommendationsSection 
                recommendations={recommendations}
                onStartPath={handleStartPath}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <StatisticsPanel stats={stats} />
            </div>
          </div>
        </div>
      </main>

      <BottomTabNavigation />

      {/* Achievement Modal */}
      <AchievementModal
        achievement={achievementData}
        isOpen={showAchievement}
        onClose={() => setShowAchievement(false)}
        onShare={handleShareAchievement}
      />
    </div>
  );
};

export default LearningPathProgress;