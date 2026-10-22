import React, { useState } from 'react';
import { BookCategory, SortOption, ViewMode, DurationFilter, EraFilter } from '../types/book';
import { useLibrary } from '../context/LibraryContext';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  Columns,
  Filter
} from 'lucide-react';

interface FilterBarProps {
  totalResults: number;
}

const CATEGORIES: BookCategory[] = [
  'All',
  'Architecture & Design',
  'Philosophy',
  'Science & Technology',
  'Literary Fiction',
  'Essays & Art',
  'History & Civilization',
  'Psychology & Mind'
];

export const FilterBar: React.FC<FilterBarProps> = ({ totalResults }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    durationFilter,
    setDurationFilter,
    eraFilter,
    setEraFilter,
    pageSize,
    setPageSize,
    isApiSearching
  } = useLibrary();

  const [expandedFilters, setExpandedFilters] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    durationFilter !== 'all' ||
    eraFilter !== 'all' ||
    sortBy !== 'featured';

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setDurationFilter('all');
    setEraFilter('all');
  };

  return (
    <div className="space-y-4">
      {/* Top Search, View Switcher & Sort Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input field */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            {isApiSearching ? (
              <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog & live Books API (e.g. Sapiens, Stoic, AI, Architecture)..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-500/50 dark:focus:ring-sky-500/50 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher, Filter Toggle & Sort */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between md:justify-end">
          {/* View Mode Segmented Switcher */}
          <div className="flex items-center bg-stone-200/70 dark:bg-stone-800/80 p-0.5 rounded-md text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-2xs'
                  : 'hover:text-stone-950'
              }`}
              title="Tactile Cover Grid"
              aria-label="Tactile Cover Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('shelf')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'shelf'
                  ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-2xs'
                  : 'hover:text-stone-950'
              }`}
              title="Detailed Shelf View"
              aria-label="Detailed Shelf View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-2xs'
                  : 'hover:text-stone-950'
              }`}
              title="Archival Index List"
              aria-label="Archival Index List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Advanced Filter Disclosure Button */}
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border rounded-md transition-colors cursor-pointer ${
              expandedFilters || durationFilter !== 'all' || eraFilter !== 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Refine</span>
            {(durationFilter !== 'all' || eraFilter !== 'all') && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-0.5" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-medium text-stone-700 dark:text-stone-300 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="featured">Curated & Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Publication Year</option>
              <option value="pages">Extent (Pages)</option>
              <option value="title">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Active Filter Clear */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Drawer: Era & Duration filters */}
      {expandedFilters && (
        <div className="p-4 rounded-lg bg-stone-100/90 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-fadeIn">
          {/* Era Filter */}
          <div>
            <span className="block font-medium text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Chronological Era
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Eras' },
                { id: 'classical', label: 'Classic (<1950)' },
                { id: 'modern', label: '20th Century' },
                { id: 'contemporary', label: 'Contemporary (2015+)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setEraFilter(item.id as EraFilter)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    eraFilter === item.id
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <span className="block font-medium text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Reading Duration
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Any Extent' },
                { id: 'short', label: 'Brief (<5 hrs)' },
                { id: 'medium', label: 'Standard (5–10 hrs)' },
                { id: 'long', label: 'Epic (>10 hrs)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDurationFilter(item.id as DurationFilter)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    durationFilter === item.id
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Count & Page Size */}
          <div>
            <span className="block font-medium text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Display per Page
            </span>
            <div className="flex items-center gap-1.5">
              {[16, 24, 48, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] font-medium transition-colors ${
                    pageSize === size
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Segmented Category Buttons (Single-line interactive filter controls) */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Total Results Count */}
        <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums whitespace-nowrap hidden sm:inline-block">
          {totalResults} {totalResults === 1 ? 'volume' : 'volumes'} indexed
        </span>
      </div>
    </div>
  );
};
