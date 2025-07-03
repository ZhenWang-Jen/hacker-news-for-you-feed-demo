
import React, { useState } from 'react';
import { FeedItem, Story } from '@/components/FeedItem';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { mockStories } from '@/data/mockStories';

const Index = () => {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleVote = (id: number, direction: 'up' | 'down') => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === id 
          ? { ...story, points: story.points + (direction === 'up' ? 1 : -1) }
          : story
      )
    );
  };

  const filteredStories = stories.filter(story => 
    activeFilter === 'all' || story.category === activeFilter
  );

  const sortedStories = [...filteredStories].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HN</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">For You Feed</h1>
            </div>
            <div className="text-sm text-gray-500">
              {sortedStories.length} stories
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <FilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <div className="space-y-4">
          {sortedStories.map((story) => (
            <FeedItem 
              key={story.id} 
              story={story} 
              onVote={handleVote}
            />
          ))}
        </div>

        {sortedStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No stories found</div>
            <div className="text-gray-500">Try selecting a different filter</div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Inspired by Hacker News • Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
