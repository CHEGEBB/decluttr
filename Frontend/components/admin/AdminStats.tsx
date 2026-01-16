'use client';

import { useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminStats = () => {
  const { 
    dashboard, 
    platformStats, 
    isLoading, 
    error,
    getDashboard,
    getPlatformStats 
  } = useAdmin();

  useEffect(() => {
    getDashboard();
    getPlatformStats();
  }, [getDashboard, getPlatformStats]);

  const handleRefresh = () => {
    getDashboard();
    getPlatformStats();
  };

  // Helper function to calculate safe percentage
  const calculatePercentage = (part: number, total: number): string => {
    if (!total || total === 0) return '0.0';
    const percentage = (part / total) * 100;
    return Math.min(Math.max(percentage, 0), 100).toFixed(1);
  };

  // Helper function to normalize metric values (handle both decimal 0.8 and percentage 80 formats)
  const normalizeMetric = (value: number): number => {
    // If value is greater than 1, assume it's already a percentage
    if (value > 1) return Math.min(value, 100);
    // If value is between 0 and 1, convert to percentage
    return Math.min(value * 100, 100);
  };

  // Helper function to format large numbers
  const formatNumber = (num: number): string => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  // Calculate stats from dashboard data
  const stats = dashboard ? [
    {
      title: 'Total Users',
      value: dashboard.stats.totalUsers.toLocaleString(),
      change: dashboard.stats.totalUsers > 0 
        ? `${calculatePercentage(dashboard.stats.activeUsers, dashboard.stats.totalUsers)}% active`
        : 'No data',
      icon: Users,
      color: 'bg-blue-500',
      trend: 'neutral',
      subValue: `${dashboard.stats.activeUsers.toLocaleString()} active users`
    },
    {
      title: 'Total Products',
      value: dashboard.stats.totalProducts.toLocaleString(),
      change: dashboard.stats.totalProducts > 0
        ? `${calculatePercentage(dashboard.stats.verifiedProducts, dashboard.stats.totalProducts)}% verified`
        : 'No data',
      icon: Package,
      color: 'bg-emerald-500',
      trend: 'neutral',
      subValue: `${dashboard.stats.verifiedProducts.toLocaleString()} verified`
    },
    {
      title: 'Total Orders',
      value: dashboard.stats.totalOrders.toLocaleString(),
      change: dashboard.stats.totalOrders > 0
        ? `${calculatePercentage(dashboard.stats.completedOrders, dashboard.stats.totalOrders)}% completed`
        : 'No data',
      icon: ShoppingBag,
      color: 'bg-purple-500',
      trend: 'neutral',
      subValue: `${dashboard.stats.completedOrders.toLocaleString()} completed`
    },
    {
      title: 'Total Revenue',
      value: `KSh ${formatNumber(dashboard.stats.totalRevenue)}`,
      change: dashboard.metrics.averageOrderValue > 0
        ? `Avg: KSh ${formatNumber(dashboard.metrics.averageOrderValue)}`
        : 'No data',
      icon: DollarSign,
      color: 'bg-amber-500',
      trend: 'neutral',
      subValue: `${dashboard.stats.totalExchanges.toLocaleString()} exchanges`
    },
    {
      title: 'Pending Verification',
      value: dashboard.stats.pendingProducts.toLocaleString(),
      change: dashboard.stats.totalProducts > 0
        ? `${calculatePercentage(dashboard.stats.pendingProducts, dashboard.stats.totalProducts)}% of total`
        : 'No data',
      icon: AlertCircle,
      color: 'bg-rose-500',
      trend: dashboard.stats.pendingProducts > 50 ? 'up' : 'down',
      subValue: 'Needs review'
    },
    {
      title: 'Pending Orders',
      value: dashboard.stats.pendingOrders.toLocaleString(),
      change: dashboard.stats.totalOrders > 0
        ? `${calculatePercentage(dashboard.stats.pendingOrders, dashboard.stats.totalOrders)}% of total`
        : 'No data',
      icon: Clock,
      color: 'bg-violet-500',
      trend: dashboard.stats.pendingOrders > 20 ? 'up' : 'down',
      subValue: 'Processing'
    }
  ] : [];

  // Calculate platform metrics with proper normalization
  const platformMetrics = dashboard ? [
    { 
      label: 'Active User Rate', 
      value: normalizeMetric(dashboard.metrics.activeUserRate).toFixed(1),
      color: 'bg-green-500',
      target: 80,
      current: normalizeMetric(dashboard.metrics.activeUserRate)
    },
    { 
      label: 'Conversion Rate', 
      value: normalizeMetric(dashboard.metrics.conversionRate).toFixed(1),
      color: 'bg-blue-500',
      target: 5,
      current: normalizeMetric(dashboard.metrics.conversionRate)
    },
    { 
      label: 'Product Verification', 
      value: normalizeMetric(dashboard.metrics.productVerificationRate).toFixed(1),
      color: 'bg-purple-500',
      target: 90,
      current: normalizeMetric(dashboard.metrics.productVerificationRate)
    },
    { 
      label: 'Avg Order Value', 
      value: dashboard.metrics.averageOrderValue > 0 
        ? (dashboard.metrics.averageOrderValue / 1000).toFixed(1)
        : '0.0',
      color: 'bg-amber-500',
      target: 5,
      suffix: 'K',
      current: dashboard.metrics.averageOrderValue / 1000
    }
  ] : [];

  // Loading state
  if (isLoading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm md:text-base">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboard) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm md:text-base">Error Loading Dashboard</h3>
            <p className="text-xs md:text-sm mt-1 break-words">{error}</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data state
  if (!dashboard) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">Real-time statistics and platform performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="text-xs md:text-sm text-gray-600">
            Last Updated: <span className="font-semibold">Just now</span>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-bold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4 inline mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Activity className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-red-600' : stat.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.trend === 'up' && <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />}
                  {stat.trend === 'down' && <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />}
                  <span className="break-words text-right">{stat.change}</span>
                </div>
              </div>
              
              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1 break-words">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600">{stat.title}</div>
              </div>
              
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 break-words">
                  {stat.subValue}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Metrics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Platform Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {platformMetrics.map((metric, index) => {
            const progressPercentage = metric.suffix 
              ? Math.min((parseFloat(metric.value) / metric.target) * 100, 100)
              : Math.min(parseFloat(metric.value), 100);
            
            const difference = metric.current - metric.target;
            const isAboveTarget = difference >= 0;
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700 break-words flex-1">{metric.label}</span>
                  <span className="text-base md:text-lg font-bold text-gray-900 flex-shrink-0">
                    {metric.value}{metric.suffix || '%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}{metric.suffix || '%'}</span>
                  <span className={isAboveTarget ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {isAboveTarget ? '+' : ''}
                    {difference.toFixed(1)}{metric.suffix || '%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Active Users */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-900 text-sm md:text-base">Active Users</h4>
              <p className="text-xs md:text-sm text-gray-600">Currently online</p>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900 mb-2 break-words">
            {dashboard.stats.activeUsers.toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-700 font-semibold">
            {calculatePercentage(dashboard.stats.activeUsers, dashboard.stats.totalUsers)}% of total users
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-900 text-sm md:text-base">Revenue Stats</h4>
              <p className="text-xs md:text-sm text-gray-600">Financial overview</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs md:text-sm text-gray-700">Total Revenue</span>
              <span className="font-bold text-gray-900 text-sm md:text-base break-words text-right">
                KSh {formatNumber(dashboard.stats.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs md:text-sm text-gray-700">Avg Order Value</span>
              <span className="font-bold text-gray-900 text-sm md:text-base break-words text-right">
                KSh {formatNumber(dashboard.metrics.averageOrderValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-900 text-sm md:text-base">Order Overview</h4>
              <p className="text-xs md:text-sm text-gray-600">Current status</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-700">Completed</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded whitespace-nowrap">
                {dashboard.stats.completedOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-700">Pending</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded whitespace-nowrap">
                {dashboard.stats.pendingOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-700">Success Rate</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded whitespace-nowrap">
                {calculatePercentage(dashboard.stats.completedOrders, dashboard.stats.totalOrders)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;