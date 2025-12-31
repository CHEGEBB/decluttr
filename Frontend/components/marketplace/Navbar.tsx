// components/marketplace/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MessageCircle, User, LogOut, Menu, Home, Store, Phone, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useCartContext } from '@/context/CartContext';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { conversations, loading } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadCount = conversations.filter(conv => conv.unread).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { cartCount, isLoading: cartLoading } = useCartContext();

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const navItems = [
    { label: 'Home', href: '/main/marketplace', icon: Home },
    { label: 'Shop', href: '/main/shop', icon: Store },
    { label: 'Contact', href: '/main/contact', icon: Phone },
  ];

  const CartCountBadge = () => {
    if (cartLoading) {
      return (
        <span className="absolute -top-1 left-3 w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
      );
    }
    
    if (cartCount > 0) {
      return (
        <span className="absolute -top-1 left-3 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-fadeIn">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {authLoading ? (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Logging Out...</h3>
                <p className="text-gray-600">Please wait while we end your session</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <Image
                  src="/assets/logodark.png"
                  alt="Decluttr Logo"
                  width={120}
                  height={40}
                />
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.label} 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-red-600 font-semibold py-2"
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t">
                 <Link 
        href="/main/messages" 
        className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors relative"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold">Messages</span>
        {!loading && unreadCount > 0 && (
          <span className="absolute -top-1 left-3 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link> 
                  <Link 
                    href="/main/cart" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-gray-700 hover:text-red-600 py-2 relative"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart
                    {!cartLoading && cartCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        href="/main/profile" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-gray-700 hover:text-red-600 py-2"
                      >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                        {user?.name && (
                          <span className="ml-auto text-sm font-medium text-gray-600">
                            {user.name.split(' ')[0]}
                          </span>
                        )}
                      </Link>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="flex items-center text-gray-700 hover:text-red-600 py-2 w-full"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      className="flex items-center text-gray-700 hover:text-red-600 py-2 w-full"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Login / Signup
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-4 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/main">
                <Image
                  src="/assets/logodark.png"
                  alt="Decluttr Logo"
                  width={140}
                  height={45}
                  className="hidden lg:block cursor-pointer"
                />
              </Link>
              <Link href="/main">
                <Image
                  src="/assets/logodark.png"
                  alt="Decluttr Logo"
                  width={100}
                  height={35}
                  className="lg:hidden cursor-pointer"
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-semibold transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex-1 max-w-xl mx-4 lg:mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for items..."
                  className="w-full pl-4 pr-12 py-2 border-2 text-gray-500 placeholder:text-gray-500 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                 <Link 
        href="/main/messages" 
        className="flex items-center text-gray-700 hover:text-red-600 py-2 relative"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MessageCircle className="w-5 h-5 mr-3" />
        <span className="font-semibold">Messages</span>
        {!loading && unreadCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
              
              <Link href="/main/cart" className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="hidden lg:inline font-semibold">Cart</span>
                <CartCountBadge />
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/main/profile" className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="font-semibold">
                      {user?.name ? user.name.split(' ')[0] : 'Profile'}
                    </span>
                  </Link>
                  
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="font-semibold">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}