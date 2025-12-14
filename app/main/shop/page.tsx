/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Shirt, 
  Footprints, 
  Sofa, 
  BookOpen, 
  Glasses,
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Truck
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { 
  FilterSidebar, 
  CategorySection, 
  ShopHeader,
  WhyShopWithUs 
} from '@/components/shop';
import Link from 'next/link';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';

// Extended mock data with more products
const productsByCategory = {
  electronics: [
    {
      id: 1,
      name: 'Xiaomi 4K Ultra HD Action Camera',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
      seller: 'tech_gear',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 54900,
      originalPrice: 79900,
      condition: 'New',
      rating: 4.7,
      reviews: 89,
      location: 'Nairobi',
      delivery: 'KSh 200',
      tags: ['4K', 'Action', 'Camera']
    },
    {
      id: 2,
      name: 'iPhone 13 Pro 256GB',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop',
      seller: 'apple_lover',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 95000,
      originalPrice: 145000,
      condition: 'Like New',
      rating: 4.8,
      reviews: 124,
      location: 'Nairobi',
      delivery: 'Free',
      tags: ['iPhone', 'Apple', 'Premium']
    },
    {
      id: 3,
      name: 'MacBook Pro M1 2020',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      seller: 'tech_trader',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 120000,
      originalPrice: 180000,
      condition: 'Excellent',
      rating: 4.9,
      reviews: 67,
      location: 'Mombasa',
      delivery: 'KSh 500',
      tags: ['Laptop', 'Apple', 'MacBook']
    },
    {
      id: 4,
      name: 'Samsung QLED 4K TV 55"',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
      seller: 'home_ent',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 85000,
      originalPrice: 150000,
      condition: 'Good',
      rating: 4.5,
      reviews: 89,
      location: 'Nairobi',
      delivery: 'KSh 800',
      tags: ['TV', '4K', 'Smart TV']
    },
    {
      id: 5,
      name: 'Sony WH-1000XM4 Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      seller: 'audio_phile',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 25000,
      originalPrice: 45000,
      condition: 'Like New',
      rating: 4.8,
      reviews: 156,
      location: 'Kisumu',
      delivery: 'KSh 200',
      tags: ['Headphones', 'Wireless', 'Noise Cancelling']
    },
    {
      id: 6,
      name: 'DJI Mini 3 Pro Drone',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop',
      seller: 'drone_master',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 120000,
      originalPrice: 180000,
      condition: 'New',
      rating: 4.9,
      reviews: 78,
      location: 'Nairobi',
      delivery: 'Free',
      tags: ['Drone', 'Camera', '4K']
    },
    {
      id: 7,
      name: 'PlayStation 5 Digital Edition',
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=600&fit=crop',
      seller: 'gamer_ken',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 65000,
      originalPrice: 95000,
      condition: 'Excellent',
      rating: 4.7,
      reviews: 134,
      location: 'Nairobi',
      delivery: 'KSh 400',
      tags: ['Gaming', 'Console', 'PS5']
    },
    {
      id: 8,
      name: 'Apple Watch Series 8',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
      seller: 'watch_collector',
      category: 'Electronics',
      type: 'Resale' as const,
      price: 45000,
      originalPrice: 75000,
      condition: 'New',
      rating: 4.8,
      reviews: 89,
      location: 'Mombasa',
      delivery: 'Free',
      tags: ['Smartwatch', 'Apple', 'Fitness']
    }
  ],
  clothes: [
    {
      id: 9,
      name: 'Leather Jacket Black',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
      seller: 'fashion_jane',
      category: 'Clothes',
      type: 'Resale' as const,
      price: 12500,
      originalPrice: 25000,
      condition: 'Excellent',
      rating: 4.5,
      reviews: 78,
      location: 'Nairobi',
      delivery: 'KSh 150',
      tags: ['Jacket', 'Leather', 'Premium']
    },
    {
      id: 10,
      name: 'Designer Suit Set',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
      seller: 'formal_wear',
      category: 'Clothes',
      type: 'Resale' as const,
      price: 18000,
      originalPrice: 35000,
      condition: 'Like New',
      rating: 4.6,
      reviews: 45,
      location: 'Nairobi',
      delivery: 'KSh 250',
      tags: ['Suit', 'Formal', 'Designer']
    },
    {
      id: 11,
      name: 'Summer Dress Collection',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=600&fit=crop',
      seller: 'dress_boutique',
      category: 'Clothes',
      type: 'Resale' as const,
      price: 7500,
      originalPrice: 15000,
      condition: 'New',
      rating: 4.7,
      reviews: 112,
      location: 'Mombasa',
      delivery: 'KSh 100',
      tags: ['Dress', 'Summer', 'Collection']
    },
    {
      id: 12,
      name: 'Denim Jacket Blue',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
      seller: 'denim_lover',
      category: 'Clothes',
      type: 'Resale' as const,
      price: 8500,
      originalPrice: 12000,
      condition: 'Good',
      rating: 4.4,
      reviews: 67,
      location: 'Kisumu',
      delivery: 'KSh 150',
      tags: ['Jacket', 'Denim', 'Casual']
    }
  ],
  shoes: [
    {
      id: 13,
      name: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      seller: 'sneaker_head',
      category: 'Shoes',
      type: 'Resale' as const,
      price: 13500,
      originalPrice: 20000,
      condition: 'New',
      rating: 4.9,
      reviews: 89,
      location: 'Mombasa',
      delivery: 'KSh 200',
      tags: ['Nike', 'Sneakers', 'Limited']
    },
    {
      id: 14,
      name: 'Adidas Ultraboost 21',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
      seller: 'running_gear',
      category: 'Shoes',
      type: 'Resale' as const,
      price: 18000,
      originalPrice: 25000,
      condition: 'Like New',
      rating: 4.8,
      reviews: 124,
      location: 'Nairobi',
      delivery: 'Free',
      tags: ['Adidas', 'Running', 'Comfort']
    },
    {
      id: 15,
      name: 'Leather Formal Shoes',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
      seller: 'formal_footwear',
      category: 'Shoes',
      type: 'Resale' as const,
      price: 9500,
      originalPrice: 18000,
      condition: 'Excellent',
      rating: 4.6,
      reviews: 56,
      location: 'Nairobi',
      delivery: 'KSh 150',
      tags: ['Leather', 'Formal', 'Shoes']
    }
  ],
  furniture: [
    {
      id: 16,
      name: 'Modern Study Desk',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop',
      seller: 'home_declutter',
      category: 'Furniture',
      type: 'Resale' as const,
      price: 28000,
      originalPrice: 45000,
      condition: 'Excellent',
      rating: 4.7,
      reviews: 42,
      location: 'Nairobi',
      delivery: 'KSh 600',
      tags: ['Wooden', 'Study', 'Desk']
    },
    {
      id: 17,
      name: 'Leather Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      seller: 'furniture_kenya',
      category: 'Furniture',
      type: 'Resale' as const,
      price: 85000,
      originalPrice: 150000,
      condition: 'Good',
      rating: 4.5,
      reviews: 78,
      location: 'Nairobi',
      delivery: 'KSh 1200',
      tags: ['Sofa', 'Leather', 'Living Room']
    },
    {
      id: 18,
      name: 'King Size Bed Frame',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop',
      seller: 'bedroom_essentials',
      category: 'Furniture',
      type: 'Resale' as const,
      price: 45000,
      originalPrice: 75000,
      condition: 'Like New',
      rating: 4.8,
      reviews: 34,
      location: 'Mombasa',
      delivery: 'KSh 800',
      tags: ['Bed', 'King Size', 'Bedroom']
    }
  ],
  books: [
    {
      id: 19,
      name: 'Harry Potter Complete Collection',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
      seller: 'bookworm_ken',
      category: 'Books',
      type: 'Donation' as const,
      price: 0,
      condition: 'Good',
      rating: 4.6,
      reviews: 56,
      location: 'Kisumu',
      delivery: 'Free',
      tags: ['Harry Potter', 'Collection']
    },
    {
      id: 20,
      name: 'Rich Dad Poor Dad',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
      seller: 'finance_books',
      category: 'Books',
      type: 'Resale' as const,
      price: 1500,
      originalPrice: 3000,
      condition: 'Excellent',
      rating: 4.7,
      reviews: 89,
      location: 'Nairobi',
      delivery: 'KSh 50',
      tags: ['Finance', 'Self-help']
    },
    {
      id: 21,
      name: 'Computer Science Textbooks',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop',
      seller: 'student_seller',
      category: 'Books',
      type: 'Donation' as const,
      price: 0,
      condition: 'Fair',
      rating: 4.3,
      reviews: 23,
      location: 'Nairobi',
      delivery: 'Free',
      tags: ['Textbooks', 'Education']
    }
  ],
  accessories: [
    {
      id: 22,
      name: 'Designer Handbag',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
      seller: 'luxury_lover',
      category: 'Accessories',
      type: 'Resale' as const,
      price: 85000,
      originalPrice: 150000,
      condition: 'Excellent',
      rating: 4.8,
      reviews: 34,
      location: 'Nairobi',
      delivery: 'Free',
      tags: ['Designer', 'Handbag']
    },
    {
      id: 23,
      name: 'Ray-Ban Sunglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      seller: 'sunglass_store',
      category: 'Accessories',
      type: 'Resale' as const,
      price: 12500,
      originalPrice: 25000,
      condition: 'New',
      rating: 4.9,
      reviews: 67,
      location: 'Mombasa',
      delivery: 'KSh 150',
      tags: ['Sunglasses', 'Ray-Ban']
    },
    {
      id: 24,
      name: 'Silver Necklace Set',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      seller: 'jewelry_shop',
      category: 'Accessories',
      type: 'Resale' as const,
      price: 8500,
      originalPrice: 15000,
      condition: 'Like New',
      rating: 4.6,
      reviews: 45,
      location: 'Nairobi',
      delivery: 'KSh 100',
      tags: ['Jewelry', 'Necklace', 'Silver']
    }
  ]
};

// Category background images
const categoryBackgrounds = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
  clothes: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop',
  books: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&h=400&fit=crop'
};

// Product Card Component
function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.type === 'Donation' && (
            <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
              FREE
            </span>
          )}
          {product.originalPrice && (
            <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
              SALE
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Condition */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
            {product.category}
          </span>
          <span className="text-sm text-gray-600 font-medium">{product.condition}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-base font-semibold text-gray-700 ml-1.5">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>

        {/* Location & Delivery */}
        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{product.delivery}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between mb-4">
            <div>
              {product.type === 'Donation' ? (
                <div className="text-3xl font-black text-green-600">FREE</div>
              ) : (
                <>
                  <div className="text-3xl font-black text-gray-900">
                    KSh {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice && (
                    <div className="text-base text-gray-500 line-through mt-1">
                      KSh {product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <Link href={`/main/product/${product.id}`}>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Category Section Component with Background Image
function CategorySectionWithBg({ 
  category, 
  products, 
  favorites, 
  onToggleFavorite, 
  onAddToCart,
  icon: Icon,
  backgroundImage
}: any) {
  if (products.length === 0) return null;

  const categoryNames: Record<string, string> = {
    electronics: 'Electronics',
    clothes: 'Clothes',
    shoes: 'Shoes',
    furniture: 'Furniture',
    books: 'Books',
    accessories: 'Accessories'
  };

  return (
    <div className="mb-12">
      {/* Category Header with Background Image */}
      <div 
        className="relative rounded-2xl overflow-hidden mb-6 h-48"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">{categoryNames[category]}</h2>
              <p className="text-white/90 text-lg">{products.length} items available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [cartCount, setCartCount] = useState(3);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allProducts = Object.values(productsByCategory).flat();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const addToCart = (product: any) => {
    setCartCount(prev => prev + 1);
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const filterProducts = (products: any[]) => {
    return products.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
        return false;
      }
      
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      
      return true;
    });
  };

  const filteredCategories: Record<string, any[]> = {};
  Object.entries(productsByCategory).forEach(([category, products]) => {
    filteredCategories[category] = filterProducts(products);
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedConditions([]);
    setPriceRange({ min: 0, max: 200000 });
    setSearchQuery('');
  };

  const showSpecificCategory = selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              <InfiniteMarquee />

      <Navbar cartCount={cartCount} onSearch={handleSearch} />
      
      <ShopHeader
        showSpecificCategory={showSpecificCategory}
        selectedCategory={selectedCategory}
        filteredCategories={filteredCategories}
        searchQuery={searchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        selectedConditions={selectedConditions}
        toggleCondition={toggleCondition}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        setSelectedCategory={setSelectedCategory}
        resetFilters={resetFilters}
        cartCount={cartCount}
      />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Sidebar - Fixed positioning */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterSidebar
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedConditions={selectedConditions}
                onConditionToggle={toggleCondition}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onResetFilters={resetFilters}
              />
            </div>
          </div>

          {/* Products Content */}
          <div className="flex-1 min-w-0">
            {showSpecificCategory ? (
              filteredCategories[selectedCategory]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories[selectedCategory].map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )
            ) : (
              /* Show All Categories with Background Images */
              <>
                <CategorySectionWithBg
                  category="electronics"
                  products={filteredCategories.electronics}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={Smartphone}
                  backgroundImage={categoryBackgrounds.electronics}
                />
                
                <CategorySectionWithBg
                  category="clothes"
                  products={filteredCategories.clothes}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={Shirt}
                  backgroundImage={categoryBackgrounds.clothes}
                />
                
                <CategorySectionWithBg
                  category="shoes"
                  products={filteredCategories.shoes}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={Footprints}
                  backgroundImage={categoryBackgrounds.shoes}
                />
                
                <CategorySectionWithBg
                  category="furniture"
                  products={filteredCategories.furniture}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={Sofa}
                  backgroundImage={categoryBackgrounds.furniture}
                />
                
                <CategorySectionWithBg
                  category="books"
                  products={filteredCategories.books}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={BookOpen}
                  backgroundImage={categoryBackgrounds.books}
                />
                
                <CategorySectionWithBg
                  category="accessories"
                  products={filteredCategories.accessories}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  icon={Glasses}
                  backgroundImage={categoryBackgrounds.accessories}
                />
              </>
            )}

            {/* Exclusive Discounts Banner */}
            <div className="mt-12 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">Exclusive Discounts</h2>
                  <p className="text-xl opacity-90">SALE UP TO</p>
                  <div className="text-5xl md:text-6xl font-black mt-2">20% OFF</div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-base opacity-90 mb-4">Limited time offer • Ends soon</p>
                  <button className="px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}