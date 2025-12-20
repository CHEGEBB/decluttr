/* eslint-disable react-hooks/purity */
'use client';

import { 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp, 
  Users,
  ShoppingBag,
  DollarSign,
  MapPin,
  Calendar,
  PieChart
} from 'lucide-react';

const ReportsAnalytics = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4500000 },
    { month: 'Feb', revenue: 5200000 },
    { month: 'Mar', revenue: 4800000 },
    { month: 'Apr', revenue: 6100000 },
    { month: 'May', revenue: 5500000 },
    { month: 'Jun', revenue: 7200000 },
    { month: 'Jul', revenue: 6800000 },
    { month: 'Aug', revenue: 7500000 },
    { month: 'Sep', revenue: 8200000 },
    { month: 'Oct', revenue: 7900000 },
    { month: 'Nov', revenue: 8500000 },
    { month: 'Dec', revenue: 9200000 }
  ];

  const categoryData = [
    { category: 'Electronics', value: 35, color: 'bg-blue-500' },
    { category: 'Clothes', value: 25, color: 'bg-green-500' },
    { category: 'Furniture', value: 15, color: 'bg-purple-500' },
    { category: 'Books', value: 12, color: 'bg-amber-500' },
    { category: 'Other', value: 13, color: 'bg-gray-500' }
  ];

  const topProducts = [
    { name: 'iPhone 13 Pro', sales: 245, revenue: 20825000 },
    { name: 'Laptop Dell XPS', sales: 189, revenue: 17010000 },
    { name: 'Designer Handbag', sales: 156, revenue: 7020000 },
    { name: 'Leather Jacket', sales: 134, revenue: 1675000 },
    { name: 'Smart Watch', sales: 128, revenue: 3840000 }
  ];

  const locationStats = [
    { location: 'Nairobi', users: 6245, orders: 12345, revenue: 65200000 },
    { location: 'Mombasa', users: 2345, orders: 5678, revenue: 23450000 },
    { location: 'Kisumu', users: 1567, orders: 3456, revenue: 15670000 },
    { location: 'Eldoret', users: 987, orders: 2345, revenue: 9870000 },
    { location: 'Other', users: 2101, orders: 4567, revenue: 21010000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 appearance-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +22.5%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">KSh 92M</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +18.3%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">23,456</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +12.5%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">10,245</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +8.7%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">94.2%</div>
          <div className="text-sm text-gray-600">Satisfaction Rate</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            {/* Simple bar chart representation */}
            <div className="flex items-end justify-between h-48 pt-8">
              {revenueData.slice(-6).map((item, index) => (
                <div key={index} className="flex flex-col items-center w-12">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(item.revenue / 10000000) * 100}%` }}
                  />
                  <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                  <div className="text-xs font-semibold">
                    KSh {(item.revenue / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Total Revenue: <span className="font-bold">KSh {revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <div className="flex items-center justify-center h-full">
              {/* Pie chart representation */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                {categoryData.map((item, index) => {
                  const total = categoryData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = (item.value / total) * 100;
                  const rotation = categoryData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
                  
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 ${item.color} opacity-${80 - index * 10}`}
                      style={{
                        clipPath: `conic-gradient(${item.color} ${rotation}deg, transparent ${rotation + percentage}deg)`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`} />
                  <span className="text-sm text-gray-700">{item.category}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.sales} sales</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">KSh {(product.revenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-green-600">
                    +{Math.floor(Math.random() * 20) + 10}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance by Location</h3>
          <div className="space-y-4">
            {locationStats.map((location, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{location.location}</span>
                  </div>
                  <div className="text-sm text-gray-600">{location.users} users</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Orders</div>
                    <div className="font-semibold">{location.orders.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="font-semibold">KSh {(location.revenue / 1000000).toFixed(1)}M</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Platform Insights</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Peak transaction hours: 7 PM - 9 PM</li>
              <li>• Electronics category drives 35% of total revenue</li>
              <li>• Mobile app contributes 68% of total orders</li>
              <li>• User satisfaction increased by 8% this quarter</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black mb-2">A+</div>
            <p className="text-gray-300">Platform Health Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;