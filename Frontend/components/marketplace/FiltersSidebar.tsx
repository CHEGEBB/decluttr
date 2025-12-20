/* eslint-disable react-hooks/purity */
'use client';

import { Filter, X, Sliders, Tag, DollarSign, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FiltersSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filterTypes: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  priceRange: { min: number; max: number };
  onPriceChange: (range: { min: number; max: number }) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FiltersSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  filterTypes,
  selectedFilter,
  onFilterChange,
  priceRange,
  onPriceChange,
  isMobileOpen,
  onMobileClose,
  sortBy,
  onSortChange
}: FiltersSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = {
      ...localPriceRange,
      [type]: numValue
    };
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const resetFilters = () => {
    setLocalPriceRange({ min: 0, max: 1000000 });
    onPriceChange({ min: 0, max: 1000000 });
    setSelectedConditions([]);
    setSelectedRatings([]);
    onCategoryChange('All Products');
    onFilterChange('All');
    onSortChange('featured');
  };

  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];
  const ratings = [5, 4, 3];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Filters Sidebar */}
      <aside className={`
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:sticky top-0 left-0 h-full lg:h-[calc(100vh-4rem)] w-80 lg:w-64 xl:w-72 bg-white border-r lg:border border-gray-200 
        shadow-2xl lg:shadow-lg z-50 lg:z-30 transition-transform duration-300 ease-in-out lg:top-24
        overflow-y-auto scrollbar-thin
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b lg:hidden bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          </div>
          <button onClick={onMobileClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Desktop Title */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            </div>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Sort Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Sort By
            </h4>
            <div className="space-y-2">
              {[
                { value: 'featured', label: 'Featured' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'newest', label: 'Newest First' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    sortBy === option.value
                      ? 'bg-red-50 text-red-700 font-semibold border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all group ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {selectedCategory === category && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Listing Type Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Listing Type
            </h4>
            <div className="space-y-3">
              {filterTypes.map((filter) => (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedFilter === filter
                      ? 'bg-gray-900 text-white font-semibold shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Range (KSh)
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">Min</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">KSh</span>
                    <input
                      type="number"
                      value={localPriceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 text-gray-500 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">Max</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">KSh</span>
                    <input
                      type="number"
                      value={localPriceRange.max || ''}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 border text-gray-500 placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="1,000,000"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <div className="text-sm text-gray-600 mb-2">
                  Selected: KSh {localPriceRange.min.toLocaleString()} - KSh {localPriceRange.max.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Condition Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">Condition</h4>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedConditions.includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                    className="mr-3 w-5 h-5 text-red-600 rounded text-gray-500 placeholder:text-gray-500 border-gray-300 focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    {condition}
                  </span>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {['New', 'Like New', 'Excellent', 'Good', 'Fair'].indexOf(condition) * 10 + 15}
                </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Minimum Rating
            </h4>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingToggle(rating)}
                    className="mr-3 w-5 h-5 text-red-600 text-gray-500 placeholder:text-gray-500 rounded border-gray-300 focus:ring-red-500 focus:ring-2"
                  />
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900">
                      {rating}+ Stars
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Filters</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Free Shipping', color: 'bg-blue-100 text-blue-700' },
                { label: 'Today Deals', color: 'bg-red-100 text-red-700' },
                { label: 'Verified Sellers', color: 'bg-green-100 text-green-700' },
                { label: 'Near Me', color: 'bg-purple-100 text-purple-700' }
              ].map((filter) => (
                <button
                  key={filter.label}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity ${filter.color}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
}