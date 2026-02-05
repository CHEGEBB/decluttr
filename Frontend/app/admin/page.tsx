/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminLogin,
  AdminSidebar,
  AdminStats,
  UserManagement,
  ProductVerification,
  OrderModeration,
  ReportsAnalytics
} from '@/components/admin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  // Check authentication on mount - prevent double-run in strict mode
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = () => {
      try {
        const auth = sessionStorage.getItem('adminAuthenticated');
        const token = sessionStorage.getItem('token');
        const user = sessionStorage.getItem('user');
        
        // Only authenticate if ALL three exist
        if (auth === 'true' && token && user) {
          const userData = JSON.parse(user);
          if (userData.role === 'admin') {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear corrupted data
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } finally {
        setIsChecking(false);
      }
    };

    // Small delay to prevent flicker
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    hasCheckedAuth.current = false;
    router.push('/');
  };

  // Show loading screen while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin setIsAuthenticated={setIsAuthenticated} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductVerification />;
      case 'orders':
        return <OrderModeration />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">Commission Rate (%)</div>
                    <input
                      type="number"
                      defaultValue="5"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">Shipping Fee (KES)</div>
                    <input
                      type="number"
                      defaultValue="600"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">Max Upload Size (MB)</div>
                    <input
                      type="number"
                      defaultValue="10"
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">Auto-verify threshold</div>
                    <input
                      type="number"
                      defaultValue="10"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Alerts</h2>
            <div className="space-y-4">
              {[
                { title: 'Multiple Failed Login Attempts', desc: 'IP: 192.168.1.45', time: '2 hours ago', severity: 'high' },
                { title: 'Unusual Activity Detected', desc: 'User attempted to access admin panel', time: '5 hours ago', severity: 'medium' },
                { title: 'Large File Upload', desc: 'File size exceeded normal limits', time: '1 day ago', severity: 'low' }
              ].map((alert, i) => (
                <div key={i} className={`p-4 border rounded-lg ${
                  alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{alert.time}</span>
                      <div className={`text-xs font-semibold mt-1 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 flex-shrink-0">
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}