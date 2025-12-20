/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Smartphone,
  CreditCard,
  Shield,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Truck,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Loader2,
  Receipt,
  AlertCircle,
  ChevronRight,
  Home,
  QrCode,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayment';

// Payment steps
const paymentSteps = [
  { id: 1, name: 'Review Order', icon: Receipt, status: 'completed' },
  { id: 2, name: 'Payment Details', icon: CreditCard, status: 'current' },
  { id: 3, name: 'Confirmation', icon: CheckCircle2, status: 'upcoming' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    cartItems, 
    totalPrice, 
    shippingFee, 
    grandTotal, 
    isLoading: cartLoading,
    clearCart,
    getCart 
  } = useCart();
  
  const { 
    createOrder, 
    isCreating: orderCreating, 
    error: orderError,
    currentOrder 
  } = useOrders();
  
  const { 
    initiatePayment, 
    checkPaymentStatus, 
    isProcessing: paymentProcessing, 
    paymentStatus,
    error: paymentError,
    validatePhoneNumber,
    formatPhoneNumber,
    clearPaymentState
  } = usePayment();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const initializeCheckout = async () => {
      if (!authLoading) {
        if (!isAuthenticated) {
          router.push('/auth/login?redirect=/main/checkout');
          return;
        }

        await getCart();
        setIsInitializing(false);
      }
    };

    initializeCheckout();
  }, [authLoading, isAuthenticated, router, getCart]);

  // Handle search (for Navbar)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Format phone number for display
  const formatDisplayPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `+${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `+${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`;
  };

  // Handle phone number input
  const handlePhoneChange = (value: string) => {
    const formatted = formatDisplayPhone(value);
    setPhoneNumber(formatted);
  };

  // Helper function to safely get seller info
  const getSellerInfo = (seller: any) => {
    if (!seller) return 'Unknown';
    if (typeof seller === 'object') {
      return seller.name || seller.username || 'Unknown';
    }
    return 'Unknown';
  };

  // Helper function to safely get price
  const getItemPrice = (item: any) => {
    return item.price || item.product?.price || 0;
  };

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = getItemPrice(item);
      return total + (itemPrice * item.quantity);
    }, 0);

    return {
      subtotal,
      shippingFee: shippingFee || 600,
      total: subtotal + (shippingFee || 600)
    };
  };

  const { subtotal, shippingFee: calculatedShipping, total } = calculateTotals();

  // Create order and initiate payment
  const handleMpesaPayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      alert('Invalid phone number. Please use format: 2547XXXXXXXX or 07XXXXXXXX');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Please provide a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      router.push('/main/marketplace');
      return;
    }

    try {
      // 1. Create order
      const order = await createOrder({
        shippingAddress
      });

      // 2. Initiate payment
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      await initiatePayment({
        phoneNumber: formattedPhone,
        amount: total,
        orderId: order._id,
        accountReference: `ORD-${order._id.slice(-8).toUpperCase()}`,
        transactionDesc: `Payment for order ${order._id.slice(-8).toUpperCase()}`
      });

      // 3. Check payment status after 5 seconds
      setTimeout(async () => {
        try {
          const statusResponse = await checkPaymentStatus(order._id);
          
          if (statusResponse.data.paymentStatus === 'completed') {
            setPaymentSuccess(true);
            setMpesaCode(statusResponse.data.transaction.mpesaReceiptNumber || 'MPXXXXXX');
            
            // Clear cart on successful payment
            await clearCart();
            
            // Auto-hide success after 5 seconds
            setTimeout(() => {
              setPaymentSuccess(false);
              router.push('/dashboard/orders');
            }, 5000);
          }
        } catch (error) {
          console.error('Payment status check failed:', error);
        }
      }, 5000);

    } catch (error: any) {
      console.error('Payment process failed:', error);
      alert(error.message || 'Payment failed. Please try again.');
    }
  };

  // If still loading or not authenticated
  if (authLoading || isInitializing || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <InfiniteMarquee />
        <Navbar onSearch={handleSearch} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
            <Link
              href="/main/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all"
            >
              Continue Shopping
              <ChevronRight className="w-5 h-5" />
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
      
      {/* Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 scale-100">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Successful!</h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-black text-green-600 mb-2">KSh {total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">M-Pesa Confirmation Code</div>
              <div className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg mt-2">
                {mpesaCode}
              </div>
            </div>
            <div className="space-y-3">
              <Link 
                href="/dashboard/orders"
                className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-center hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                View Order Details
              </Link>
              <Link 
                href="/main/marketplace"
                className="block w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-center hover:bg-gray-200 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(orderError || paymentError) && (
        <div className="fixed top-4 right-4 z-50 animate-fadeIn">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-700">Error</div>
                <div className="text-sm text-red-600">{orderError || paymentError}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/main/cart"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 rounded-xl transition-all hover:scale-105 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Cart</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Secure Checkout</h1>
              <p className="text-gray-600">Complete your purchase securely</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Order Total</div>
            <div className="text-2xl font-bold text-red-600">
              KSh {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {paymentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : step.status === 'current'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{step.name}</div>
                </div>
                {index < paymentSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Details & Payment */}
          <div className="lg:w-2/3">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Receipt className="w-6 h-6" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Items in Your Order ({cartItems.length})
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const itemPrice = getItemPrice(item);
                      const sellerInfo = getSellerInfo(item.seller);
                      
                      return (
                        <div key={item.product._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <div className="font-semibold text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-600">
                              Seller: {sellerInfo} • Qty: {item.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product.listingType === 'resale' ? 'Resale' : 'Donation'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              KSh {(itemPrice * item.quantity).toLocaleString()}
                            </div>
                            {item.product.listingType === 'resale' && itemPrice > 0 && (
                              <div className="text-sm text-gray-500">
                                KSh {itemPrice.toLocaleString()} each
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">KSh {calculatedShipping.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Amount</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-red-600">
                          KSh {total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Including all taxes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter your complete shipping address (street, building, town, etc.)"
                      className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all min-h-[100px]"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      This address will be used to deliver your items
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Recipient</div>
                        <div className="text-gray-600">{user?.name || 'Guest'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Contact Phone</div>
                        <div className="text-gray-600">{user?.phoneNumber || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method - M-Pesa Focus */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  M-Pesa Payment
                </h3>
                <p className="text-gray-600 mb-4">Enter your M-Pesa registered phone number to receive payment prompt</p>
              </div>
              
              <div className="p-6">
                {paymentStatus === 'pending' && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 animate-fadeIn">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-700">Payment Pending</div>
                      <div className="text-sm text-blue-600">
                        Please check your phone and enter your M-Pesa PIN to complete payment
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      M-Pesa Registered Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Smartphone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+254 712 345 678 or 07XXXXXXXX"
                        className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder:text-gray-400 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        required
                        disabled={paymentProcessing || paymentStatus === 'pending'}
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Enter the phone number registered with your M-Pesa account
                    </div>
                  </div>

                  {/* Payment Amount Display */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">You will pay</div>
                      <div className="text-5xl font-black text-gray-900 mb-2">
                        KSh {total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        An M-Pesa prompt will be sent to {phoneNumber || 'your phone'}
                      </div>
                    </div>
                  </div>

                  {/* Security Assurance */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-emerald-700">Secure Payment:</span>
                      <span className="text-emerald-600"> Your payment is protected with 256-bit encryption. We never store your payment details.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Actions & Summary */}
          <div className="lg:w-1/3">
            {/* Order Recap Card */}
            <div className="sticky top-24 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Lock className="w-6 h-6" />
                  Complete Payment
                </h2>
              </div>

              <div className="p-6">
                {/* Payment Status */}
                {paymentStatus && (
                  <div className={`mb-6 p-4 rounded-xl border ${
                    paymentStatus === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : paymentStatus === 'pending'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {paymentStatus === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : paymentStatus === 'pending' ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div className="font-semibold capitalize">
                        Payment {paymentStatus}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Instructions */}
                <div className="mb-6 space-y-4">
                  <h3 className="font-bold text-gray-900">What happens next:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-600">1</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Click &quot;Pay with M-Pesa&quot; below
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-600">2</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Enter your M-Pesa PIN on your phone
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-600">3</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Receive instant confirmation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleMpesaPayment}
                  disabled={
                    orderCreating || 
                    paymentProcessing || 
                    paymentStatus === 'pending' || 
                    !phoneNumber.trim() || 
                    !shippingAddress.trim() ||
                    !validatePhoneNumber(phoneNumber)
                  }
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    orderCreating || paymentProcessing || paymentStatus === 'pending'
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] hover:shadow-2xl shadow-xl'
                  }`}
                >
                  {orderCreating || paymentProcessing || paymentStatus === 'pending' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {paymentStatus === 'pending' ? 'Waiting for Payment...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Pay with M-Pesa
                    </>
                  )}
                </button>

                {/* Amount Display */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount Due</span>
                    <span className="text-2xl font-black text-gray-900">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    You&apos;ll be redirected to complete payment securely
                  </div>
                </div>

                {/* Need Help */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-gray-600 mb-2">Need help with payment?</div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">+254 700 123 456</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secure Payment Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>256-bit SSL encryption for all transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payment details are never stored on our servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Real-time fraud detection and prevention</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>PCI DSS compliant payment processing</span>
                </li>
              </ul>
            </div>

            {/* Guarantee */}
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-900 mb-1">30-Day Money Back Guarantee</div>
                  <div className="text-sm text-gray-600">
                    Not satisfied with your purchase? Get a full refund within 30 days.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
          >
            <Home className="w-5 h-5" />
            <span>Return to Homepage</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}