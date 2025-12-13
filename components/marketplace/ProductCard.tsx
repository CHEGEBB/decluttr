/* eslint-disable react-hooks/purity */
// components/marketplace/ProductCard.tsx
'use client'
import React, { useState } from 'react';
import { Heart, Star, MapPin, Eye, Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  seller: string;
  category: string;
  type: string;
  price: number;
  rating: number;
  condition: string;
  location?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `KSh ${(price / 1000).toFixed(0)}K`;
    }
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div 
      className="group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Image Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {product.type === 'Donation' ? (
            <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-lg">
              <Tag className="w-4 h-4" />
              FREE
            </span>
          ) : (
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full">
              SALE
            </span>
          )}
          
          {/* Quick View */}
          <button className={`px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${
            isFavorite ? 'scale-110' : 'scale-100'
          }`}
        >
          <Heart 
            className={`w-6 h-6 transition-all ${
              isFavorite ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-400'
            }`}
          />
        </button>
        
        {/* Condition Badge */}
        <span className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
          {product.condition}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category and Location */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">
            {product.category}
          </span>
          {product.location && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {product.location}
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>

        {/* Seller and Rating */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base text-gray-600">
            @{product.seller}
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-base font-semibold text-gray-900">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.id * 7 % 100 + 1})</span>
          </div>
        </div>

        {/* Price and Type */}
        <div className="flex items-center justify-between mb-5">
          {product.type === 'Resale' ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.price > 50000 && (
                <span className="text-sm text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded">
                  -25%
                </span>
              )}
            </div>
          ) : (
            <span className="text-2xl font-black text-green-600">FREE</span>
          )}
          
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            product.type === 'Resale' 
              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {product.type}
          </span>
        </div>

        {/* Add to Cart Button with Confirmation */}
        <div className="relative">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-base rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 relative overflow-hidden group"
            disabled={showAdded}
          >
            <span className={`transition-all duration-300 flex items-center justify-center gap-2 ${
              showAdded ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              <span>Add to Cart</span>
              {product.type === 'Resale' && (
                <span className="text-sm opacity-75">• {formatPrice(product.price)}</span>
              )}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 ${
              showAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added to Cart!
              </span>
            </span>
          </button>
          
          {/* Quick Actions */}
          <div className={`flex gap-2 mt-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-red-600 hover:text-red-600 transition-colors">
              Buy Now
            </button>
            <button className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}