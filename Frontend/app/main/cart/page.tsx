/* eslint-disable react-hooks/purity */
'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  Shield, 
  Lock, 
  Package, 
  CheckCircle2,
  Sparkles,
  Heart,
  Percent,
  Home,
  ChevronDown,
  Clock,
  Award,
  Star,
  Plus,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';
import { useCart } from '@/hooks/useCart';
import { refresh } from 'next/cache';

// Shipping locations
const shippingLocations = [
  { id: 1, name: 'Nairobi CBD', fee: 200, delivery: '1-2 days' },
  { id: 2, name: 'Nairobi Westlands', fee: 300, delivery: '1-2 days' },
  { id: 3, name: 'Mombasa', fee: 600, delivery: '3-4 days' },
  { id: 4, name: 'Kisumu', fee: 500, delivery: '3-4 days' },
  { id: 5, name: 'Eldoret', fee: 550, delivery: '3-4 days' },
  { id: 6, name: 'Nakuru', fee: 450, delivery: '2-3 days' }
];

// Promo codes
const promoCodes = [
  { code: 'SAVE10', discount: 10, type: 'percentage', description: 'Get 10% off your order' },
  { code: 'FREESHIP', discount: 0, type: 'shipping', description: 'Free shipping on all orders' },
  { code: 'WELCOME25', discount: 25, type: 'percentage', description: '25% off for new customers' }
];

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    totalPrice,
    shippingFee: baseShippingFee,
    grandTotal: apiGrandTotal,
    isLoading,
    isUpdating,
    isRemoving,
    error,
    removeFromCart,
    clearCart,
    getCart,
    incrementQuantity,
    decrementQuantity
  } = useCart();

  const [selectedLocation, setSelectedLocation] = useState(shippingLocations[0]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [showPromoDropdown, setShowPromoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    getCart();
  }, [getCart]);

  // Calculate totals with promo and location
  const itemsTotal = totalPrice;
  const locationShippingFee = selectedLocation.fee;
  const totalShippingFee = appliedPromo?.type === 'shipping' ? 0 : (baseShippingFee + locationShippingFee);
  
  const subtotal = itemsTotal + totalShippingFee;
  const discountAmount = appliedPromo?.type === 'percentage' 
    ? (subtotal * appliedPromo.discount) / 100 
    : 0;
  const finalGrandTotal = subtotal - discountAmount;

  // Handle increment quantity
  const handleIncrement = async (productId: string) => {
  

    setUpdatingItemId(productId);
    try {
      await incrementQuantity(productId);
    } catch (err) {
      console.error('Error incrementing quantity:', err);
    } finally {
      setUpdatingItemId(null);
    }
    window.location.reload();

  };

  // Handle decrement quantity
  const handleDecrement = async (productId: string) => {
    setUpdatingItemId(productId);
    try {
      await decrementQuantity(productId);
    } catch (err) {
      console.error('Error decrementing quantity:', err);
    } finally {
      setUpdatingItemId(null);
    }
    window.location.reload();

  };

  // Handle item removal with animation
  const handleRemoveItem = async (productId: string) => {
    setRemovingItemId(productId);
    try {
      await removeFromCart(productId);
      setTimeout(() => setRemovingItemId(null), 500);
    } catch (err) {
      console.error('Error removing item:', err);
      setRemovingItemId(null);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  // Move to wishlist (just remove for now)
  const moveToWishlist = async (productId: string) => {
    await handleRemoveItem(productId);
  };

  // Handle promo code apply
  const handlePromoApply = (code: string) => {
    const promo = promoCodes.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
      setPromoCode(code);
      setShowPromoDropdown(false);
    } else {
      alert('Invalid promo code');
    }
  };

  // Handle search (for Navbar)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Format price
  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <InfiniteMarquee />
        <Navbar  onSearch={handleSearch} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <InfiniteMarquee />
        <Navbar onSearch={handleSearch} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Error Loading Cart</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => getCart()}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <InfiniteMarquee />
        <Navbar onSearch={handleSearch} />
        
        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully</h3>
              <p className="text-gray-600 mb-6">Your order has been confirmed. We&apos;ll notify you when it ships.</p>
              <Link 
                href="/marketplace"
                className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">0</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Your Shopping Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover amazing pre-loved items and sustainable deals waiting for you
            </p>
            <Link 
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Explore Marketplace
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <InfiniteMarquee />
      <Navbar onSearch={handleSearch} />
      
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center transform transition-all duration-500 scale-100">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Checkout</h3>
            <p className="text-gray-600 mb-4">Taking you to secure payment page...</p>
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/marketplace"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 rounded-xl transition-all hover:scale-105 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Continue Shopping</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-red-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">{cartCount}</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{cartCount} items in your cart</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Value</div>
            <div className="text-2xl font-bold text-red-600">
              {formatPrice(finalGrandTotal)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl mb-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="w-7 h-7" />
                  <div>
                    <h2 className="text-xl font-bold">Your Shopping Cart</h2>
                    <p className="text-gray-300 text-sm">Review and manage your items</p>
                  </div>
                </div>
                <button
                  onClick={handleClearCart}
                  disabled={isRemoving}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const productId = product._id || product.id;
                const isRemoving = removingItemId === productId;
                const isUpdatingItem = updatingItemId === productId;
                const itemTotal = product.listingType === 'resale' ? product.price * item.quantity : 0;
                
                return (
                  <div 
                    key={item._id}
                    className={`bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 overflow-hidden ${
                      isRemoving
                        ? 'opacity-0 scale-95 translate-x-4' 
                        : 'opacity-100 scale-100'
                    } hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            <img 
                              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop'} 
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                            {product.listingType === 'donation' && (
                              <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg">
                                FREE
                              </div>
                            )}
                          </div>
                          {/* Rating Badge */}
                          <div className="absolute -bottom-2 left-4 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">{product.seller?.ratings || product.rating || 4.5}</span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                                {product.listingType === 'resale' && product.price > 0 && (
                                  <div className="text-2xl font-black text-gray-900">
                                    {formatPrice(itemTotal)}
                                    {item.quantity > 1 && (
                                      <span className="text-sm font-normal text-gray-500 ml-2">
                                        ({item.quantity} × {formatPrice(product.price)})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-sm text-gray-600">@{product.seller?.username || 'seller'}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                  {product.category}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                  {product.condition || 'Good'}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <Truck className="w-4 h-4" />
                                  {product.listingType === 'donation' ? 'Free' : 'Standard'}
                                </span>
                              </div>

                              {/* Quantity Controls - ADDED THIS SECTION */}
                              <div className="mb-4">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleDecrement(productId)}
                                      disabled={isUpdatingItem || isUpdating || item.quantity <= 1}
                                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="w-12 text-center">
                                      <span className="text-lg font-bold text-gray-900">{item.quantity}</span>
                                    </div>
                                    <button
                                      onClick={() => handleIncrement(productId)}
                                      disabled={isUpdatingItem || isUpdating}
                                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.listingType === 'resale' && (
                                      <span>
                                        Unit: {formatPrice(product.price)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {product.listingType === 'resale' && (
                                <div className="text-sm text-gray-500">
                                  Added on: {new Date(item.addedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              {/* Move to Wishlist */}
                              <button
                                onClick={() => moveToWishlist(productId)}
                                disabled={isRemoving || isUpdatingItem}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg disabled:opacity-50"
                              >
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-semibold">Save for Later</span>
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveItem(productId)}
                              disabled={isRemoving || isUpdatingItem}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-all hover:scale-105 group disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span className="font-semibold">
                                {isRemoving ? 'Removing...' : 'Remove'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            {/* Order Summary Card */}
            <div className="sticky top-24 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Security Badge */}
                <div className="flex items-center gap-3 p-4 border border-emerald-200 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-800">Secure Checkout</div>
                    <div className="text-sm text-emerald-600">Your payment is 100% protected</div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Items Total ({cartCount})</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(itemsTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {appliedPromo?.type === 'shipping' ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(totalShippingFee)
                      )}
                    </span>
                  </div>

                  {/* Location Selector */}
                  <div className="py-4 border-b border-gray-100">
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Shipping Location
                    </label>
                    <select
                      value={selectedLocation.id}
                      onChange={(e) => {
                        const location = shippingLocations.find(loc => loc.id === parseInt(e.target.value));
                        if (location) setSelectedLocation(location);
                      }}
                      className="w-full px-4 py-3 text-gray-500 placeholder:text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    >
                      {shippingLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {formatPrice(location.fee)} ({location.delivery})
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Estimated delivery: {selectedLocation.delivery}
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Promo Code
                      </label>
                      <button
                        onClick={() => setShowPromoDropdown(!showPromoDropdown)}
                        className="text-sm text-red-600 font-semibold flex items-center gap-1"
                      >
                        View Offers
                        <ChevronDown className={`w-4 h-4 transition-transform ${showPromoDropdown ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-3 text-gray-500 placeholder:text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <button
                        onClick={() => handlePromoApply(promoCode)}
                        className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Applied Promo Display */}
                    {appliedPromo && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-bold text-green-700">{appliedPromo.code} Applied!</span>
                        <button
                          onClick={() => {
                            setAppliedPromo(null);
                            setPromoCode('');
                          }}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Promo Dropdown */}
                    {showPromoDropdown && (
                      <div className="mt-3 space-y-2 animate-fadeIn">
                        {promoCodes.map((promo) => (
                          <button
                            key={promo.code}
                            onClick={() => handlePromoApply(promo.code)}
                            className="w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-red-300 transition-all text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-gray-900">{promo.code}</div>
                                <div className="text-sm text-gray-600">{promo.description}</div>
                              </div>
                              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                                {promo.type === 'percentage' ? `${promo.discount}%` : 'Free Ship'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Discount */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-bold">Discount Applied</span>
                      </div>
                      <span className="text-lg font-bold text-green-700">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-6 mt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Grand Total</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-red-600">
                          {formatPrice(finalGrandTotal)}
                        </div>
                        <div className="text-sm text-gray-500">Including all taxes</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/main/checkout"
                  onClick={() => setShowSuccess(true)}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-bold text-lg rounded-xl hover:from-red-700 hover:via-red-800 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden block text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Lock className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Proceed to Checkout</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                {/* Security Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>SSL Secured Checkout</span>
                  </div>
                  <p>You&apos;ll be redirected to our secure payment page</p>
                </div>

                {/* Guarantee */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">30-Day Money Back Guarantee</span> • SSL Secured • 256-bit Encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Delivery & Returns
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Items ship within 24 hours of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Free returns within 14 days for resale items</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Real-time tracking updates via SMS & Email</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Free pickup for donations in major cities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}