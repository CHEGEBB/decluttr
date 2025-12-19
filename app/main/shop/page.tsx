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

// Define category type
type CategoryName = 
  | 'Electronics' 
  | 'Clothes' 
  | 'Shoes' 
  | 'Furniture' 
  | 'Books' 
  | 'Accessories' 
  | 'Home' 
  | 'Entertainment' 
  | 'Sports' 
  | 'Arts';

// Category background images and gradients
const categoryBackgrounds: Record<CategoryName, string> = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
  Clothes: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop',
  Shoes: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop',
  Furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop',
  Books: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop',
  Accessories: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&h=400&fit=crop',
  Home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=400&fit=crop',
  Entertainment: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=400&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop',
  Arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=400&fit=crop'
};

const categoryGradients: Record<CategoryName, string> = {
  Electronics: 'from-blue-900/90 via-blue-700/70 to-transparent',
  Clothes: 'from-pink-900/90 via-pink-700/70 to-transparent',
  Shoes: 'from-orange-900/90 via-orange-700/70 to-transparent',
  Furniture: 'from-amber-900/90 via-amber-700/70 to-transparent',
  Books: 'from-purple-900/90 via-purple-700/70 to-transparent',
  Accessories: 'from-rose-900/90 via-rose-700/70 to-transparent',
  Home: 'from-teal-900/90 via-teal-700/70 to-transparent',
  Entertainment: 'from-red-900/90 via-red-700/70 to-transparent',
  Sports: 'from-green-900/90 via-green-700/70 to-transparent',
  Arts: 'from-indigo-900/90 via-indigo-700/70 to-transparent'
};

const categoryIcons: Record<CategoryName, any> = {
  Electronics: Smartphone,
  Clothes: Shirt,
  Shoes: Footprints,
  Furniture: Sofa,
  Books: BookOpen,
  Accessories: Glasses,
  Home: Sofa,
  Entertainment: Smartphone,
  Sports: Footprints,
  Arts: BookOpen
};

// Helper function to check if a string is a valid CategoryName
function isCategoryName(category: string): category is CategoryName {
  return category in categoryBackgrounds;
}

// Product Card Component
function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }: any) {
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {(product.type === 'Donation' || product.listingType === 'donation') && (
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
          <span className="text-sm text-gray-500">({product.reviews || product.views || 0} reviews)</span>
        </div>

        {/* Location & Delivery */}
        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{product.delivery || 'Delivery Available'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between mb-4">
            <div>
              {(product.type === 'Donation' || product.listingType === 'donation') ? (
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
  backgroundImage,
  gradient
}: any) {
  if (products.length === 0) return null;

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
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`}></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">{category}</h2>
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
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/products?limit=1000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      const transformedProducts = data.data.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        images: product.images || [],
        seller: product.seller?.username || product.seller?.name || 'Unknown',
        category: product.category,
        type: product.listingType === 'donation' ? 'Donation' : 'Resale',
        listingType: product.listingType,
        price: product.price || 0,
        originalPrice: null,
        condition: product.condition || 'Good',
        rating: product.seller?.ratings || product.rating || 4.5,
        reviews: product.views || 0,
        location: product.location || product.seller?.location || 'Nairobi',
        delivery: product.listingType === 'donation' ? 'Free' : 'KSh 200',
        tags: product.tags || []
      }));

      const grouped = transformedProducts.reduce((acc: Record<string, any[]>, product: any) => {
        const cat = product.category.toLowerCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      }, {});

      setProductsByCategory(grouped);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <InfiniteMarquee />
        <Navbar cartCount={cartCount} onSearch={handleSearch} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

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
                {Object.entries(filteredCategories).map(([category, products]) => {
                  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                  
                  // Use type guard to check if categoryName is valid
                  const safeCategory = isCategoryName(categoryName) ? categoryName : 'Electronics';
                  
                  return (
                    <CategorySectionWithBg
                      key={category}
                      category={categoryName}
                      products={products}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={addToCart}
                      icon={categoryIcons[safeCategory]}
                      backgroundImage={categoryBackgrounds[safeCategory]}
                      gradient={categoryGradients[safeCategory]}
                    />
                  );
                })}
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