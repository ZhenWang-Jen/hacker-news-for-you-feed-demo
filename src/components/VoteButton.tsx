
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
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => handleVote('up')}
        className={`p-2 rounded-full transition-all duration-200 ${
          voted === 'up' 
            ? 'text-purple-400 bg-purple-500/20 shadow-sm border border-purple-500/30' 
            : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      
      <span className={`text-sm font-bold transition-colors ${
        voted === 'up' ? 'text-purple-400' : 'text-gray-300'
      }`}>
        {currentPoints}
      </span>
    </div>
  );
};
