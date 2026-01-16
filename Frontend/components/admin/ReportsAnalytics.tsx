'use client';

import { useEffect, useState } from 'react';
import { 
  Download, 
  TrendingUp, 
  Users,
  ShoppingBag,
  DollarSign,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  XCircle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportsAnalytics = () => {
  const { 
    dashboard, 
    orders, 
    users, 
    platformStats,
    isLoading, 
    error, 
    getDashboard, 
    getAllOrders, 
    getAllUsers,
    getPlatformStats,
    clearError 
  } = useAdmin();
  
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    getDashboard();
    getAllOrders();
    getAllUsers();
    getPlatformStats();
  }, []);

  // Calculate analytics from real data
  const analytics = {
    totalRevenue: dashboard?.stats.totalRevenue || 0,
    totalOrders: dashboard?.stats.totalOrders || 0,
    totalUsers: dashboard?.stats.totalUsers || 0,
    pendingOrders: dashboard?.stats.pendingOrders || 0,
    completedOrders: dashboard?.stats.completedOrders || 0,
    avgOrderValue: orders.length > 0 
      ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length 
      : 0,
  };

  // Revenue by Month Chart Data
  const revenueByMonth = platformStats?.revenueByMonth || [];
  const monthlyRevenueData = {
    labels: revenueByMonth.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    }),
    datasets: [
      {
        label: 'Revenue (KSh)',
        data: revenueByMonth.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Orders by Month Chart Data
  const ordersChartData = {
    labels: revenueByMonth.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]}`;
    }),
    datasets: [
      {
        label: 'Orders',
        data: revenueByMonth.map(item => item.orders),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  // Products by Category Chart Data
  const productsByCategory = platformStats?.productsByCategory || [];
  const categoryChartData = {
    labels: productsByCategory.map(item => item._id),
    datasets: [
      {
        label: 'Products',
        data: productsByCategory.map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
          'rgb(236, 72, 153)',
          'rgb(14, 165, 233)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Top Locations
  const topLocations = (platformStats?.usersByLocation || []).slice(0, 5);

  // Top Sellers
  const topSellers = (platformStats?.topSellers || []).slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
      },
    },
  };

  if (isLoading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!dashboard && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-6">Analytics data will appear here once orders are placed</p>
          <button 
            onClick={() => {
              getDashboard();
              getAllOrders();
              getAllUsers();
              getPlatformStats();
            }}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm md:text-base text-gray-600">Platform insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full sm:w-auto pl-9 md:pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">This Year</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm md:text-base text-red-800 font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xs md:text-sm text-green-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              22%
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-900">
            KSh {(analytics.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Total Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xs md:text-sm text-green-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              18%
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-900">{analytics.totalOrders.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Total Orders</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xs md:text-sm text-green-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              12%
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-900">{analytics.totalUsers.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Active Users</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xs md:text-sm text-green-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              9%
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-900">
            KSh {Math.round(analytics.avgOrderValue).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Avg Order Value</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Revenue Trends</h3>
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          </div>
          {revenueByMonth.length > 0 ? (
            <div className="h-64 md:h-80">
              <Line data={monthlyRevenueData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No revenue data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Orders by Month</h3>
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
          {revenueByMonth.length > 0 ? (
            <div className="h-64 md:h-80">
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No orders data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Products by Category</h3>
          <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
        </div>
        {productsByCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 md:h-80">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
            <div className="space-y-3">
              {productsByCategory.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{item._id}</span>
                    <span className="text-sm font-semibold text-blue-600">{item.count} products</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Value: <span className="font-bold text-green-600">KSh {item.totalValue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No category data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Locations & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Locations */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Top Locations</h3>
          {topLocations.length > 0 ? (
            <div className="space-y-3">
              {topLocations.map((location, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{location._id}</div>
                        <div className="text-xs text-gray-600">{location.count} users</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">#{index + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">No location data available</p>
            </div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Top Sellers</h3>
          {topSellers.length > 0 ? (
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{seller.sellerName}</div>
                        <div className="text-xs text-gray-600">@{seller.sellerUsername}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">KSh {seller.totalSales.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{seller.orderCount} orders</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">No seller data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Insights */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Platform Insights</h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                {analytics.completedOrders} orders completed successfully
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                {analytics.pendingOrders} orders awaiting processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Average {(analytics.completedOrders / Math.max(analytics.totalUsers, 1)).toFixed(1)} orders per user
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Platform commission: KSh {(analytics.totalRevenue * 0.05).toLocaleString()}
              </li>
            </ul>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-3xl md:text-4xl font-black mb-2 text-green-400">
              {analytics.totalOrders > 1000 ? 'A+' : analytics.totalOrders > 500 ? 'A' : 'B+'}
            </div>
            <p className="text-sm md:text-base text-gray-300">Platform Health Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;