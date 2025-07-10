
import React, { useState, useEffect } from 'react';
import { LogOut, RefreshCw, TrendingUp, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FeedItem, Story } from '@/components/FeedItem';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { StoriesPerPageSelector } from '@/components/StoriesPerPageSelector';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { LoginModal } from '@/components/LoginModal';
import { SignUpModal } from '@/components/SignUpModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTopStories, fetchStories, transformHNStory } from '@/services/hackerNewsApi';
import { getPersonalizedFeed, checkServerHealth } from '@/services/engagementService';
import { matchStoryToPreferences, getRelevanceScore } from '@/utils/storyMatcher';

type FeedType = 'standard' | 'personalized';

const Index = () => {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [storiesPerPage, setStoriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [personalizedStories, setPersonalizedStories] = useState<Story[]>([]);
  const [activeFeed, setActiveFeed] = useState<FeedType>('personalized');
  const [isServerHealthy, setIsServerHealthy] = useState(true);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth().then(setIsServerHealthy);
  }, []);

  // Fetch story IDs
  const { data: storyIds = [], isLoading: isLoadingIds } = useQuery({
    queryKey: ['topStories'],
    queryFn: () => fetchTopStories(100),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch actual stories
  const { data: hnStories = [], isLoading: isLoadingStories } = useQuery({
    queryKey: ['stories', storyIds],
    queryFn: () => fetchStories(storyIds),
    enabled: storyIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Transform HN stories to our format
  useEffect(() => {
    if (hnStories.length > 0) {
      const transformedStories = hnStories.map(transformHNStory);
      setAllStories(transformedStories);
    }
  }, [hnStories]);

  // Get personalized feed when user is authenticated
  useEffect(() => {
    if (user && allStories.length > 0) {
      getPersonalizedFeed({
        userId: user.id,
        stories: allStories
      }).then(setPersonalizedStories);
    }
  }, [user, allStories]);

  const handleVote = (id: number, direction: 'up' | 'down') => {
    const updateStories = (stories: Story[]) =>
      stories.map(story => 
        story.id === id 
          ? { ...story, points: story.points + (direction === 'up' ? 1 : -1) }
          : story
      );

    setAllStories(updateStories);
    setPersonalizedStories(updateStories);
  };

  // Filter stories based on category
  const categoryFilteredStories = allStories.filter(story => 
    activeFilter === 'all' || story.category === activeFilter
  );

  // Get stories for current feed
  const getCurrentStories = () => {
    if (activeFeed === 'personalized' && user) {
      return personalizedStories.filter(story => 
        activeFilter === 'all' || story.category === activeFilter
      );
    } else {
      return categoryFilteredStories.sort((a, b) => b.points - a.points);
    }
  };

  const currentStories = getCurrentStories();
  const displayedStories = currentStories.slice(0, currentPage * storiesPerPage);
  const hasMoreStories = displayedStories.length < currentStories.length;

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleStoriesPerPageChange = (newValue: number) => {
    setStoriesPerPage(newValue);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleFeedChange = (feed: FeedType) => {
    setActiveFeed(feed);
    setCurrentPage(1);
  };

  const isLoading = isLoadingIds || isLoadingStories || authLoading;

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/signup options if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">HN</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Hacker News</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Create an account to get a personalized For You Feed based on your interests
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => setIsLoginModalOpen(true)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
            >
              Login
            </Button>
          </div>
        </div>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
        <SignUpModal 
          isOpen={isSignUpModalOpen} 
          onClose={() => setIsSignUpModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HN</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Hacker News</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {activeFeed === 'personalized' ? 'Personalized For You Feed' : 'Standard Feed'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
              <Button 
                onClick={logout}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Feed Tabs */}
        <div className="mb-8">
          <Tabs value={activeFeed} onValueChange={(value) => handleFeedChange(value as FeedType)}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="personalized" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value="standard" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Standard
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personalized" className="mt-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Stories Curated For You
                  </h2>
                  <div className="flex items-center gap-4">
                    <StoriesPerPageSelector 
                      value={storiesPerPage} 
                      onChange={handleStoriesPerPageChange} 
                    />
                    <div className="text-sm text-gray-400">
                      {isLoading ? 'Loading...' : `Showing ${displayedStories.length} of ${currentStories.length} stories`}
                    </div>
                  </div>
                </div>
                <FilterBar 
                  activeFilter={activeFilter} 
                  onFilterChange={handleFilterChange} 
                />
                {!isServerHealthy && (
                  <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      ⚠️ Personalization server is offline. Showing standard feed.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="standard" className="mt-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Top Stories
                  </h2>
                  <div className="flex items-center gap-4">
                    <StoriesPerPageSelector 
                      value={storiesPerPage} 
                      onChange={handleStoriesPerPageChange} 
                    />
                    <div className="text-sm text-gray-400">
                      {isLoading ? 'Loading...' : `Showing ${displayedStories.length} of ${currentStories.length} stories`}
                    </div>
                  </div>
                </div>
                <FilterBar 
                  activeFilter={activeFilter} 
                  onFilterChange={handleFilterChange} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-gray-400 text-xl">Loading stories...</div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {displayedStories.map((story) => (
                <FeedItem 
                  key={story.id} 
                  story={story} 
                  onVote={handleVote}
                />
              ))}
            </div>
            
            {hasMoreStories && (
              <div className="mt-8 flex justify-center">
                <LoadMoreButton onLoadMore={handleLoadMore} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
