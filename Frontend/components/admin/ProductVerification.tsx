'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertCircle,
  Clock,
  Filter,
  Search,
  Package,
  User,
  MapPin,
  Calendar,
  MoreVertical
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  seller: string;
  category: string;
  type: 'Resale' | 'Donation';
  price: number;
  condition: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Flagged';
  listedDate: string;
  location: string;
  description: string;
  reason?: string;
}

const ProductVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  
  const products: Product[] = [
    {
      id: 1,
      name: 'iPhone 13 Pro 256GB',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
      seller: 'John Doe',
      category: 'Electronics',
      type: 'Resale',
      price: 85000,
      condition: 'Like New',
      status: 'Pending',
      listedDate: '2024-12-10',
      location: 'Nairobi',
      description: 'iPhone 13 Pro in excellent condition, 256GB storage. Includes original box and charger.'
    },
    {
      id: 2,
      name: 'Leather Jacket',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      seller: 'Jane Smith',
      category: 'Clothes',
      type: 'Resale',
      price: 12500,
      condition: 'Excellent',
      status: 'Flagged',
      listedDate: '2024-12-09',
      location: 'Mombasa',
      description: 'Genuine leather jacket, size M, worn only a few times.',
      reason: 'Price seems too low for genuine leather'
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      seller: 'Mike Johnson',
      category: 'Shoes',
      type: 'Resale',
      price: 13500,
      condition: 'New',
      status: 'Pending',
      listedDate: '2024-12-08',
      location: 'Kisumu',
      description: 'Brand new Nike Air Max 270, size 42. Original receipt available.'
    },
    {
      id: 4,
      name: 'Book Collection',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      seller: 'Sarah Williams',
      category: 'Books',
      type: 'Donation',
      price: 0,
      condition: 'Good',
      status: 'Approved',
      listedDate: '2024-12-07',
      location: 'Nairobi',
      description: 'Collection of 5 Harry Potter books in good condition.'
    },
    {
      id: 5,
      name: 'Gaming Laptop',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
      seller: 'David Brown',
      category: 'Electronics',
      type: 'Resale',
      price: 120000,
      condition: 'Excellent',
      status: 'Rejected',
      listedDate: '2024-12-06',
      location: 'Eldoret',
      description: 'Gaming laptop with RTX 3060, 16GB RAM, 1TB SSD.',
      reason: 'Counterfeit product detected'
    }
  ];

  const filters = [
    { id: 'pending', label: 'Pending Review', count: products.filter(p => p.status === 'Pending').length },
    { id: 'flagged', label: 'Flagged', count: products.filter(p => p.status === 'Flagged').length },
    { id: 'approved', label: 'Approved', count: products.filter(p => p.status === 'Approved').length },
    { id: 'rejected', label: 'Rejected', count: products.filter(p => p.status === 'Rejected').length },
    { id: 'all', label: 'All Products', count: products.length }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedFilter !== 'all' && product.status.toLowerCase() !== selectedFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Flagged':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Flagged':
        return 'bg-amber-100 text-amber-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProductAction = (productId: number, action: string) => {
    console.log(`${action} product ${productId}`);
    // Implement product action logic
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Verification</h2>
            <p className="text-gray-600">Review and approve product listings before they go live</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
              Approve All Pending
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, seller, or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{product.seller}</span>
                          <MapPin className="w-3 h-3 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-600">{product.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Category</div>
                      <div className="font-medium">{product.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className={`font-medium ${
                        product.type === 'Donation' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {product.type}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Condition</div>
                      <div className="font-medium">{product.condition}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Price</div>
                      <div className="font-bold">
                        {product.type === 'Donation' ? 'FREE' : `KSh ${product.price.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Description</div>
                    <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Listed Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Listed: {new Date(product.listedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Reason (if flagged or rejected) */}
                  {product.reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-xs font-semibold text-red-700 mb-1">Flag Reason:</div>
                      <div className="text-sm text-red-600">{product.reason}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleProductAction(product.id, 'view')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {product.status === 'Pending' || product.status === 'Flagged' ? (
                        <>
                          <button
                            onClick={() => handleProductAction(product.id, 'approve')}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleProductAction(product.id, 'reject')}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      ) : product.status === 'Rejected' ? (
                        <button
                          onClick={() => handleProductAction(product.id, 'review')}
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Review Again
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProductAction(product.id, 'unapprove')}
                          className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Revoke Approval
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">All products have been reviewed</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.filter(p => p.status === 'Pending').length}
            </div>
            <div className="text-xs text-gray-600">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.filter(p => p.status === 'Flagged').length}
            </div>
            <div className="text-xs text-gray-600">Flagged Items</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.filter(p => p.status === 'Approved').length}
            </div>
            <div className="text-xs text-gray-600">Approved Today</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.filter(p => p.status === 'Rejected').length}
            </div>
            <div className="text-xs text-gray-600">Rejected Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVerification;