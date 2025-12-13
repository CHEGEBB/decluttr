// components/marketplace/FiltersSidebar.tsx
'use client';

import { Filter, X } from 'lucide-react';
import { useState } from 'react';

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
  onMobileClose
}: FiltersSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = {
      ...localPriceRange,
      [type]: numValue
    };
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

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
        fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-64 bg-white border-r lg:border-r-0 border-gray-200 
        shadow-lg lg:shadow-none z-50 lg:z-auto transition-transform duration-300 ease-in-out
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button onClick={onMobileClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {/* Desktop Title */}
          <div className="hidden lg:flex items-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-50 text-red-700 font-semibold border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Listing Type Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">Listing Type</h4>
            <div className="space-y-3">
              {filterTypes.map((filter) => (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedFilter === filter
                      ? 'bg-gray-900 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">Price Range (KSh)</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={localPriceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={localPriceRange.max || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Condition</h4>
            <div className="space-y-2">
              {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
                <label key={condition} className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-3 w-4 h-4 text-red-600 rounded" />
                  <span className="text-gray-600">{condition}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}