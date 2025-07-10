
import React, { useState } from 'react';
import { MessageSquare, ExternalLink, Clock, Send } from 'lucide-react';
import { VoteButton } from './VoteButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { trackEngagement } from '@/services/engagementService';

export interface Story {
  id: number;
  title: string;
  url?: string;
  points: number;
  author: string;
  timeAgo: string;
  comments: number;
  category: 'story' | 'show' | 'ask' | 'job';
  rank_score?: number;
}

interface FeedItemProps {
  story: Story;
  onVote: (id: number, direction: 'up' | 'down') => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ story, onVote }) => {
  const { user } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

  const handleTitleClick = async () => {
    if (story.url) {
      // Track click engagement
      if (user) {
        await trackEngagement({
          userId: user.id,
          storyId: story.id,
          eventType: 'click',
          metadata: {
            url: story.url,
            title: story.title
          }
        });
      }
      
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

  const handleVote = async (direction: 'up' | 'down') => {
    // Track vote engagement
    if (user) {
      await trackEngagement({
        userId: user.id,
        storyId: story.id,
        eventType: 'upvote',
        metadata: {
          direction,
          points: story.points
        }
      });
    }
    
    onVote(story.id, direction);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmittingComment(true);
    
    try {
      // Track comment engagement
      await trackEngagement({
        userId: user.id,
        storyId: story.id,
        eventType: 'comment',
        metadata: {
          comment: commentText.trim(),
          storyTitle: story.title
        }
      });

      setCommentText('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 hover:border-purple-500/30 transition-all duration-200">
      <div className="flex gap-4">
        <VoteButton 
          points={story.points} 
          onVote={handleVote}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            {story.category !== 'story' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
                {getCategoryLabel(story.category)}
              </span>
            )}
            {story.rank_score && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-500/30">
                Score: {story.rank_score.toFixed(2)}
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

            {user && (
              <button 
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="flex items-center gap-2 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add comment</span>
              </button>
            )}
          </div>

          {showCommentInput && user && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment || !commentText.trim()}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
