
import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FeedItem, Story } from '@/components/FeedItem';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { StoriesPerPageSelector } from '@/components/StoriesPerPageSelector';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { LoginModal } from '@/components/LoginModal';
import { SignUpModal } from '@/components/SignUpModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTopStories, fetchStories, transformHNStory } from '@/services/hackerNewsApi';
import { matchStoryToPreferences, getRelevanceScore } from '@/utils/storyMatcher';

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [storiesPerPage, setStoriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [allStories, setAllStories] = useState<Story[]>([]);

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

  const handleVote = (id: number, direction: 'up' | 'down') => {
    setAllStories(prevStories => 
      prevStories.map(story => 
        story.id === id 
          ? { ...story, points: story.points + (direction === 'up' ? 1 : -1) }
          : story
      )
    );
  };

  // Filter stories based on category
  const categoryFilteredStories = allStories.filter(story => 
    activeFilter === 'all' || story.category === activeFilter
  );

  // Filter stories based on user preferences and sort by relevance
  const personalizedStories = user?.preferences?.length 
    ? categoryFilteredStories
        .filter(story => matchStoryToPreferences(story.title, user.preferences))
        .sort((a, b) => {
          const scoreA = getRelevanceScore(a.title, user.preferences);
          const scoreB = getRelevanceScore(b.title, user.preferences);
          if (scoreA !== scoreB) return scoreB - scoreA; // Higher relevance first
          return b.points - a.points; // Then by points
        })
    : categoryFilteredStories.sort((a, b) => b.points - a.points);

  const displayedStories = personalizedStories.slice(0, currentPage * storiesPerPage);
  const hasMoreStories = displayedStories.length < personalizedStories.length;

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

  const isLoading = isLoadingIds || isLoadingStories;

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
                  {user?.preferences?.length ? 'Personalized For You Feed' : 'For You Feed'}
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {user?.preferences?.length ? 'Stories Curated For You' : 'Discover Stories'}
            </h2>
            <div className="flex items-center gap-4">
              <StoriesPerPageSelector 
                value={storiesPerPage} 
                onChange={handleStoriesPerPageChange} 
              />
              <div className="text-sm text-gray-400">
                {isLoading ? 'Loading...' : `Showing ${displayedStories.length} of ${personalizedStories.length} stories`}
              </div>
            </div>
          </div>
          <FilterBar 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-gray-400 text-xl">Loading personalized stories...</div>
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

            {displayedStories.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-xl mb-3">No matching stories found</div>
                <div className="text-gray-500">Try selecting a different filter or adjusting your preferences</div>
              </div>
            )}

            <LoadMoreButton 
              onLoadMore={handleLoadMore}
              isLoading={false}
              hasMore={hasMoreStories}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-gray-400 text-sm">
          <p>Real Hacker News Stories • Built with React & Tailwind CSS • Powered by Shaped AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
