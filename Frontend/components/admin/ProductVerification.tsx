/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  Filter,
  Search,
  Package,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  RefreshCw,
  Eye,
  X,
  Tag,
  ShoppingCart,
  ImageIcon
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { PendingProduct } from '@/services/adminService';
import Image from 'next/image';
import React from 'react';

const ProductVerification = () => {
  const { 
    pendingProducts,
    products,
    isLoading, 
    error, 
    getPendingProducts,
    getAllProducts,
    verifyProduct, 
    deleteProduct, 
    clearError 
  } = useAdmin();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPendingProducts();
    getAllProducts();
  }, [getPendingProducts, getAllProducts]);

  const handleVerifyProduct = async (productId: string, productName: string) => {
    if (!confirm(`Approve product: ${productName}?`)) {
      return;
    }

    setActionLoading(productId);
    try {
      await verifyProduct(productId);
      alert(`Product "${productName}" has been verified successfully`);
      await getPendingProducts();
      await getAllProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to verify product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Delete product: ${productName}? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(productId);
    try {
      await deleteProduct(productId);
      alert(`Product "${productName}" has been deleted successfully`);
      setShowModal(false);
      setSelectedProduct(null);
      await getPendingProducts();
      await getAllProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (product: PendingProduct) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Combine and deduplicate products
  const allProducts = React.useMemo(() => {
    const productMap = new Map();
    
    // Add all products to map (using _id as key to avoid duplicates)
    [...pendingProducts, ...products].forEach(product => {
      const id = product._id || product.id;
      if (!productMap.has(id)) {
        productMap.set(id, product);
      }
    });
    
    return Array.from(productMap.values());
  }, [pendingProducts, products]);

  const filters = [
    { 
      id: 'pending', 
      label: 'Pending Review', 
      count: allProducts.filter(p => !p.isVerified).length 
    },
    { 
      id: 'verified', 
      label: 'Verified', 
      count: allProducts.filter(p => p.isVerified).length 
    },
    { 
      id: 'all', 
      label: 'All Products', 
      count: allProducts.length 
    }
  ];
  
  const filteredProducts = allProducts.filter(product => {
    if (selectedFilter === 'pending' && product.isVerified) {
      return false;
    }
    if (selectedFilter === 'verified' && !product.isVerified) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.seller.name.toLowerCase().includes(query) ||
        product.seller.email.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (isLoading && pendingProducts.length === 0 && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
              Product Management
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Review, approve, and manage all product listings</p>
          </div>
          <button 
            onClick={() => {
              getPendingProducts();
              getAllProducts();
            }}
            disabled={isLoading}
            className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm md:text-base font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm md:text-base text-red-800 font-medium truncate">{error}</span>
            </div>
            <button 
              onClick={clearError} 
              className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg flex items-center gap-2 font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Filter className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                <span className={`text-xs px-1.5 md:px-2 py-0.5 rounded-full font-bold ${
                  selectedFilter === filter.id
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 md:p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product: PendingProduct) => (
              <div 
                key={product.id || product._id} 
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                {/* Product Image */}
                {product.images && product.images.length > 0 && (
                  <div className="relative h-48 md:h-56 bg-gray-100">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap shadow-lg ${
                        product.isVerified 
                          ? 'bg-green-600 text-white' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        {product.isVerified ? '✓ Verified' : '⏱ Pending'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Product Header */}
                <div className="p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-600 truncate">
                          {product.seller.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                  {/* Price */}
                  <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                    <span className="text-xs md:text-sm text-gray-600">Price</span>
                    <div className="font-bold text-sm md:text-lg text-blue-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                      KSh {product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Listing Type */}
                  {product.listingType && (
                    <div className="flex items-center justify-between p-2 md:p-3 bg-purple-50 rounded-lg">
                      <span className="text-xs md:text-sm text-gray-600">Type</span>
                      <span className="text-xs md:text-sm font-medium text-purple-700 capitalize">
                        {product.listingType}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs md:text-sm text-gray-600">Status</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900 capitalize">{product.status}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 pt-2">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>
                      {new Date(product.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span>View</span>
                  </button>
                  
                  {!product.isVerified && (
                    <button
                      onClick={() => handleVerifyProduct(product.id || product._id, product.name)}
                      disabled={actionLoading === (product.id || product._id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {actionLoading === (product.id || product._id) ? (
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      <span>Approve</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id || product._id, product.name)}
                    disabled={actionLoading === (product.id || product._id)}
                    className="px-3 py-2 bg-red-600 text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {actionLoading === (product.id || product._id) ? (
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No products'}
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'No products to display'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-sm md:text-base bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="p-4 md:p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">
          Product Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-bold text-amber-600 mb-1">
              <Clock className="w-4 h-4 md:w-6 md:h-6" />
              {pendingProducts.filter(p => !p.isVerified).length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Pending</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-bold text-green-600 mb-1">
              <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
              {allProducts.filter(p => p.isVerified).length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Verified</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-bold text-blue-600 mb-1">
              <Package className="w-4 h-4 md:w-6 md:h-6" />
              {allProducts.length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-bold text-purple-600 mb-1">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6" />
              {(allProducts.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Value</div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between z-10">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Product Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                    Product Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative h-40 md:h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">Product Name</div>
                  <div className="font-bold text-sm md:text-lg text-gray-900">{selectedProduct.name}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">Price</div>
                  <div className="font-bold text-sm md:text-lg text-green-600">KSh {selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-medium text-sm md:text-base text-gray-900">{selectedProduct.category}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600 mb-1">Status</div>
                  <div className="font-medium text-sm md:text-base text-gray-900 capitalize">{selectedProduct.status}</div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs md:text-sm font-semibold text-gray-700 mb-2">Description</div>
                <p className="text-sm md:text-base text-gray-600">{selectedProduct.description || 'No description provided'}</p>
              </div>

              {/* Seller Info */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h3 className="text-sm md:text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-600">Name</div>
                    <div className="text-sm md:text-base font-medium text-gray-900">{selectedProduct.seller.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Username</div>
                    <div className="text-sm md:text-base font-medium text-gray-900">{selectedProduct.seller.username}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Email</div>
                    <div className="text-sm md:text-base font-medium text-gray-900">{selectedProduct.seller.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Phone</div>
                    <div className="text-sm md:text-base font-medium text-gray-900">{selectedProduct.seller.phoneNumber}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </div>
                    <div className="text-sm md:text-base font-medium text-gray-900">{selectedProduct.seller.location}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {!selectedProduct.isVerified && (
                  <button
                    onClick={() => handleVerifyProduct(selectedProduct.id || selectedProduct._id, selectedProduct.name)}
                    disabled={actionLoading === (selectedProduct.id || selectedProduct._id)}
                    className="flex-1 px-4 md:px-6 py-3 bg-green-600 text-white text-sm md:text-base font-bold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {actionLoading === (selectedProduct.id || selectedProduct._id) ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Approve Product
                  </button>
                )}
                <button
                  onClick={() => handleDeleteProduct(selectedProduct.id || selectedProduct._id, selectedProduct.name)}
                  disabled={actionLoading === (selectedProduct.id || selectedProduct._id)}
                  className="flex-1 px-4 md:px-6 py-3 bg-red-600 text-white text-sm md:text-base font-bold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {actionLoading === (selectedProduct.id || selectedProduct._id) ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVerification;