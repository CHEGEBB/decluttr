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
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { PendingProduct } from '@/services/adminService';

const ProductVerification = () => {
  const { 
    pendingProducts, 
    isLoading, 
    error, 
    getPendingProducts, 
    verifyProduct, 
    deleteProduct, 
    clearError 
  } = useAdmin();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    getPendingProducts();
  }, [getPendingProducts]);

  const handleVerifyProduct = async (productId: string, productName: string) => {
    if (!confirm(`Approve product: ${productName}?`)) {
      return;
    }

    setActionLoading(productId);
    try {
      await verifyProduct(productId);
      alert(`Product "${productName}" has been verified successfully`);
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
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(null);
    }
  };

  const filters = [
    { 
      id: 'pending', 
      label: 'Pending Review', 
      count: pendingProducts.filter(p => !p.isVerified).length 
    },
    { 
      id: 'all', 
      label: 'All Products', 
      count: pendingProducts.length 
    }
  ];

  const filteredProducts = pendingProducts.filter(product => {
    if (selectedFilter === 'pending' && product.isVerified) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.seller.name.toLowerCase().includes(query) ||
        product.seller.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (isLoading && pendingProducts.length === 0) {
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
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-green-600" />
              Product Verification
            </h2>
            <p className="text-gray-600 mt-1">Review and approve product listings before they go live</p>
          </div>
          <button 
            onClick={getPendingProducts}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Products'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button 
              onClick={clearError} 
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, seller, or email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product: PendingProduct) => (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate" title={product.name}>
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {product.seller.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                      product.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {product.isVerified ? '✓ Verified' : '⏱ Pending'}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  {/* Price */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Price</span>
                    <div className="font-bold text-lg text-blue-600 flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      KSh {product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="font-medium text-gray-900">{product.status}</span>
                  </div>

                  {/* Seller Info */}
                  <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                    <div className="text-xs font-semibold text-purple-700 uppercase">Seller Contact</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-purple-500" />
                        <span className="text-gray-700">{product.seller.location}</span>
                      </div>
                      <div className="text-sm text-gray-700 truncate" title={product.seller.email}>
                        {product.seller.email}
                      </div>
                      <div className="text-sm text-gray-700">{product.seller.phoneNumber}</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Listed: {new Date(product.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2">
                  {!product.isVerified && (
                    <button
                      onClick={() => handleVerifyProduct(product.id, product.name)}
                      disabled={actionLoading === product.id}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {actionLoading === product.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    disabled={actionLoading === product.id}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {actionLoading === product.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No pending products'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'All products have been reviewed'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Product Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-600 mb-1">
              <Clock className="w-6 h-6" />
              {pendingProducts.filter(p => !p.isVerified).length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 mb-1">
              <CheckCircle className="w-6 h-6" />
              {pendingProducts.filter(p => p.isVerified).length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Verified</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-600 mb-1">
              <Package className="w-6 h-6" />
              {pendingProducts.length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Products</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600 mb-1">
              <DollarSign className="w-6 h-6" />
              {(pendingProducts.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVerification;