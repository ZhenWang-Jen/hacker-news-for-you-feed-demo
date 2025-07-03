
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface StoriesPerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const StoriesPerPageSelector: React.FC<StoriesPerPageSelectorProps> = ({ value, onChange }) => {
  const options = [5, 10, 15, 20, 25];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
          <Settings className="w-4 h-4 mr-2" />
          {value} stories
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={`text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer ${
              value === option ? 'bg-purple-600/20 text-purple-300' : ''
            }`}
          >
            {option} stories per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
