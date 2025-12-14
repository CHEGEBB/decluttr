'use client';

import { TrendingUp, Users, Star, DollarSign } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Income',
      value: 'KSh 245,800',
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'Total Exchanges',
      value: '47',
      change: '+8.2%',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'User Ratings',
      value: '4.8',
      change: '+0.3',
      icon: Star,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      trend: 'up'
    },
    {
      title: 'Active Listings',
      value: '18',
      change: '+3',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={`text-sm font-semibold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.title}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Last 30 days
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;