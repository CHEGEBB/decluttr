'use client';

import { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Star
} from 'lucide-react';

interface Order {
  id: number;
  productName: string;
  productImage: string;
  category: string;
  type: 'Resale' | 'Donation';
  receiver: string;
  price: number;
  status: 'Delivered' | 'Shipping' | 'Pending' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
  quantity: number;
  rating?: number;
}

const OrderHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const orders: Order[] = [
    {
      id: 1,
      productName: 'iPhone 13 Pro',
      productImage: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w-400&h-400&fit=crop',
      category: 'Electronics',
      type: 'Resale',
      receiver: 'Jane Smith',
      price: 85000,
      status: 'Delivered',
      orderDate: '2024-12-05',
      deliveryDate: '2024-12-08',
      quantity: 1,
      rating: 5
    },
    {
      id: 2,
      productName: 'Leather Jacket',
      productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w-400&h-400&fit=crop',
      category: 'Clothes',
      type: 'Resale',
      receiver: 'John Doe',
      price: 12500,
      status: 'Shipping',
      orderDate: '2024-12-10',
      deliveryDate: '2024-12-15',
      quantity: 1
    },
    {
      id: 3,
      productName: 'Nike Air Max',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w-400&h-400&fit=crop',
      category: 'Shoes',
      type: 'Resale',
      receiver: 'Mike Johnson',
      price: 13500,
      status: 'Pending',
      orderDate: '2024-12-12',
      quantity: 1
    },
    {
      id: 4,
      productName: 'Book Collection',
      productImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w-400&h-400&fit=crop',
      category: 'Books',
      type: 'Donation',
      receiver: 'Community Library',
      price: 0,
      status: 'Delivered',
      orderDate: '2024-12-01',
      deliveryDate: '2024-12-03',
      quantity: 5,
      rating: 4
    },
    {
      id: 5,
      productName: 'Study Desk',
      productImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w-400&h=400&fit=crop',
      category: 'Furniture',
      type: 'Resale',
      receiver: 'Sarah Williams',
      price: 28000,
      status: 'Cancelled',
      orderDate: '2024-11-28',
      quantity: 1
    }
  ];

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'shipping', label: 'Shipping', count: orders.filter(o => o.status === 'Shipping').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === selectedFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
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
    switch (status) {
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
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order History</h2>
            <p className="text-gray-600">Track your sales and donations</p>
          </div>
          <div className="text-sm text-gray-600">
            Total Orders: <span className="font-bold">{orders.length}</span>
          </div>
        </div>
      </div>

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
                Product
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
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
                {/* Product Column */}
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
                      <div className="text-xs text-gray-400">
                        Qty: {order.quantity} • {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Details Column */}
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-500">Type: </span>
                      <span className={`font-medium ${
                        order.type === 'Donation' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {order.type}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">To: </span>
                      <span className="font-medium text-gray-900">{order.receiver}</span>
                    </div>
                    {order.deliveryDate && (
                      <div className="text-sm">
                        <span className="text-gray-500">Delivered: </span>
                        <span className="font-medium text-gray-900">{formatDate(order.deliveryDate)}</span>
                      </div>
                    )}
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
                  {order.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < order.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </td>

                {/* Amount Column */}
                <td className="py-4 px-4">
                  <div className="font-bold text-gray-900">
                    {order.type === 'Donation' ? 'FREE' : `KSh ${order.price.toLocaleString()}`}
                  </div>
                  {order.type === 'Resale' && (
                    <div className="text-xs text-green-600 font-medium">
                      + KSh {(order.price * 0.95).toLocaleString()} after fees
                    </div>
                  )}
                </td>

                {/* Actions Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Message Buyer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {order.status === 'Shipping' && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Track
                      </button>
                    )}
                    {order.status === 'Delivered' && !order.rating && (
                      <button className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                        Rate
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
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">You haven&apos;t received any orders yet</p>
        </div>
      )}

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {orders.filter(o => o.type === 'Resale').reduce((sum, order) => sum + order.price, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
            <div className="text-xs text-gray-600">Completed Orders</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.type === 'Donation').length}
            </div>
            <div className="text-xs text-gray-600">Donations Made</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;