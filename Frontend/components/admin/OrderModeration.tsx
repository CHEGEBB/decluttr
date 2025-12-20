'use client';

import { useState } from 'react';
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

interface Order {
  id: number;
  productName: string;
  productImage: string;
  buyer: string;
  seller: string;
  category: string;
  type: 'Resale' | 'Donation';
  price: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Disputed';
  orderDate: string;
  deliveryDate?: string;
  location: string;
  trackingId?: string;
}

const OrderModeration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('processing');
  
  const orders: Order[] = [
    {
      id: 1,
      productName: 'iPhone 13 Pro',
      productImage: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
      buyer: 'Jane Smith',
      seller: 'John Doe',
      category: 'Electronics',
      type: 'Resale',
      price: 85000,
      status: 'Processing',
      orderDate: '2024-12-10',
      location: 'Nairobi'
    },
    {
      id: 2,
      productName: 'Leather Jacket',
      productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      buyer: 'Mike Johnson',
      seller: 'Sarah Williams',
      category: 'Clothes',
      type: 'Resale',
      price: 12500,
      status: 'Shipped',
      orderDate: '2024-12-09',
      deliveryDate: '2024-12-12',
      location: 'Mombasa',
      trackingId: 'TRK78901234'
    },
    {
      id: 3,
      productName: 'Book Collection',
      productImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      buyer: 'Community Library',
      seller: 'David Brown',
      category: 'Books',
      type: 'Donation',
      price: 0,
      status: 'Delivered',
      orderDate: '2024-12-08',
      deliveryDate: '2024-12-09',
      location: 'Kisumu'
    },
    {
      id: 4,
      productName: 'Gaming Laptop',
      productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
      buyer: 'Alex Wilson',
      seller: 'Emma Davis',
      category: 'Electronics',
      type: 'Resale',
      price: 120000,
      status: 'Disputed',
      orderDate: '2024-12-07',
      location: 'Eldoret'
    },
    {
      id: 5,
      productName: 'Designer Handbag',
      productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      buyer: 'Olivia Taylor',
      seller: 'James Miller',
      category: 'Accessories',
      type: 'Resale',
      price: 45000,
      status: 'Cancelled',
      orderDate: '2024-12-06',
      location: 'Nairobi'
    }
  ];

  const filters = [
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { id: 'disputed', label: 'Disputed', count: orders.filter(o => o.status === 'Disputed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
    { id: 'all', label: 'All Orders', count: orders.length }
  ];

  const filteredOrders = orders.filter(order => {
    if (selectedFilter !== 'all' && order.status.toLowerCase() !== selectedFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.productName.toLowerCase().includes(query) ||
        order.buyer.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Disputed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      case 'Disputed':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrderAction = (orderId: number, action: string) => {
    console.log(`${action} order ${orderId}`);
    // Implement order action logic
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Moderation</h2>
            <p className="text-gray-600">Monitor and manage platform orders and transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by product, buyer, or seller..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Filters */}
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

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parties
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                {/* Order Details Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500">{order.category}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                        <MapPin className="w-3 h-3 text-gray-400 ml-2" />
                        <span className="text-xs text-gray-600">{order.location}</span>
                      </div>
                      {order.trackingId && (
                        <div className="text-xs text-blue-600 mt-1">
                          Tracking: {order.trackingId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Parties Column */}
                <td className="py-4 px-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Buyer</div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{order.buyer}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Seller</div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{order.seller}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.deliveryDate && (
                    <div className="text-xs text-gray-600 mt-2">
                      Delivered: {new Date(order.deliveryDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </td>

                {/* Amount Column */}
                <td className="py-4 px-4">
                  <div className="font-bold text-gray-900">
                    {order.type === 'Donation' ? 'FREE' : `KSh ${order.price.toLocaleString()}`}
                  </div>
                  {order.type === 'Resale' && (
                    <div className="text-xs text-green-600">
                      Commission: KSh {(order.price * 0.05).toLocaleString()}
                    </div>
                  )}
                </td>

                {/* Actions Column */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOrderAction(order.id, 'view')}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 justify-center"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="text-xs">Details</span>
                    </button>
                    
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'ship')}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 justify-center"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Mark Shipped</span>
                      </button>
                    )}
                    
                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'deliver')}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                    
                    {order.status === 'Disputed' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'resolve')}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Resolve Dispute
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleOrderAction(order.id, 'message')}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors flex items-center gap-1 justify-center"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-xs">Message</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {orders.filter(o => o.type === 'Resale').reduce((sum, order) => sum + order.price, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Volume</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {(orders.filter(o => o.type === 'Resale').reduce((sum, order) => sum + order.price, 0) * 0.05).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Commission</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
            <div className="text-xs text-gray-600">Completed Orders</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.status === 'Disputed').length}
            </div>
            <div className="text-xs text-gray-600">Open Disputes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModeration;