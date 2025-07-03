
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
  onLoadMore, 
  isLoading = false, 
  hasMore = true 
}) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center py-8">
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        variant="outline"
        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3"
      >
        {isLoading ? (
          'Loading more stories...'
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            Load More Stories
          </>
        )}
      </Button>
    </div>
  );
};
