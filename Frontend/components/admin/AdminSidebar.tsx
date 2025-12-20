'use client';

import { 
  Shield, 
  Users, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Activity,
  AlertCircle,
  Home,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: 5 },
    { id: 'products', label: 'Product Verification', icon: Package, badge: 12 },
    { id: 'orders', label: 'Order Moderation', icon: ShoppingBag, badge: 8 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
    { id: 'alerts', label: 'Security Alerts', icon: AlertCircle, badge: 3 }
  ];

  const systemStats = {
    uptime: '99.8%',
    responseTime: '128ms',
    activeUsers: '1,245',
    serverLoad: '42%'
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white h-full lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Decluttr Admin</h1>
            <p className="text-xs text-gray-400">Super Admin Access</p>
          </div>
        </div>

        {/* Admin Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Logged in as:</span>
            <span className="text-sm font-medium">admin@decluttr.com</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Access Level:</span>
            <span className="px-2 py-1 bg-red-600 text-xs font-bold rounded">Super Admin</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Last Login:</span>
            <span className="text-sm">Today, 14:30</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Dashboard
        </h3>
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-900/50 to-orange-900/30 text-white border border-red-700/50'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span className="w-6 h-6 bg-red-600 text-xs flex items-center justify-center rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Stats */}
      <div className="p-4 border-t border-white/10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          System Status
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Uptime</div>
            <div className="text-sm font-bold text-green-400">{systemStats.uptime}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Response Time</div>
            <div className="text-sm font-bold text-blue-400">{systemStats.responseTime}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Active Users</div>
            <div className="text-sm font-bold">{systemStats.activeUsers}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Server Load</div>
            <div className="text-sm font-bold text-amber-400">{systemStats.serverLoad}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-white/10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-green-600/20 text-green-400 text-sm font-medium rounded-lg hover:bg-green-600/30 transition-colors">
            Approve All Pending
          </button>
          <button className="w-full px-3 py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-colors">
            Generate Daily Report
          </button>
          <button className="w-full px-3 py-2 bg-red-600/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-600/30 transition-colors">
            View Security Logs
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Admin Portal v1.0.0</p>
          <p className="text-xs text-gray-600">Secure • Encrypted • Monitored</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;