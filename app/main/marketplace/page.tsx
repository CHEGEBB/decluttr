/* eslint-disable @typescript-eslint/no-explicit-any */
// Update your useProducts hook or use this approach in the component
'use client';

import { useState, useEffect } from 'react';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';
import { Navbar } from '@/components/marketplace/Navbar';
import { FiltersSidebar } from '@/components/marketplace/FiltersSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { CategoryTabs } from '@/components/marketplace/CategoryTabs';
import { Filter } from 'lucide-react';
import Footer from '@/components/footer';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilters, Product } from '@/services/productService';

const categories = ['All Products', 'Electronics', 'Clothes', 'Shoes', 'Accessories', 'Furniture', 'Books', 'Sports', 'Home', 'Entertainment'];
const filterTypes = ['All', 'Resale Only', 'Donation Only'];
const PRODUCTS_PER_PAGE = 12;

export default function MarketplacePage() {
  // State
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Use the products hook
  const { 
    products, 
    isLoading, 
    error, 
    getProducts, 
    searchProducts,
    getProductsByCategory,
    totalPages
  } = useProducts();

  // Update allProducts when products change
  useEffect(() => {
    if (currentPage === 1) {
      // Reset all products on new search/filter
      setAllProducts(products);
    } else {
      // Append new products when loading more
      const newProductIds = products.map(p => p.id);
      const existingProductIds = allProducts.map(p => p.id);
      const uniqueNewProducts = products.filter(p => !existingProductIds.includes(p.id));
      setAllProducts(prev => [...prev, ...uniqueNewProducts]);
    }
  }, [products]);

  // Update hasMore based on totalPages
  useEffect(() => {
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  // Initial fetch on component mount
  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1);
  }, []);

  // Load products based on filters
  const loadProducts = async (page: number = 1, append: boolean = false) => {
    try {
      const filters: ProductFilters = {
        category: selectedCategory !== 'All Products' ? selectedCategory : undefined,
        listingType: selectedFilter !== 'All' ? 
          (selectedFilter === 'Resale Only' ? 'resale' : 'donation') : 
          undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sortBy: getSortField(sortBy),
        sortOrder: getSortOrder(sortBy),
        page: page,
        limit: PRODUCTS_PER_PAGE
      };

      if (!append) {
        // Clear products if not appending
        setAllProducts([]);
      }

      if (searchQuery.trim()) {
        await searchProducts(searchQuery, filters);
      } else if (selectedCategory !== 'All Products') {
        await getProductsByCategory(selectedCategory, filters);
      } else {
        await getProducts(filters);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setLoadingMore(false);
    }
  };

  // Helper function to map UI sort to API sort
  const getSortField = (sort: string): string => {
    switch (sort) {
      case 'price-low':
      case 'price-high':
        return 'price';
      case 'rating':
        return 'rating';
      default:
        return 'createdAt';
    }
  };

  const getSortOrder = (sort: string): string => {
    switch (sort) {
      case 'price-low':
        return 'asc';
      case 'price-high':
        return 'desc';
      case 'rating':
        return 'desc';
      default:
        return 'desc';
    }
  };

  // Reload products when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
    loadProducts(1);
  }, [selectedCategory, selectedFilter, priceRange, sortBy]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setAllProducts([]);
    try {
      const filters: ProductFilters = {
        category: selectedCategory !== 'All Products' ? selectedCategory : undefined,
        listingType: selectedFilter !== 'All' ? 
          (selectedFilter === 'Resale Only' ? 'resale' : 'donation') : 
          undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sortBy: getSortField(sortBy),
        sortOrder: getSortOrder(sortBy),
        page: 1,
        limit: PRODUCTS_PER_PAGE
      };

      if (query.trim()) {
        await searchProducts(query, filters);
      } else {
        await getProducts(filters);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    }
  };

  // Handle Load More
  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    setCurrentPage(nextPage);
    
    try {
      await loadProducts(nextPage, true);
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Transform API product to match ProductCard props
  const transformProductForCard = (product: Product) => ({
    id: product.id,
    name: product.name,
    image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    seller: product.seller?.username || product.seller?.name || 'Unknown Seller',
    category: product.category,
    type: product.listingType === 'resale' ? 'Resale' : 'Donation',
    price: product.price || 0,
    rating: product.seller?.ratings || product.rating || 4.5,
    condition: product.condition || 'Good',
    location: product.location || product.seller?.location || 'Nairobi'
  });

  // Handlers
  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
  };

  // Check if should show load more button
  const showLoadMore = !isLoading && !error && allProducts.length > 0 && hasMore && !loadingMore;

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
                  {isLoading && currentPage === 1 ? 'Loading...' : `${allProducts.length} Products Found`}
                </h2>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 text-gray-500 placeholder:text-gray-500 rounded-lg focus:outline-none focus:border-red-500 bg-white"
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

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => loadProducts(1)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State for initial load */}
            {isLoading && currentPage === 1 && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && allProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSelectedFilter('All');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              (allProducts.length > 0 || currentPage > 1) && !error && (
                <>
                  {/* Grid Layout - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {allProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={transformProductForCard(product)}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {showLoadMore && (
                    <div className="mt-12 text-center">
                      <button 
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                            Loading More...
                          </span>
                        ) : (
                          `Load More (${allProducts.length} shown)`
                        )}
                      </button>
                    </div>
                  )}

                  {/* End of Results Message */}
                  {!hasMore && allProducts.length > 0 && (
                    <div className="mt-12 text-center py-4">
                      <p className="text-gray-600 font-medium">
                        🎉 You&apos;ve reached the end! Showing all {allProducts.length} products.
                      </p>
                    </div>
                  )}

                  {/* Loading More Spinner */}
                  {loadingMore && (
                    <div className="mt-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading more products...</p>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
      <Footer/>

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