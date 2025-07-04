
import React from 'react';
import { MessageSquare, ExternalLink, Clock } from 'lucide-react';
import { VoteButton } from './VoteButton';

export interface Story {
  id: number;
  title: string;
  url?: string;
  points: number;
  author: string;
  timeAgo: string;
  comments: number;
  category: 'story' | 'show' | 'ask' | 'job';
}

interface FeedItemProps {
  story: Story;
  onVote: (id: number, direction: 'up' | 'down') => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ story, onVote }) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'show': return 'Show HN';
      case 'ask': return 'Ask HN';
      case 'job': return 'Job';
      default: return '';
    }
  };

  const getDomain = (url?: string) => {
    if (!url) return '';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  const handleTitleClick = () => {
    if (story.url) {
      window.open(story.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAuthorClick = () => {
    const hackerNewsUserUrl = `https://news.ycombinator.com/user?id=${story.author}`;
    window.open(hackerNewsUserUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCommentsClick = () => {
    const hackerNewsItemUrl = `https://news.ycombinator.com/item?id=${story.id}`;
    window.open(hackerNewsItemUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 hover:border-purple-500/30 transition-all duration-200">
      <div className="flex gap-4">
        <VoteButton 
          points={story.points} 
          onVote={(direction) => onVote(story.id, direction)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            {story.category !== 'story' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
                {getCategoryLabel(story.category)}
              </span>
            )}
          </div>
          
          <h2 
            className="text-xl font-semibold text-white mb-2 leading-tight hover:text-purple-300 transition-colors cursor-pointer"
            onClick={handleTitleClick}
          >
            {story.title}
          </h2>
          
          {story.url && (
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <button 
                onClick={handleTitleClick}
                className="text-sm text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                {getDomain(story.url)}
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{story.timeAgo}</span>
            </div>
            
            <button 
              onClick={handleAuthorClick}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              by {story.author}
            </button>
            
            <button 
              onClick={handleCommentsClick}
              className="flex items-center gap-2 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{story.comments} comments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
