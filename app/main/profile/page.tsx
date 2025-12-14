/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { 
  ProfileSidebar,
  StatsCards,
  ListedItems,
  ProductListForm,
  OrderHistory
} from '@/components/profile';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cartCount, setCartCount] = useState(3);

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
    window.location.href = '/';
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  // Set active tab from URL or localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('profileActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('profileActiveTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your account.</p>
            </div>
            <StatsCards />
            <ListedItems />
            <OrderHistory />
          </div>
        );
      
      case 'list-item':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">List New Product</h1>
              <p className="text-gray-600">Fill in the details below to add your item to the marketplace</p>
            </div>
            <ProductListForm />
          </div>
        );
      
      case 'messages':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Communicate with buyers and sellers</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Messages Feature</h3>
              <p className="text-gray-600 mb-6">Chat functionality will be available soon!</p>
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track your purchases and donations received</p>
            </div>
            <OrderHistory />
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-gray-600">Manage your account preferences and security</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+254 712 345 678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
                        <option>Nairobi, Kenya</option>
                        <option>Mombasa, Kenya</option>
                        <option>Kisumu, Kenya</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-red-500 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-red-500 transition-colors">
                      Two-Factor Authentication
                    </button>
                    <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-red-500 transition-colors">
                      Connected Devices
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <button className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Stay updated with your account activity</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">New order received</h4>
                        <p className="text-sm text-gray-600">Someone purchased your iPhone 13 Pro</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <StatsCards />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar cartCount={cartCount} onSearch={handleSearch} />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">My Profile</h1>
              <p className="text-gray-300">Manage your account, list products, and track orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">Account Balance</div>
                <div className="text-xl font-black">KSh 45,800</div>
              </div>
              <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all">
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderContent()}
            
            {/* Quick Stats Banner */}
            {activeTab === 'dashboard' && (
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-black mb-2">Boost Your Sales</h2>
                    <p className="text-lg opacity-90">Premium listing features</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-4">Get 2x more visibility</p>
                    <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}