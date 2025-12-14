'use client';

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from 'lucide-react';
import ProductCardCompact from './ProductCardCompact';

interface ListedItem {
  id: number;
  name: string;
  image: string;
  category: string;
  type: 'Resale' | 'Donation';
  price: number;
  status: 'Active' | 'Sold' | 'Pending' | 'Draft';
  views: number;
  createdAt: string;
  condition: string;
}

const ListedItems = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const items: ListedItem[] = [
    {
      id: 1,
      name: 'iPhone 13 Pro 256GB',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
      category: 'Electronics',
      type: 'Resale',
      price: 85000,
      status: 'Active',
      views: 245,
      createdAt: '2024-12-10',
      condition: 'Like New'
    },
    {
      id: 2,
      name: 'Leather Jacket',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      category: 'Clothes',
      type: 'Resale',
      price: 12500,
      status: 'Sold',
      views: 189,
      createdAt: '2024-12-05',
      condition: 'Excellent'
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      category: 'Shoes',
      type: 'Resale',
      price: 13500,
      status: 'Active',
      views: 312,
      createdAt: '2024-12-01',
      condition: 'New'
    },
    {
      id: 4,
      name: 'Harry Potter Book Set',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      category: 'Books',
      type: 'Donation',
      price: 0,
      status: 'Pending',
      views: 156,
      createdAt: '2024-11-28',
      condition: 'Good'
    },
    {
      id: 5,
      name: 'Modern Study Desk',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
      category: 'Furniture',
      type: 'Resale',
      price: 28000,
      status: 'Active',
      views: 98,
      createdAt: '2024-11-25',
      condition: 'Excellent'
    },
    {
      id: 6,
      name: 'Designer Handbag',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      category: 'Accessories',
      type: 'Resale',
      price: 45000,
      status: 'Draft',
      views: 0,
      createdAt: '2024-11-20',
      condition: 'Excellent'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Items', count: items.length },
    { id: 'active', label: 'Active', count: items.filter(i => i.status === 'Active').length },
    { id: 'sold', label: 'Sold', count: items.filter(i => i.status === 'Sold').length },
    { id: 'pending', label: 'Pending', count: items.filter(i => i.status === 'Pending').length },
    { id: 'draft', label: 'Drafts', count: items.filter(i => i.status === 'Draft').length }
  ];

  const filteredItems = selectedFilter === 'all' 
    ? items 
    : items.filter(item => item.status.toLowerCase() === selectedFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Sold':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Draft':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Listed Items</h2>
            <p className="text-gray-600">Manage your products and track their performance</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
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
                  ? 'bg-red-600 text-white'
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
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ProductCardCompact
                key={item.id}
                item={item}
                onEdit={() => console.log('Edit', item.id)}
                onDelete={() => console.log('Delete', item.id)}
                onView={() => console.log('View', item.id)}
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
            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
              List Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">{items.length}</div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {items.filter(i => i.status === 'Active').length}
            </div>
            <div className="text-xs text-gray-600">Active Listings</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {items.filter(i => i.status === 'Sold').reduce((sum, item) => sum + item.price, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Sales</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {items.reduce((sum, item) => sum + item.views, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedItems;