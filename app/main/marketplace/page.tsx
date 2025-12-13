/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';
import { Navbar } from '@/components/marketplace/Navbar';
import { FiltersSidebar } from '@/components/marketplace/FiltersSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { CategoryTabs } from '@/components/marketplace/CategoryTabs';
import { Filter } from 'lucide-react';

// Extended Mock Products Data (48 items)
const products = [
  {
    id: 1,
    name: 'Vintage Leather Jacket Premium',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    seller: 'fashionista_jane',
    category: 'Clothes',
    type: 'Resale',
    price: 12500,
    rating: 4.8,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 2,
    name: 'Harry Potter Complete Book Set (7 Books)',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
    seller: 'bookworm_ken',
    category: 'Books',
    type: 'Donation',
    price: 0,
    rating: 4.9,
    condition: 'Like New',
    location: 'Mombasa'
  },
  {
    id: 3,
    name: 'iPhone 12 Pro 256GB',
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop',
    seller: 'tech_trader',
    category: 'Electronics',
    type: 'Resale',
    price: 85000,
    rating: 4.7,
    condition: 'Good',
    location: 'Nairobi'
  },
  {
    id: 4,
    name: 'Nike Air Max 270 React',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    seller: 'sneaker_head',
    category: 'Shoes',
    type: 'Resale',
    price: 13500,
    rating: 4.6,
    condition: 'New',
    location: 'Kisumu'
  },
  {
    id: 5,
    name: 'Modern Wooden Study Desk',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop',
    seller: 'home_declutter',
    category: 'Furniture',
    type: 'Resale',
    price: 28000,
    rating: 4.8,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 6,
    name: 'Summer Dresses Bundle (5 Pieces)',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
    seller: 'closet_clear',
    category: 'Clothes',
    type: 'Donation',
    price: 0,
    rating: 4.5,
    condition: 'Good',
    location: 'Nakuru'
  },
  {
    id: 7,
    name: 'Business Books Collection',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
    seller: 'student_seller',
    category: 'Books',
    type: 'Resale',
    price: 4200,
    rating: 4.3,
    condition: 'Fair',
    location: 'Eldoret'
  },
  {
    id: 8,
    name: 'Samsung Galaxy Watch 5 Pro',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
    seller: 'gadget_guru',
    category: 'Electronics',
    type: 'Resale',
    price: 35000,
    rating: 4.9,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 9,
    name: 'Ergonomic Leather Office Chair',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&h=800&fit=crop',
    seller: 'office_clear',
    category: 'Furniture',
    type: 'Resale',
    price: 42000,
    rating: 4.7,
    condition: 'Excellent',
    location: 'Mombasa'
  },
  {
    id: 10,
    name: 'Adidas Ultraboost 22 Running Shoes',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    seller: 'fitness_fan',
    category: 'Shoes',
    type: 'Donation',
    price: 0,
    rating: 4.6,
    condition: 'Good',
    location: 'Nairobi'
  },
  {
    id: 11,
    name: 'MacBook Pro 13" M2 2023',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    seller: 'tech_upgrade',
    category: 'Electronics',
    type: 'Resale',
    price: 175000,
    rating: 4.9,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 12,
    name: 'Premium Winter Coat',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop',
    seller: 'wardrobe_refresh',
    category: 'Clothes',
    type: 'Resale',
    price: 14500,
    rating: 4.4,
    condition: 'Excellent',
    location: 'Kisumu'
  },
  {
    id: 13,
    name: 'Ray-Ban Aviator Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    seller: 'style_curator',
    category: 'Accessories',
    type: 'Resale',
    price: 15200,
    rating: 4.8,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 14,
    name: 'Apple Watch Series 9',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    seller: 'tech_wizard',
    category: 'Electronics',
    type: 'Resale',
    price: 68000,
    rating: 4.9,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 15,
    name: 'Modern Glass Coffee Table',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    seller: 'home_maker',
    category: 'Furniture',
    type: 'Donation',
    price: 0,
    rating: 4.5,
    condition: 'Good',
    location: 'Nakuru'
  },
  {
    id: 16,
    name: 'Gucci GG Marmont Handbag',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
    seller: 'luxury_lover',
    category: 'Accessories',
    type: 'Resale',
    price: 85000,
    rating: 4.9,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 17,
    name: 'Nike React Infinity Run Flyknit 3',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    seller: 'sports_enthusiast',
    category: 'Shoes',
    type: 'Resale',
    price: 18200,
    rating: 4.7,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 18,
    name: 'JBL PartyBox 310 Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
    seller: 'audio_phile',
    category: 'Electronics',
    type: 'Resale',
    price: 25500,
    rating: 4.6,
    condition: 'Like New',
    location: 'Mombasa'
  },
  {
    id: 19,
    name: 'Casio G-Shock Digital Watch',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
    seller: 'watch_collector',
    category: 'Accessories',
    type: 'Resale',
    price: 8500,
    rating: 4.4,
    condition: 'Good',
    location: 'Eldoret'
  },
  {
    id: 20,
    name: 'Designer Leather Wallet',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop',
    seller: 'accessory_king',
    category: 'Accessories',
    type: 'Donation',
    price: 0,
    rating: 4.2,
    condition: 'Fair',
    location: 'Kisumu'
  },
  {
    id: 21,
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    seller: 'audio_expert',
    category: 'Electronics',
    type: 'Resale',
    price: 45000,
    rating: 4.9,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 22,
    name: 'Linen Shirt Collection',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop',
    seller: 'fashion_forward',
    category: 'Clothes',
    type: 'Resale',
    price: 7800,
    rating: 4.5,
    condition: 'Good',
    location: 'Nairobi'
  },
  {
    id: 23,
    name: 'Samsung Galaxy S23 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
    seller: 'mobile_king',
    category: 'Electronics',
    type: 'Resale',
    price: 125000,
    rating: 4.9,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 24,
    name: 'Leather Boots Collection',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    seller: 'boot_lover',
    category: 'Shoes',
    type: 'Resale',
    price: 21500,
    rating: 4.6,
    condition: 'Excellent',
    location: 'Mombasa'
  },
  // Additional 24 items to reach 48
  {
    id: 25,
    name: 'Digital Camera Canon EOS R5',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
    seller: 'photography_geek',
    category: 'Electronics',
    type: 'Resale',
    price: 285000,
    rating: 4.9,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 26,
    name: 'Designer Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    seller: 'travel_buddy',
    category: 'Accessories',
    type: 'Resale',
    price: 18500,
    rating: 4.7,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 27,
    name: 'Gaming Laptop ASUS ROG',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop',
    seller: 'gamer_pro',
    category: 'Electronics',
    type: 'Resale',
    price: 195000,
    rating: 4.8,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 28,
    name: 'Classic Novels Collection',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&h=800&fit=crop',
    seller: 'book_collector',
    category: 'Books',
    type: 'Donation',
    price: 0,
    rating: 4.6,
    condition: 'Good',
    location: 'Nakuru'
  },
  {
    id: 29,
    name: 'Standing Desk Adjustable',
    image: 'https://images.unsplash.com/photo-1531416738519-cf1b25c203cc?w=800&h=800&fit=crop',
    seller: 'work_from_home',
    category: 'Furniture',
    type: 'Resale',
    price: 52000,
    rating: 4.8,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 30,
    name: 'Yoga Mat Premium',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=800&fit=crop',
    seller: 'fitness_guru',
    category: 'Sports',
    type: 'Resale',
    price: 4500,
    rating: 4.4,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 31,
    name: 'Smart TV 55" Samsung',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    seller: 'tech_upgrader',
    category: 'Electronics',
    type: 'Resale',
    price: 125000,
    rating: 4.7,
    condition: 'Like New',
    location: 'Mombasa'
  },
  {
    id: 32,
    name: 'Dinnerware Set 12 Pieces',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop',
    seller: 'home_essentials',
    category: 'Home',
    type: 'Donation',
    price: 0,
    rating: 4.3,
    condition: 'Good',
    location: 'Kisumu'
  },
  {
    id: 33,
    name: 'Mountain Bike Trek',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800&fit=crop',
    seller: 'bike_enthusiast',
    category: 'Sports',
    type: 'Resale',
    price: 85000,
    rating: 4.8,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 34,
    name: 'Cookbook Collection',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
    seller: 'chef_at_home',
    category: 'Books',
    type: 'Resale',
    price: 6800,
    rating: 4.5,
    condition: 'Good',
    location: 'Nairobi'
  },
  {
    id: 35,
    name: 'Blender Professional',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    seller: 'kitchen_gear',
    category: 'Home',
    type: 'Resale',
    price: 12500,
    rating: 4.6,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 36,
    name: 'Gaming Console PS5',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
    seller: 'game_master',
    category: 'Electronics',
    type: 'Resale',
    price: 95000,
    rating: 4.9,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 37,
    name: 'Designer Jeans Collection',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    seller: 'denim_lover',
    category: 'Clothes',
    type: 'Resale',
    price: 14500,
    rating: 4.7,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 38,
    name: 'Coffee Machine Deluxe',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
    seller: 'coffee_addict',
    category: 'Home',
    type: 'Resale',
    price: 32500,
    rating: 4.8,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 39,
    name: 'Tennis Racket Professional',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=800&fit=crop',
    seller: 'sports_pro',
    category: 'Sports',
    type: 'Resale',
    price: 18500,
    rating: 4.6,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 40,
    name: 'Board Games Collection',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=800&fit=crop',
    seller: 'family_fun',
    category: 'Entertainment',
    type: 'Donation',
    price: 0,
    rating: 4.4,
    condition: 'Good',
    location: 'Nakuru'
  },
  {
    id: 41,
    name: 'Digital Piano Yamaha',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    seller: 'music_lover',
    category: 'Entertainment',
    type: 'Resale',
    price: 125000,
    rating: 4.9,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 42,
    name: 'Fitness Tracker Band',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&h=800&fit=crop',
    seller: 'health_monitor',
    category: 'Electronics',
    type: 'Resale',
    price: 8500,
    rating: 4.5,
    condition: 'Good',
    location: 'Nairobi'
  },
  {
    id: 43,
    name: 'Art Supplies Collection',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
    seller: 'creative_soul',
    category: 'Arts',
    type: 'Donation',
    price: 0,
    rating: 4.3,
    condition: 'Fair',
    location: 'Kisumu'
  },
  {
    id: 44,
    name: 'Camping Tent 4 Person',
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&h=800&fit=crop',
    seller: 'outdoor_adventurer',
    category: 'Sports',
    type: 'Resale',
    price: 28500,
    rating: 4.7,
    condition: 'Excellent',
    location: 'Nairobi'
  },
  {
    id: 45,
    name: 'Designer Watch Rolex',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop',
    seller: 'watch_expert',
    category: 'Accessories',
    type: 'Resale',
    price: 985000,
    rating: 5.0,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 46,
    name: 'Kitchen Knife Set',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
    seller: 'cooking_pro',
    category: 'Home',
    type: 'Resale',
    price: 18500,
    rating: 4.8,
    condition: 'New',
    location: 'Nairobi'
  },
  {
    id: 47,
    name: 'Sofa Bed Convertible',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    seller: 'home_furnisher',
    category: 'Furniture',
    type: 'Resale',
    price: 125000,
    rating: 4.6,
    condition: 'Like New',
    location: 'Nairobi'
  },
  {
    id: 48,
    name: 'Laptop Bag Premium',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    seller: 'business_traveler',
    category: 'Accessories',
    type: 'Resale',
    price: 12500,
    rating: 4.7,
    condition: 'Excellent',
    location: 'Nairobi'
  }
];

const categories = ['All Products', 'Electronics', 'Clothes', 'Shoes', 'Accessories', 'Furniture', 'Books', 'Sports', 'Home', 'Entertainment'];
const filterTypes = ['All', 'Resale Only', 'Donation Only'];

export default function MarketplacePage() {
  // State
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

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
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFilter && matchesPrice && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  // Handlers
  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Infinite Scrolling Top Bar */}
      <InfiniteMarquee />

      {/* Navbar */}
      <Navbar cartCount={cart.length} onSearch={handleSearch} />

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full shadow-xl flex items-center justify-center z-30 hover:bg-red-700 transition-all hover:scale-110"
      >
        <Filter className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Fixed on desktop */}
          <div className="lg:w-64 flex-shrink-0">
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
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header with Category Tabs and Sort */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sortedProducts.length} Products Found
                </h2>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Category Tabs */}
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              {searchQuery && (
                <p className="text-gray-600 mt-4">
                  Showing results for &quot;<span className="font-semibold">{searchQuery}</span>&quot;
                </p>
              )}
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSelectedFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid Layout - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {sortedProducts.length > 12 && (
                  <div className="mt-12 text-center">
                    <button className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
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
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}