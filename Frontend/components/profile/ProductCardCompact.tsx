'use client';

import { 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp
} from 'lucide-react';
import { JSX } from 'react';
import { Product } from '@/services/productService';

interface ProductCardCompactProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

const ProductCardCompact = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  getStatusIcon,
  getStatusColor 
}: ProductCardCompactProps) => {
  // Get first image or use placeholder
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
  
  // Map listing type to display format
  const listingType = product.listingType === 'donation' ? 'Donation' : 'Resale';
  
  // Format date
  const listedDate = new Date(product.createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-red-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)} flex items-center gap-1`}>
            {getStatusIcon(product.status)}
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </span>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            listingType === 'Donation' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {listingType}
          </span>
        </div>
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onView}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            {product.views}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600">{product.category}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {product.condition || 'Good'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {listingType === 'Resale' && product.price ? (
              <div className="font-bold text-gray-900">KSh {product.price.toLocaleString()}</div>
            ) : (
              <div className="font-bold text-green-600">FREE</div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Listed: {listedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;