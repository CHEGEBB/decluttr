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
import { User as UserType } from '@/services/authService';
import { useMessages } from '@/hooks/useMessages';

interface ProfileSidebarProps {
  user: UserType | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const ProfileSidebar = ({ user, activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
  const { conversations } = useMessages();
  const unreadCount = conversations.filter(conv => (conv as any).unread).length;
  // Remove notifications tab if not in this sprint
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'list-item', label: 'List Product', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings },
    // { id: 'notifications', label: 'Notifications', icon: Bell } // Removed as per requirements
  ];

  const handleEditProfile = () => {
    onTabChange('settings');
  };

  const handleMessages = () => {
    window.location.href = '/main/messages';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 bg-red-400 rounded-full mx-auto flex items-center justify-center">
            {/* Replace with user's actual profile picture */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(user?.ratings || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">({user?.ratings?.toFixed(1) || '0.0'})</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{user?.email || 'No email provided'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{user?.location || 'Nairobi, Kenya'}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            @{user?.username || 'username'}
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
      {tab.id === 'messages' && unreadCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
        })}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button 
          onClick={handleEditProfile}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
        >
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
            <div className="text-lg font-bold text-gray-900">{user?.totalExchanges || 0}</div>
            <div className="text-xs text-gray-600">Total Exchanges</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{user?.totalIncome?.toLocaleString() || '0'}</div>
            <div className="text-xs text-gray-600">Total Income</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;