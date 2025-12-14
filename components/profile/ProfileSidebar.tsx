'use client';

import { 
  User, 
  Mail, 
  MapPin, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  MessageCircle,
  Package,
  Bell,
  Shield,
  Edit
} from 'lucide-react';
import Image from 'next/image';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const ProfileSidebar = ({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
  const userData = {
    name: 'John Mwangi',
    email: 'john@declutrr.com',
    location: 'Nairobi, Kenya',
    phone: '+254 712 345 678',
    joinDate: 'Jan 2024',
    rating: 4.8,
    verified: true
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'list-item', label: 'List Product', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleMessages = () => {
    window.location.href = '/main/messages';
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 bg-red-400 rounded-full mx-auto flex items-center justify-center">
            <Image
                src="https://images.unsplash.com/photo-1659422440915-d516c6dc932e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFmcmljYW4lMjBtYW58ZW58MHx8MHx8fDA%3D"
                alt="Profile Picture"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-3 border-emerald-400"
            />
          </div>
          {userData.verified && (
            <div className="absolute bottom-2 right-6 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h2>
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(userData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">({userData.rating})</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{userData.location}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Member since {userData.joinDate}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="space-y-1 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold border border-red-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.id === 'messages' && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-red-500 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Items Listed</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">8</div>
            <div className="text-xs text-gray-600">Items Sold</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">5</div>
            <div className="text-xs text-gray-600">Donations</div>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">KSh 45,000</div>
            <div className="text-xs text-gray-600">Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;