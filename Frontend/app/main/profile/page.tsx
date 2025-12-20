/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { 
  ProfileSidebar,
  StatsCards,
  ListedItems,
  ProductListForm,
  OrderHistory
} from '@/components/profile';

interface UpdateProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cartCount, setCartCount] = useState(0);
  const { user, logout, isAuthenticated, updateProfile } = useAuth();
  const { getMyProducts, myProducts, isLoading: productsLoading } = useProducts();
  
  // Form states for profile update
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phoneNumber: '',
    location: ''
  });
  
  // Form states for password change
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    const savedTab = localStorage.getItem('profileActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profileActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      getMyProducts();
    }
  }, [isAuthenticated, activeTab]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        location: user.location || 'Nairobi'
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

// Update the handleUpdateProfile function in page.tsx:

const handleUpdateProfile = async () => {
  if (!profileForm.name.trim()) {
    alert('Name is required');
    return;
  }

  if (!profileForm.email.trim()) {
    alert('Email is required');
    return;
  }

  if (!profileForm.phoneNumber.trim()) {
    alert('Phone number is required');
    return;
  }

  setIsUpdatingProfile(true);
  try {
    let profileImageData = null;

    // Upload profile image if selected
    if (profileImage) {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      // Upload image to backend
      const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/upload-profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('decluttr_token')}`
        },
        body: formData
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to upload profile image');
      }

      const imageResult = await imageResponse.json();
      if (imageResult.success && imageResult.data?.profileImage) {
        profileImageData = imageResult.data.profileImage;
      }
    }

    // Update profile with all data including image
    const profileData: any = {
      name: profileForm.name,
      email: profileForm.email,
      phoneNumber: profileForm.phoneNumber,
      location: profileForm.location
    };

    if (profileImageData) {
      profileData.profileImage = profileImageData;
    }

    // Update profile in backend
    await updateProfile(profileData);
    
    alert('Profile updated successfully!');
    
    // Refresh page to show updated data
    window.location.reload();
  } catch (error: any) {
    console.error('Update profile error:', error);
    alert(error.message || 'Failed to update profile');
  } finally {
    setIsUpdatingProfile(false);
  }
};
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword.trim()) {
      alert('Current password is required');
      return;
    }

    if (!passwordForm.newPassword.trim()) {
      alert('New password is required');
      return;
    }

    if (!passwordForm.confirmPassword.trim()) {
      alert('Please confirm your new password');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Call backend API to change password
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('decluttr_token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      alert('Password changed successfully!');
      
      // Clear password fields
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      alert(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">Here&apos;s what&apos;s happening with your account.</p>
            </div>
            <StatsCards 
              user={user} 
              productCount={myProducts.length} 
            />
            <ListedItems 
              products={myProducts}
              loading={productsLoading}
              onEditProduct={(id) => {
                console.log('Edit product:', id);
                // Navigate to edit product page or open modal
              }}
              onDeleteProduct={(id) => {
                console.log('Delete product:', id);
                // Implement delete logic
              }}
            />
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
              <button 
                onClick={() => window.location.href = '/main/messages'}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
              >
                Go to Messages
              </button>
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
            
            {/* Edit Profile Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
              
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      <div className="px-4 py-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors">
                        Upload Photo
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select 
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="Nairobi">Nairobi, Kenya</option>
                    <option value="Mombasa">Mombasa, Kenya</option>
                    <option value="Kisumu">Kisumu, Kenya</option>
                    <option value="Eldoret">Eldoret, Kenya</option>
                    <option value="Nakuru">Nakuru, Kenya</option>
                    <option value="Thika">Thika, Kenya</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </div>
            
            {/* Change Password Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <button 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <StatsCards user={user} productCount={myProducts.length} />
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your profile</h1>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar onSearch={handleSearch} />
      
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
                <div className="text-xl font-black">KSh {user?.totalIncome?.toLocaleString() || '0'}</div>
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
              user={user}
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