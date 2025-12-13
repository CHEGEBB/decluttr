// components/marketplace/CategoryTabs.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      // Update scroll buttons visibility after scroll
      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftScroll(scrollRef.current.scrollLeft > 0);
          setShowRightScroll(
            scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
          );
        }
      }, 300);
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons for Desktop */}
      {showLeftScroll && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center z-10 hover:border-red-600 hover:text-red-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      {showRightScroll && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center z-10 hover:border-red-600 hover:text-red-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Category Tabs */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
        onScroll={() => {
          if (scrollRef.current) {
            setShowLeftScroll(scrollRef.current.scrollLeft > 0);
            setShowRightScroll(
              scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
            );
          }
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === category
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}