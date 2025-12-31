'use client';

import { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Filter,
  Search,
  DollarSign,
  User,
  Package,
  MapPin,
  Calendar,
  Eye,
  MessageCircle
} from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    category: string;
  };
  seller: {
    _id: string;
    name: string;
    username: string;
  };
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  buyer: {
    _id: string;
    name: string;
    username: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    county: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrderModeration = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Moderation</h2>
            <p className="text-gray-600">Monitor and manage platform orders and transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
            >
              Refresh Orders
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by order number or buyer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

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
                <Filter className="w-4 h-4" />
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.county}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium">{order.buyer.name}</div>
                    <div className="text-sm text-gray-500">@{order.buyer.username}</div>
                    <div className="text-xs text-gray-600">{order.buyer.phoneNumber}</div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 2} more items
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
                    Commission: KSh {(order.totalAmount * 0.05).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Volume</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {(orders.reduce((sum, order) => sum + order.totalAmount, 0) * 0.05).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Commission</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.orderStatus === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed Orders</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length}
            </div>
            <div className="text-xs text-gray-600">Pending Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModeration;