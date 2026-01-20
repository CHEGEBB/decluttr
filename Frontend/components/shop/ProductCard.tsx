/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MapPin, 
  Star, 
  Truck, 
  MessageCircle,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
import { useCartContext } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    seller: string;
    sellerPhone?: string;
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
  productId: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onAddToCart?: (product: any) => void;
}

const ProductCard = ({ 
  product, 
  productId,
  isFavorite = false, 
  onToggleFavorite,
  onAddToCart 
}: ProductCardProps) => {
  // CART CONTEXT - THIS IS THE IMPORTANT PART!
  const { addToCart, isAdding, cartItems } = useCartContext();
  
  const [showAdded, setShowAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlaySuccess, setOverlaySuccess] = useState(false);

  // Check if product is in cart
  const inCart = cartItems.some(
    item => item.product._id === productId || item.product.id === productId
  );

  // HANDLE ADD TO CART - THIS IS THE MAIN LOGIC!
  const handleAddToCart = async () => {
    try {
      // Show loading overlay
      setShowOverlay(true);
      setOverlaySuccess(false);
      
      // Add to cart using CartContext
      await addToCart(productId, 1);
      
      // Show success state
      setOverlaySuccess(true);
      setShowAdded(true);
      
      // Hide overlay after 1.5 seconds
      setTimeout(() => {
        setShowOverlay(false);
        setOverlaySuccess(false);
      }, 1500);
      
      // Hide button success state after 2 seconds
      setTimeout(() => setShowAdded(false), 2000);
      
      // Optional: call the parent callback if provided
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error: any) {
      setShowOverlay(false);
      alert(error?.message || 'Failed to add to cart');
    }
  };

  return (
    <>
      {/* ADD TO CART OVERLAY - LOADING & SUCCESS MODAL */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {overlaySuccess ? (
              <>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-20 rounded-full"></div>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto relative z-10 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Added to Cart!</h3>
                <p className="text-gray-600 text-center mb-4">
                  <span className="font-semibold">{product.name}</span> has been added to your cart
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Cart updated successfully</span>
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 blur-2xl opacity-20 rounded-full"></div>
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto relative z-10">
                    <ShoppingCart className="w-10 h-10 text-white animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Adding to Cart...</h3>
                <p className="text-gray-600 text-center mb-6">Please wait while we add this item</p>
                <div className="flex justify-center">
                  <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div 
        className="group bg-white shadow-2xl border border-gray-100 overflow-hidden hover:shadow-4xl transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-400 hover:text-red-400'}`} />
              </button>
            )}
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
          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-red-600 transition-colors">
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

          {/* Actions - ADD TO CART BUTTON WITH LOGIC! */}
        <div className="flex gap-2 mt-auto">
          <div className="relative flex-1">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              disabled={showAdded || isAdding || inCart}
            >
              <span className={`transition-all duration-300 flex items-center justify-center gap-1.5 ${
                showAdded ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isAdding ? 'Adding...' : inCart ? 'In Cart ✓' : 'Add to Cart'}
              </span>
              <span className={`absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 ${
                showAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              </span>
            </button>
          </div>
          
          {/* WhatsApp Button - UPDATED */}
          <button 
            onClick={() => {
              // Get seller phone number and format it
              const phone = product.sellerPhone?.replace(/[^0-9+]/g, '') || '';
              
              if (!phone) {
                alert('Seller contact not available');
                return;
              }
              
              // Create pre-filled WhatsApp message
              const message = `Hi! I'm interested in your product: ${product.name}`;
              
              // Open WhatsApp in new tab
              const whatsappUrl = `https://web.whatsapp.com/${phone}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="p-2.5 border border-gray-200 text-gray-700 rounded-lg hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ProductCard;