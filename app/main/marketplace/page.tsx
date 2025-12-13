// app/(main)/marketplace/page.tsx
'use client';

import { useState } from 'react';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';
import { Navbar } from '@/components/marketplace/Navbar';
import { FiltersSidebar } from '@/components/marketplace/FiltersSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { CategoryTabs } from '@/components/marketplace/CategoryTabs';
import { Filter } from 'lucide-react';

// Mock Products Data (extended)
const products = [
  {
    id: 1,
    name: 'Vintage Leather Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    seller: 'fashionista_jane',
    category: 'Clothes',
    type: 'Resale',
    price: 2500
  },
  {
    id: 2,
    name: 'Harry Potter Book Set',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    seller: 'bookworm_ken',
    category: 'Books',
    type: 'Donation',
    price: 0
  },
  {
    id: 3,
    name: 'iPhone 12 Pro',
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&h=500&fit=crop',
    seller: 'tech_trader',
    category: 'Electronics',
    type: 'Resale',
    price: 45000
  },
  {
    id: 4,
    name: 'Nike Air Max Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    seller: 'sneaker_head',
    category: 'Shoes',
    type: 'Resale',
    price: 3500
  },
  {
    id: 5,
    name: 'Wooden Study Desk',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop',
    seller: 'home_declutter',
    category: 'Furniture',
    type: 'Resale',
    price: 8000
  },
  {
    id: 6,
    name: 'Summer Dresses Bundle',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
    seller: 'closet_clear',
    category: 'Clothes',
    type: 'Donation',
    price: 0
  },
  {
    id: 7,
    name: 'Business Books Collection',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
    seller: 'student_seller',
    category: 'Books',
    type: 'Resale',
    price: 1200
  },
  {
    id: 8,
    name: 'Samsung Galaxy Watch',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    seller: 'gadget_guru',
    category: 'Electronics',
    type: 'Resale',
    price: 15000
  },
  {
    id: 9,
    name: 'Leather Office Chair',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&h=500&fit=crop',
    seller: 'office_clear',
    category: 'Furniture',
    type: 'Resale',
    price: 12000
  },
  {
    id: 10,
    name: 'Adidas Running Shoes',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    seller: 'fitness_fan',
    category: 'Shoes',
    type: 'Donation',
    price: 0
  },
  {
    id: 11,
    name: 'MacBook Pro 13"',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    seller: 'tech_upgrade',
    category: 'Electronics',
    type: 'Resale',
    price: 75000
  },
  {
    id: 12,
    name: 'Winter Coat',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop',
    seller: 'wardrobe_refresh',
    category: 'Clothes',
    type: 'Resale',
    price: 4500
  },
  {
    id: 13,
    name: 'Designer Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    seller: 'style_curator',
    category: 'Accessories',
    type: 'Resale',
    price: 3200
  },
  {
    id: 14,
    name: 'Smart Watch Series 6',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    seller: 'tech_wizard',
    category: 'Electronics',
    type: 'Resale',
    price: 28000
  },
  {
    id: 15,
    name: 'Coffee Table',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    seller: 'home_maker',
    category: 'Furniture',
    type: 'Donation',
    price: 0
  },
  {
    id: 16,
    name: 'Designer Handbag',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop',
    seller: 'luxury_lover',
    category: 'Accessories',
    type: 'Resale',
    price: 15000
  },
  {
    id: 17,
    name: 'Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    seller: 'sports_enthusiast',
    category: 'Shoes',
    type: 'Resale',
    price: 4200
  },
  {
    id: 18,
    name: 'Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    seller: 'audio_phile',
    category: 'Electronics',
    type: 'Resale',
    price: 5500
  }
];

const categories = ['All Products', 'Books', 'Electronics', 'Shoes', 'Clothes', 'Furniture', 'Accessories'];
const filterTypes = ['All', 'Resale Only', 'Donation Only'];

export default function MarketplacePage() {
  // State
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesFilter = selectedFilter === 'All' || 
                         (selectedFilter === 'Resale Only' && product.type === 'Resale') ||
                         (selectedFilter === 'Donation Only' && product.type === 'Donation');
    const matchesPrice = (!priceRange.max || product.price <= priceRange.max) && 
                        product.price >= priceRange.min;
    const matchesSearch = searchQuery === '' || 
                         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFilter && matchesPrice && matchesSearch;
  });

  // Handlers
  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Infinite Scrolling Top Bar */}
      <InfiniteMarquee />

      {/* Navbar */}
      <Navbar cartCount={cart.length} onSearch={handleSearch} />

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-red-700 transition-colors"
      >
        <Filter className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FiltersSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filterTypes={filterTypes}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isMobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} Products Found
              </h2>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">😕</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}