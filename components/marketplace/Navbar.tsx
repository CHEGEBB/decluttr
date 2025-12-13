// components/marketplace/Navbar.tsx
'use client';

import { useState } from 'react';
import { Search, ShoppingCart, MessageCircle, User, LogOut, Menu } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

export function Navbar({ cartCount, onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Products', href: '/products' },
    { label: 'Pages', href: '/pages' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
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
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} className="block text-gray-700 hover:text-red-600 font-semibold py-2">
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t">
                  <a href="/messages" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                  </a>
                  <a href="/cart" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart ({cartCount})
                  </a>
                  <a href="/profile" className="flex items-center text-gray-700 hover:text-red-600 py-2">
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </a>
                  <button className="flex items-center text-gray-700 hover:text-red-600 py-2 w-full">
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
              <Image
                src="/assets/logodark.png"
                alt="Decluttr Logo"
                width={140}
                height={45}
                className="hidden lg:block"
              />
              <Image
                src="/assets/logodark.png"
                alt="Decluttr Logo"
                width={100}
                height={35}
                className="lg:hidden"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="text-gray-700 hover:text-red-600 font-semibold transition-colors">
                  {item.label}
                </a>
              ))}
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

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              <button className="relative text-gray-700 hover:text-red-600 transition-colors hidden lg:block">
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </button>
              <button className="relative text-gray-700 hover:text-red-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="text-gray-700 hover:text-red-600 transition-colors hidden lg:block">
                <User className="w-6 h-6" />
              </button>
              <button className="text-gray-700 hover:text-red-600 transition-colors hidden lg:block">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}