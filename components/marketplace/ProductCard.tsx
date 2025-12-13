// components/marketplace/ProductCard.tsx
'use client';

import { Tag, Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  image: string;
  seller: string;
  category: string;
  type: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-400'}`}
          />
        </button>
        
        {/* Free Badge for Donations */}
        {product.type === 'Donation' && (
          <span className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Tag className="w-3 h-3" />
            FREE
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 truncate text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">@{product.seller}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
            product.type === 'Resale' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {product.type}
          </span>
          
          {product.type === 'Resale' && (
            <span className="text-xl font-black text-gray-900">
              KSh {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button with Confirmation */}
        <div className="relative">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors relative overflow-hidden"
          >
            <span className={`transition-opacity duration-300 ${showAdded ? 'opacity-0' : 'opacity-100'}`}>
              Add to Cart
            </span>
            <span className={`absolute inset-0 flex items-center justify-center bg-green-600 transition-opacity duration-300 ${showAdded ? 'opacity-100' : 'opacity-0'}`}>
              ✓ Added to Cart!
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}