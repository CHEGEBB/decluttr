/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ShoppingCart, Filter, ChevronDown } from 'lucide-react';

interface ShopHeaderProps {
  showSpecificCategory: boolean;
  selectedCategory: string;
  filteredCategories: Record<string, any[]>;
  searchQuery: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  selectedConditions: string[];
  toggleCondition: (condition: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  cartCount: number;
}

const ShopHeader = ({
  showSpecificCategory,
  selectedCategory,
  filteredCategories,
  searchQuery,
  showFilters,
  setShowFilters,
  selectedSort,
  setSelectedSort,
  selectedConditions,
  toggleCondition,
  priceRange,
  setPriceRange,
  setSelectedCategory,
  resetFilters,
  cartCount
}: ShopHeaderProps) => {
  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'popular', name: 'Most Popular' }
  ];

  return (
    <>
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2">Shop Products</h1>
              <p className="text-gray-300 text-sm md:text-base">Discover amazing pre-loved items at great prices</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 md:px-6 md:py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm md:text-base">
                Sell Item
              </button>
              <div className="relative">
                <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px]  mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Header with Controls */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {showSpecificCategory 
                      ? `${filteredCategories[selectedCategory]?.length || 0} Products in ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                      : 'All Categories'}
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-600 mt-1 text-sm">
                      Showing results for &quot;{searchQuery}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter Toggle (Mobile) */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Filter className="w-4 h-4 md:w-5 md:h-5" />
                    Filters
                  </button>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="pl-3 pr-8 py-2 text-gray-500 placeholder:text-gray-500 md:pl-4 md:pr-10 md:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 appearance-none text-sm md:text-base"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          Sort: {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {showSpecificCategory && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 text-sm">×</button>
                  </span>
                )}
                {selectedConditions.map((condition) => (
                  <span key={condition} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    {condition}
                    <button onClick={() => toggleCondition(condition)} className="ml-1 text-sm">×</button>
                  </span>
                ))}
                {(priceRange.min > 0 || priceRange.max < 200000) && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    KSh {priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()}
                    <button onClick={() => setPriceRange({ min: 0, max: 200000 })} className="ml-1 text-sm">×</button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopHeader;