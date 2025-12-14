// components/marketplace/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MessageCircle, User, LogOut, Menu, Home, Store, Package, Phone, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

export function Navbar({ cartCount, onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to login page
    router.push('/login');
  };

  const navItems = [
    { label: 'Home', href: '/main/marketplace', icon: Home },
    { label: 'Shop', href: '/main/shop', icon: Store },
    { label: 'Contact', href: '/main/contact', icon: Phone },
  ];

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {isLoggingOut ? (
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Ended</h3>
                <p className="text-gray-600 mb-6">You have been successfully logged out</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Continue to Login
                </button>
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
                    <Link key={item.label} href={item.href} className="flex items-center text-gray-700 hover:text-red-600 font-semibold py-2">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t">
                  <Link href="/main/messages" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </Link>
                  <Link href="/main/cart" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
                    )}
                  </Link>
                  <Link href="/main/profile" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <User className="w-5 h-5 mr-3" />
                    Profile
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
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

            {/* Desktop Navigation */}
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

            {/* Search Bar */}
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

            {/* Right Side Icons with Labels */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/main/messages" className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors relative">
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold">Messages</span>
                <span className="absolute -top-1 left-3 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </Link>
              
              <Link href="/main/cart" className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="hidden lg:inline font-semibold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-3 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link href="/main/profile" className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="font-semibold">Profile</span>
              </Link>
              
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}