import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ForumHeader from './components/ForumHeader';
import DiscussionCard from './components/DiscussionCard';
import ForumSidebar from './components/ForumSidebar';
import CreatePostModal from './components/CreatePostModal';
import ConnectionStatusBanner from './components/ConnectionStatusBanner';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const CommunityForum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock discussions data
  useEffect(() => {
    const mockDiscussions = [
      {
        id: 1,
        author: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          id: 'sarah_j'
        },
        title: 'How to validate your business idea before investing?',
        content: `I have an idea for a sustainable fashion brand targeting young professionals. Before I invest my savings, I want to make sure there's actual demand for this. What are some cost-effective ways to validate a business idea?\n\nI've been thinking about creating a simple landing page and running some social media ads, but I'm not sure if that's enough. Has anyone here successfully validated their business idea? What methods worked best for you?`,
        category: 'business-tips',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        replies: 12,
        likes: 24,
        bookmarked: false,
        isOffline: false,
        hasUnread: true,
        mentorVerified: false,
        tags: ['validation', 'startup', 'fashion', 'market-research'],
        attachments: []
      },
      {
        id: 2,
        author: {
          name: 'Maria Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          id: 'maria_r'
        },
        title: 'From $0 to $10K monthly revenue in 8 months - My journey',
        content: `I wanted to share my journey of building a digital marketing consultancy from scratch. Eight months ago, I was unemployed and had zero clients. Today, I'm consistently earning $10K+ per month.\n\nHere's what worked for me:\n1. Started by offering free consultations to build testimonials\n2. Focused on one niche (local restaurants)\n3. Created valuable content on LinkedIn consistently\n4. Reinvested profits into better tools and training\n\nHappy to answer any questions about the process!`,
        category: 'success-stories',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        replies: 28,
        likes: 67,
        bookmarked: true,
        isOffline: false,
        hasUnread: false,
        mentorVerified: true,
        tags: ['success-story', 'digital-marketing', 'consulting', 'revenue'],
        attachments: [
          { type: 'image', name: 'revenue-chart.png' }
        ]
      },
      {
        id: 3,
        author: {
          name: 'Aisha Patel',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          id: 'aisha_p'
        },
        title: 'Best accounting software for small businesses?',
        content: `I'm looking for recommendations for accounting software that's suitable for a small e-commerce business. I need something that can handle:\n\n- Inventory management\n- Tax calculations\n- Integration with payment processors\n- Basic financial reporting\n\nI've been using spreadsheets so far, but it's getting too complex. Budget is around $50/month. What do you all recommend?`,
        category: 'qa',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        replies: 15,
        likes: 19,
        bookmarked: false,
        isOffline: false,
        hasUnread: true,
        mentorVerified: false,
        tags: ['accounting', 'software', 'ecommerce', 'tools'],
        attachments: []
      },
      {
        id: 4,
        author: {
          name: 'Jennifer Kim',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          id: 'jennifer_k'
        },
        title: 'Women Entrepreneurs Meetup - Lagos, Nigeria',
        content: `Exciting news! We're organizing a women entrepreneurs meetup in Lagos on February 15th. This will be a great opportunity to:\n\n- Network with like-minded women\n- Share experiences and challenges\n- Learn from successful entrepreneurs\n- Explore collaboration opportunities\n\nVenue: Victoria Island Business Hub\nTime: 2:00 PM - 6:00 PM\nEntry: Free (Registration required)\n\nWho's interested in joining us?`,
        category: 'local-events',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        replies: 8,
        likes: 32,
        bookmarked: true,
        isOffline: false,
        hasUnread: false,
        mentorVerified: false,
        tags: ['meetup', 'lagos', 'networking', 'event'],
        attachments: [
          { type: 'image', name: 'event-flyer.jpg' }
        ]
      },
      {
        id: 5,
        author: {
          name: 'Lisa Thompson',
          avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
          id: 'lisa_t'
        },
        title: 'The importance of building an emergency fund for your business',
        content: `One lesson I learned the hard way during the pandemic was the importance of having an emergency fund for your business. When revenue dropped by 70% overnight, having 6 months of expenses saved literally saved my company.\n\nHere are some tips for building your business emergency fund:\n\n1. Start small - even $100/month adds up\n2. Keep it separate from your personal emergency fund\n3. Aim for 3-6 months of operating expenses\n4. Consider it an investment, not an expense\n\nWhat strategies have you used to build your business emergency fund?`,
        category: 'business-tips',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        replies: 22,
        likes: 45,
        bookmarked: false,
        isOffline: true,
        hasUnread: false,
        mentorVerified: true,
        tags: ['emergency-fund', 'financial-planning', 'business-finance'],
        attachments: []
      }
    ];

    setDiscussions(mockDiscussions);
    setFilteredDiscussions(mockDiscussions);
    setLoading(false);
  }, []);

  // Filter discussions based on category and search
  useEffect(() => {
    let filtered = discussions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(discussion => discussion.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(query) ||
        discussion.content.toLowerCase().includes(query) ||
        discussion.author.name.toLowerCase().includes(query) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredDiscussions(filtered);
  }, [discussions, selectedCategory, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const handleSubmitPost = async (postData) => {
    // Simulate API call
    const newPost = {
      ...postData,
      id: Date.now(),
      author: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        id: 'current_user'
      },
      replies: 0,
      likes: 0,
      bookmarked: false,
      isOffline: !navigator.onLine,
      hasUnread: false,
      mentorVerified: false
    };

    setDiscussions(prev => [newPost, ...prev]);
  };

  const handleThreadClick = (discussionId) => {
    // Navigate to thread view (would be implemented with routing)
    console.log('Navigate to thread:', discussionId);
  };

  const handleReact = (discussionId, reactionType) => {
    setDiscussions(prev => prev.map(discussion =>
      discussion.id === discussionId
        ? { ...discussion, likes: discussion.likes + (reactionType === 'like' ? 1 : 0) }
        : discussion
    ));
  };

  const handleBookmark = (discussionId) => {
    setDiscussions(prev => prev.map(discussion =>
      discussion.id === discussionId
        ? { ...discussion, bookmarked: !discussion.bookmarked }
        : discussion
    ));
  };

  const handleJoinEvent = (eventId) => {
    console.log('Join event:', eventId);
  };

  const handleConnectMentor = (mentorId) => {
    console.log('Connect with mentor:', mentorId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-16 pb-14 md:pb-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading community discussions...</p>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="pt-16 pb-14 md:pb-0">
        <ConnectionStatusBanner />
        
        <ForumHeader
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCreatePost={handleCreatePost}
          selectedCategory={selectedCategory}
        />

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    {searchQuery ? `Search results for "${searchQuery}"` : 
                     selectedCategory === 'all' ? 'All Discussions' : selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Sort Options - Desktop Only */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border border-border rounded-md px-2 py-1 bg-input text-foreground">
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="replies">Most Replies</option>
                  </select>
                </div>
              </div>

              {/* Discussion List */}
              {filteredDiscussions.length > 0 ? (
                <div className="space-y-4">
                  {filteredDiscussions.map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                      onThreadClick={handleThreadClick}
                      onReact={handleReact}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageCircle" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    No discussions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 
                      `No discussions match your search for "${searchQuery}"` :
                      'No discussions in this category yet'
                    }
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleCreatePost}
                  >
                    Start a Discussion
                  </Button>
                </div>
              )}

              {/* Load More Button */}
              {filteredDiscussions.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline">
                    Load More Discussions
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <ForumSidebar
            onJoinEvent={handleJoinEvent}
            onConnectMentor={handleConnectMentor}
          />
        </div>
      </div>

      <BottomTabNavigation />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
};

export default CommunityForum;