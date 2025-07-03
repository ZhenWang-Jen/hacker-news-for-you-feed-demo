
import React from 'react';

export type FilterType = 'all' | 'story' | 'show' | 'ask' | 'job';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'story', label: 'Stories' },
    { key: 'show', label: 'Show HN' },
    { key: 'ask', label: 'Ask HN' },
    { key: 'job', label: 'Jobs' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeFilter === filter.key
              ? 'bg-purple-600 text-white shadow-sm border-purple-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-600 hover:border-purple-500/50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
