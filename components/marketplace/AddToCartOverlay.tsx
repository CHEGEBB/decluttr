// components/marketplace/AddToCartOverlay.tsx
'use client';

import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface AddToCartOverlayProps {
  isVisible: boolean;
  isSuccess: boolean;
  productName?: string;
}

export function AddToCartOverlay({ isVisible, isSuccess, productName }: AddToCartOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {isSuccess ? (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto relative z-10 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Added to Cart!</h3>
            {productName && (
              <p className="text-gray-600 text-center mb-4">
                <span className="font-semibold">{productName}</span> has been added to your cart
              </p>
            )}
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
    </div>
  );
}