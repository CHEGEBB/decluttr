/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { 
  Package,
  Loader2,
  ArrowLeft,
  List
} from 'lucide-react';
import ProductCardCompact from './ProductCardCompact';
import { Product } from '@/services/productService';
import ProductListForm from './ProductListForm';

interface ListedItemsProps {
  products: Product[];
  loading: boolean;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onProductAdded?: () => void; // Optional callback for when a product is added
}

const ListedItems = ({ products, loading, onEditProduct, onDeleteProduct, onProductAdded }: ListedItemsProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => 
          product.status.toLowerCase() === selectedFilter.toLowerCase()
        )
      );
    }
  }, [selectedFilter, products]);

  const filters = [
    { id: 'all', label: 'All Items', count: products.length },
    { id: 'available', label: 'Available', count: products.filter(p => p.status === 'available').length },
    { id: 'pending', label: 'Pending', count: products.filter(p => p.status === 'pending').length },
    { id: 'sold', label: 'Sold', count: products.filter(p => p.status === 'sold').length }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <div className="w-3 h-3 rounded-full bg-green-500" />;
      case 'sold':
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
      case 'pending':
        return <div className="w-3 h-3 rounded-full bg-amber-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    if (onProductAdded) {
      onProductAdded(); // Refresh the products list
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading your products...</span>
        </div>
      </div>
    );
  }

  // SHOW ADD FORM MODE
  if (showAddForm) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Back to List Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Your Items</span>
            </button>
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-red-600" />
              <span className="font-bold text-gray-900">Add New Item</span>
            </div>
          </div>
        </div>

        {/* The Form Itself - Replacing the entire content */}
        <div className="p-6">
          <ProductListForm />
        </div>
      </div>
    );
  }

  // SHOW LISTED ITEMS MODE (Default)
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Listed Items</h2>
            <p className="text-gray-600">Manage your products and track their performance</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            + Add New Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                selectedFilter === filter.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
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

      {/* Items Grid */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCardCompact
                key={product.id}
                product={product}
                onEdit={() => onEditProduct(product.id)}
                onDelete={() => onDeleteProduct(product.id)}
                onView={() => window.location.href = `/products/${product.id}`}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t listed any items yet</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            >
              <Package className="w-5 h-5" />
              List Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">{products.length}</div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.filter(p => p.status === 'available').length}
            </div>
            <div className="text-xs text-gray-600">Active Listings</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {products.filter(p => p.status === 'sold').reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Sales</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {products.reduce((sum, item) => sum + item.views, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedItems;