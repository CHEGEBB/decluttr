/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Filter,
  Search,
  Package,
  MapPin,
  Calendar,
  Eye,
  Edit,
  User,
  Phone,
  Mail,
  DollarSign,
  ChevronDown,
  X,
  Loader2
} from 'lucide-react';

const OrderModeration = () => {
  const { 
    orders, 
    getAllOrders, 
    updateOrderStatus, 
    isLoading, 
    error 
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const filters = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.orderStatus === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    if (selectedFilter !== 'all' && order.orderStatus !== selectedFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.buyer.name.toLowerCase().includes(query) ||
        order.buyer.username.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await updateOrderStatus(orderId, newStatus);
      setShowModal(false);
      setSelectedOrder(null);
      await getAllOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Order Moderation</h2>
            <p className="text-sm text-gray-600 mt-1">Monitor and manage platform orders</p>
          </div>
          <button 
            onClick={getAllOrders}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or buyer..."
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap text-sm ${
                  selectedFilter === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-3 h-3 md:w-4 md:h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Orders List - Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{order.orderNumber}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.county}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 text-gray-800">
                  <div className="font-medium">{order.buyer.name}</div>
                  <div className="text-sm text-gray-500">@{order.buyer.username}</div>
                  <div className="text-xs text-gray-600">{order.buyer.phoneNumber}</div>
                </td>

                <td className="py-4 px-4 text-gray-800">
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 2} more
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Payment: {order.paymentStatus}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="font-bold text-gray-900">
                    KSh {order.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600">
                    Fee: KSh {(order.totalAmount * 0.05).toLocaleString()}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders List - Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {filteredOrders.map((order) => (
          <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">{order.orderNumber}</div>
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.orderStatus)}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{order.buyer.name}</span>
                <span className="text-xs text-gray-500">@{order.buyer.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.county}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-500 mb-1">Items:</div>
              {order.items.slice(0, 2).map((item: any, idx: number) => (
                <div key={idx} className="text-sm">
                  {item.product.name} <span className="text-gray-500">× {item.quantity}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs text-gray-500 mt-1">+{order.items.length - 2} more</div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">KSh {order.totalAmount.toLocaleString()}</div>
                <div className="text-xs text-green-600">Fee: KSh {(order.totalAmount * 0.05).toLocaleString()}</div>
              </div>
              <button
                onClick={() => openOrderDetails(order)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center p-3 md:p-4 bg-white rounded-lg">
            <div className="text-base md:text-lg font-bold text-gray-900">
              KSh {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Volume</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg">
            <div className="text-base md:text-lg font-bold text-gray-900">
              KSh {(orders.reduce((sum, o) => sum + o.totalAmount, 0) * 0.05).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Commission</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg">
            <div className="text-base md:text-lg font-bold text-gray-900">
              {orders.filter(o => o.orderStatus === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg">
            <div className="text-base md:text-lg font-bold text-gray-900">
              {orders.filter(o => ['pending', 'processing'].includes(o.orderStatus)).length}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Order Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Order Number</div>
                  <div className="font-bold text-blue-600 text-lg">{selectedOrder.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Order Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3">Buyer Information</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOrder.buyer?.name || 'N/A'} 
                      <span className="text-purple-600"> @{selectedOrder.buyer?.username || 'N/A'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{selectedOrder.buyer?.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{selectedOrder.buyer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOrder.shippingAddress?.street || 'N/A'}, {selectedOrder.shippingAddress?.city || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQuantity = Number(item.quantity) || 0;
                    const itemTotal = itemPrice * itemQuantity;
                    
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white">
                        <div className="flex gap-3">
                          {item.product?.images?.[0] && (
                            <img 
                              src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url} 
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 text-base">{item.product?.name || 'Product Name'}</div>
                            <div className="text-sm text-gray-900 mt-1">
                              Category: <span className="text-blue-600 font-semibold">{item.product?.category || 'N/A'}</span>
                            </div>
                            {item.seller && (
                              <div className="text-sm text-gray-900 mt-1">
                                Seller: <span className="text-purple-600 font-semibold">{item.seller.name || 'N/A'}</span> 
                                {item.seller.username && <span className="text-indigo-500 font-medium"> @{item.seller.username}</span>}
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-900 font-medium">
                                Price: <span className="font-bold text-orange-600">KSh {itemPrice.toLocaleString()}</span>
                              </span>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 font-semibold">Subtotal</span>
                  <span className="font-bold text-gray-900 text-lg">
                    KSh {(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 font-semibold">Platform Fee (5%)</span>
                  <span className="font-bold text-green-600 text-lg">
                    KSh {((selectedOrder.totalAmount || 0) * 0.05).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-3 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">
                    KSh {(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Update Order Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      disabled={updating || selectedOrder.orderStatus === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedOrder.orderStatus === status
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModeration;