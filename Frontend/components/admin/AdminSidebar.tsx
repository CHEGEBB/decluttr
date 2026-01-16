/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { 
  Shield, 
  Users, 
  Package, 
  ShoppingBag, 
  BarChart3,
  LogOut,
  Activity,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  pendingProductsCount?: number;
  pendingOrdersCount?: number;
  activeUsersCount?: number;
}

const AdminSidebar = ({ 
  activeTab, 
  onTabChange, 
  onLogout,
  pendingProductsCount = 0,
  pendingOrdersCount = 0,
  activeUsersCount = 0
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Get admin email from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setAdminEmail(userData.email || 'admin@decluttr.com');
      } catch {
        setAdminEmail('admin@decluttr.com');
      }
    }

    // Update current time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`Today, ${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: activeUsersCount > 0 ? activeUsersCount : null },
    { id: 'products', label: 'Product Verification', icon: Package, badge: pendingProductsCount || null },
    { id: 'orders', label: 'Order Moderation', icon: ShoppingBag, badge: pendingOrdersCount || null },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null }
  ];

  const systemStats = {
    uptime: '99.8%',
    responseTime: '128ms',
    activeUsers: activeUsersCount.toLocaleString(),
    serverLoad: '42%'
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false); // Close mobile menu after selection
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-full w-80 max-w-[85vw]
          bg-gradient-to-b from-gray-900 to-black text-white
          overflow-y-auto z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">Decluttr Admin</h1>
              <p className="text-xs text-gray-400">Super Admin Access</p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-400 flex-shrink-0">Logged in as:</span>
              <span className="text-sm font-medium truncate" title={adminEmail}>
                {adminEmail}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Access Level:</span>
              <span className="px-2 py-1 bg-red-600 text-xs font-bold rounded whitespace-nowrap">
                Super Admin
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Last Login:</span>
              <span className="text-sm whitespace-nowrap">{currentTime}</span>
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
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-900/50 to-orange-900/30 text-white border border-red-700/50'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {tab.badge && tab.badge > 0 && (
                      <span className="min-w-[1.5rem] h-6 px-2 bg-red-600 text-xs flex items-center justify-center rounded-full font-semibold">
                        {tab.badge > 99 ? '99+' : tab.badge}
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
              <div className="text-xs text-gray-400 mb-1 truncate">Uptime</div>
              <div className="text-sm font-bold text-green-400">{systemStats.uptime}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1 truncate">Response</div>
              <div className="text-sm font-bold text-blue-400">{systemStats.responseTime}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1 truncate">Active Users</div>
              <div className="text-sm font-bold">{systemStats.activeUsers}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1 truncate">Server Load</div>
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
           
            <button 
              onClick={() => handleTabChange('orders')}
              className="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-orange-600/30 transition-colors"
            >
              View Orders ({pendingOrdersCount})
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
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
    </>
  );
};

export default AdminSidebar;