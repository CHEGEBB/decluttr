'use client';

import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  TrendingUp,
  Heart
} from 'lucide-react';
import { JSX } from 'react';

interface ProductCardCompactProps {
  item: {
    id: number;
    name: string;
    image: string;
    category: string;
    type: 'Resale' | 'Donation';
    price: number;
    status: string;
    views: number;
    createdAt: string;
    condition: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

const ProductCardCompact = ({ 
  item, 
  onEdit, 
  onDelete, 
  onView,
  getStatusIcon,
  getStatusColor 
}: ProductCardCompactProps) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-red-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)} flex items-center gap-1`}>
            {getStatusIcon(item.status)}
            {item.status}
          </span>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            item.type === 'Donation' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {item.type}
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
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            {item.views}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600">{item.category}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {item.condition}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {item.type === 'Resale' ? (
              <div className="font-bold text-gray-900">KSh {item.price.toLocaleString()}</div>
            ) : (
              <div className="font-bold text-green-600">FREE</div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Listed: {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;