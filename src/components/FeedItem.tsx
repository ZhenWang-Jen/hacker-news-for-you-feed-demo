
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200">
      <div className="flex gap-3">
        <VoteButton 
          points={story.points} 
          onVote={(direction) => onVote(story.id, direction)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            {story.category !== 'story' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {getCategoryLabel(story.category)}
              </span>
            )}
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-1 leading-tight hover:text-orange-600 transition-colors cursor-pointer">
            {story.title}
          </h2>
          
          {story.url && (
            <div className="flex items-center gap-1 mb-2">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-500">{getDomain(story.url)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{story.timeAgo}</span>
            </div>
            
            <span>by {story.author}</span>
            
            <div className="flex items-center gap-1 hover:text-orange-600 transition-colors cursor-pointer">
              <MessageSquare className="w-3 h-3" />
              <span>{story.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
