/* eslint-disable react-hooks/purity */
'use client';

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
  Activity
} from 'lucide-react';

const AdminStats = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '10,245',
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: '45,678',
      change: '+8.2%',
      icon: Package,
      color: 'from-green-500 to-emerald-500',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: '23,456',
      change: '+15.3%',
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500',
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: 'KSh 12.5M',
      change: '+22.1%',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
      trend: 'up'
    },
    {
      title: 'Pending Verification',
      value: '124',
      change: '-3.2%',
      icon: AlertCircle,
      color: 'from-red-500 to-rose-500',
      trend: 'down'
    },
    {
      title: 'Avg Response Time',
      value: '2.4m',
      change: '-15%',
      icon: Clock,
      color: 'from-indigo-500 to-violet-500',
      trend: 'down'
    }
  ];

  const platformMetrics = [
    { label: 'User Satisfaction', value: 94, color: 'bg-green-500' },
    { label: 'Platform Uptime', value: 99.8, color: 'bg-blue-500' },
    { label: 'Transaction Success', value: 98.2, color: 'bg-purple-500' },
    { label: 'Fraud Prevention', value: 99.5, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-gray-600">Real-time statistics and platform performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Last Updated: <span className="font-semibold">Just now</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
            <Activity className="w-4 h-4 inline mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Today: {stat.trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 100)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Metrics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <span className="text-lg font-bold text-gray-900">{metric.value}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Target: 95%</span>
                <span>+{metric.value - 95}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Active Users Now</h4>
              <p className="text-sm text-gray-600">Real-time count</p>
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-2">1,245</div>
          <div className="text-sm text-green-600 font-semibold">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +128 from yesterday
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Peak Hours</h4>
              <p className="text-sm text-gray-600">Highest activity</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">7:00 PM - 9:00 PM</span>
              <span className="font-bold text-gray-900">4,567 users</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">12:00 PM - 2:00 PM</span>
              <span className="font-bold text-gray-900">3,890 users</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">System Health</h4>
              <p className="text-sm text-gray-600">All systems operational</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">API Response</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">128ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Payment Gateway</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;