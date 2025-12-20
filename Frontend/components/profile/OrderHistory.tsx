/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Star,
  Loader2,
  RefreshCw,
  X,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/services/orderService';

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    orders,
    getMyOrders,
    updateOrderStatus,
    isLoading, 
    isUpdating,
    error 
  } = useOrders();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !user) return;

      try {
        await getMyOrders();
      } catch (error: any) {
        console.error('❌ Failed to load orders:', error);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user, isAuthenticated, getMyOrders]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getMyOrders();
    } catch (error: any) {
      console.error('❌ Failed to refresh orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle view details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  // Map order status to display status
  const mapOrderStatus = (orderStatus: string): 'Delivered' | 'Shipping' | 'Pending' | 'Cancelled' => {
    switch (orderStatus) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
      case 'processing':
        return 'Shipping';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
    { id: 'shipping', label: 'Shipping', count: orders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'processing').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (selectedFilter === 'shipping') {
          return order.orderStatus === 'shipped' || order.orderStatus === 'processing';
        }
        return order.orderStatus === selectedFilter;
      });

  const getStatusIcon = (status: string) => {
    const displayStatus = mapOrderStatus(status);
    switch (displayStatus) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipping':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    const displayStatus = mapOrderStatus(status);
    switch (displayStatus) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipping':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Calculate completed orders
  const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;

  // Calculate total items
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  // Loading state
  if (isLoading && orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
              <p className="text-gray-600">Track your purchases and donations</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <div className="text-sm text-gray-600">
                Total Orders: <span className="font-bold">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-700">Error</div>
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
        )}

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

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  {/* Order Details Column */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Placed: {formatDate(order.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>

                  {/* Items Column */}
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Package className="w-full h-full p-2 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.listingType === 'resale' 
                                ? `KSh ${item.price.toLocaleString()}` 
                                : 'Donation'}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500 pl-13">
                          +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {mapOrderStatus(order.orderStatus)}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.paymentStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Total Column */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">
                      KSh {order.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Items: KSh {(order.totalAmount - order.shippingFee).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Shipping: KSh {order.shippingFee.toLocaleString()}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {order.orderStatus === 'shipped' && (
                        <button className="px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center">
                          <Truck className="w-4 h-4" />
                          Track Order
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {selectedFilter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${selectedFilter} orders at the moment`}
            </p>
          </div>
        )}

        {/* Summary */}
        {orders.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  KSh {totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {completedOrders}
                </div>
                <div className="text-xs text-gray-600">Completed Orders</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {totalItems}
                </div>
                <div className="text-xs text-gray-600">Total Items</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Order Details</h3>
                <p className="text-red-100">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedOrder.orderStatus)}
                    <div>
                      <div className="font-semibold text-gray-900">Order Status</div>
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {mapOrderStatus(selectedOrder.orderStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Payment Status</div>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                      selectedOrder.paymentStatus === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedOrder.paymentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-500">Order Date</div>
                      <div className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-500">Last Updated</div>
                      <div className="font-medium text-gray-900">{formatDate(selectedOrder.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Shipping Address</h4>
                </div>
                <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Buyer Information */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-gray-900">Buyer Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-500">Name</div>
                      <div className="font-medium text-gray-900">{selectedOrder.buyer.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{selectedOrder.buyer.email}</div>
                    </div>
                  </div>
                  {selectedOrder.buyer.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Phone</div>
                        <div className="font-medium text-gray-900">{selectedOrder.buyer.phoneNumber}</div>
                      </div>
                    </div>
                  )}
                  {selectedOrder.buyer.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">{selectedOrder.buyer.location}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-gray-900">Order Items ({selectedOrder.items.length})</h4>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Package className="w-full h-full p-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full ${
                              item.listingType === 'donation' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.listingType === 'resale' ? 'Resale' : 'Donation'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {item.listingType === 'resale' 
                            ? `KSh ${item.price.toLocaleString()}` 
                            : 'FREE'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h4 className="font-bold text-gray-900">Order Summary</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      KSh {(selectedOrder.totalAmount - selectedOrder.shippingFee).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Fee</span>
                    <span className="font-medium">KSh {selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-black text-red-600">
                        KSh {selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedOrder.payment && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-gray-900">Payment Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {selectedOrder.mpesaReceiptNumber && (
                      <div>
                        <div className="text-gray-500">M-Pesa Receipt</div>
                        <div className="font-mono font-bold text-gray-900">
                          {selectedOrder.mpesaReceiptNumber}
                        </div>
                      </div>
                    )}
                    {selectedOrder.transactionId && (
                      <div>
                        <div className="text-gray-500">Transaction ID</div>
                        <div className="font-mono text-gray-900">{selectedOrder.transactionId}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {selectedOrder.orderStatus === 'shipped' && (
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Track Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default OrderHistory;