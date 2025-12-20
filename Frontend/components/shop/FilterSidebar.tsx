'use client';

import { 
  Package, 
  Smartphone, 
  Shirt, 
  Footprints, 
  Sofa, 
  BookOpen, 
  Glasses,
  Shield,
  Truck,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedConditions: string[];
  onConditionToggle: (condition: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onResetFilters: () => void;
}

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  onCategoryChange, 
  selectedConditions, 
  onConditionToggle, 
  priceRange, 
  onPriceRangeChange,
  onResetFilters 
}: FilterSidebarProps) => {
  const categories = [
    { id: 'all', name: 'All Products', icon: Package, count: 72 },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, count: 18 },
    { id: 'clothes', name: 'Clothes', icon: Shirt, count: 24 },
    { id: 'shoes', name: 'Shoes', icon: Footprints, count: 12 },
    { id: 'furniture', name: 'Furniture', icon: Sofa, count: 9 },
    { id: 'books', name: 'Books', icon: BookOpen, count: 15 },
    { id: 'accessories', name: 'Accessories', icon: Glasses, count: 8 }
  ];

  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 h-full lg:h-[calc(100vh-6rem)] 
        w-80 lg:w-72 xl:w-80
        bg-white rounded-r-2xl lg:rounded-2xl shadow-2xl lg:shadow-lg 
        border border-gray-200 p-6 z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:top-24
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
            Categories
          </h3>
          <div className="space-y-1.5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Price Range</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min (KSh)</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({...priceRange, min: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max (KSh)</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({...priceRange, max: parseInt(e.target.value) || 200000})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  min="0"
                />
              </div>
            </div>
            <div className="pt-1">
              <div className="text-xs text-gray-600">
                KSh {priceRange.min.toLocaleString()} - KSh {priceRange.max.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Condition</h3>
          <div className="space-y-1.5">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => onConditionToggle(condition)}
                  className="mr-2 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 focus:ring-1"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {condition}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all mb-6 text-sm"
        >
          Reset All Filters
        </button>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Shopping Benefits</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Free Shipping over KSh 5,000</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600">14-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-gray-600">Quality Verified</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;