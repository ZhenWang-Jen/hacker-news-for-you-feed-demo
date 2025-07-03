
import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface VoteButtonProps {
  points: number;
  onVote: (direction: 'up' | 'down') => void;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ points, onVote }) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [currentPoints, setCurrentPoints] = useState(points);

  const handleVote = (direction: 'up' | 'down') => {
    if (voted === direction) return;
    
    const pointChange = direction === 'up' ? 1 : -1;
    const previousVoteAdjustment = voted ? (voted === 'up' ? -1 : 1) : 0;
    
    setCurrentPoints(points + pointChange + previousVoteAdjustment);
    setVoted(direction);
    onVote(direction);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote('up')}
        className={`p-1 rounded-full transition-all duration-200 ${
          voted === 'up' 
            ? 'text-orange-600 bg-orange-50 shadow-sm' 
            : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
        }`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      
      <span className={`text-sm font-medium transition-colors ${
        voted === 'up' ? 'text-orange-600' : 'text-gray-600'
      }`}>
        {currentPoints}
      </span>
    </div>
  );
};
