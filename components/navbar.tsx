// components/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeItem, setActiveItem] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Sell', href: '/sell' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center relative z-10">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {scrolled ? (
                <Image
                  src="/assets/logodark.png"
                  alt="Decluttr Logo"
                  width={160}
                  height={50}
                  priority
                />
              ) : (
                <Image
                  src="/assets/logolight.png"
                  alt="Decluttr Logo"
                  width={160}
                  height={50}
                  priority
                />
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onMouseEnter={() => setActiveItem(item.label)}
                  onMouseLeave={() => setActiveItem('')}
                  className={`relative text-base font-semibold transition-colors duration-300 ${
                    scrolled
                      ? 'text-gray-700 hover:text-[#DB362D]'
                      : 'text-white hover:text-[#10B981]'
                  }`}
                >
                  {item.label}
                  {activeItem === item.label && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: scrolled ? '#DB362D' : '#10B981' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <motion.div 
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                scrolled
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white/10 backdrop-blur-md border-white/30'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Search className={`w-5 h-5 ${scrolled ? 'text-gray-600' : 'text-white'}`} />
              <input
                type="text"
                placeholder="Search items..."
                className={`bg-transparent border-none outline-none w-48 placeholder:text-sm ${
                  scrolled
                    ? 'text-gray-700 placeholder:text-gray-400'
                    : 'text-white placeholder:text-white/70'
                }`}
              />
            </motion.div>
            
            {/* Cart Button */}
            <motion.button 
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                scrolled
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ShoppingCart className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            </motion.button>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  scrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                    : 'bg-white/20 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/30'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </motion.div>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                style={{ backgroundColor: '#DB362D', color: 'white' }}
              >
                Get Started
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 mb-4">
                <Search className="w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="bg-transparent border-none outline-none w-full text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-4 border-t mt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  
                  <Link
                    href="/signup"
                    className="block w-full text-center px-6 py-3 text-white rounded-xl transition-all font-bold shadow-lg"
                    style={{ backgroundColor: '#DB362D' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}