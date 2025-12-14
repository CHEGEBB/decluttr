/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { 
  Heart, 
  MapPin, 
  Star, 
  Truck, 
  MessageCircle 
} from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    seller: string;
    category: string;
    type: 'Resale' | 'Donation';
    price: number;
    originalPrice?: number;
    condition: string;
    rating: number;
    reviews: number;
    location: string;
    delivery: string;
    tags: string[];
  };
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: any) => void;
}

const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {product.type === 'Donation' ? (
            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full">
              FREE
            </span>
          ) : product.originalPrice && (
            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs font-bold rounded-full">
              -{Math.round((1 - product.price/product.originalPrice) * 100)}%
            </span>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-400 hover:text-red-400'}`} />
          </button>
        </div>
        
        {/* Condition Badge */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          {product.condition}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category and Location */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-red-600 uppercase">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {product.location}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Seller and Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600">
            @{product.seller}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>

        {/* Price and Delivery */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {product.type === 'Resale' ? (
              <>
                <div className="text-base sm:text-lg font-black text-gray-900">
                  KSh {product.price.toLocaleString()}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </div>
                )}
              </>
            ) : (
              <div className="text-lg font-black text-green-600">FREE</div>
            )}
          </div>
          <div className="text-xs text-gray-600 flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            {product.delivery}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            Add to Cart
          </button>
          <button className="p-2.5 border border-gray-200 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;