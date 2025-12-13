import React, { useState } from 'react';
import { ShoppingBag, CreditCard, MessageSquare, User, Package, Search } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Smart Marketplace',
    description: 'Browse through multiple categories including Books, Electronics, Shoes, Clothes, and Furniture. Filter items by resale or donation options.',
    color: '#DB362D',
    number: '01'
  },
  {
    icon: CreditCard,
    title: 'M-Pesa Integration',
    description: 'Secure payment processing through M-Pesa for all resale transactions with automated checkout flow.',
    color: '#10B981',
    number: '02'
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'Connect directly with sellers to negotiate prices, ask questions, and coordinate exchanges through built-in chat.',
    color: '#3B82F6',
    number: '03'
  },
  {
    icon: User,
    title: 'User Dashboard',
    description: 'Track your listed items, manage incoming orders, and monitor your exchanges all in one place.',
    color: '#DB362D',
    number: '04'
  },
  {
    icon: Package,
    title: 'Product Listings',
    description: 'Easily list items for resale or donation with photos, descriptions, and category selection.',
    color: '#10B981',
    number: '05'
  },
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Quickly find what you need with category filters and search functionality across all listings.',
    color: '#3B82F6',
    number: '06'
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-24 relative">
          <div className="relative">
            {/* Large background text */}
            <div 
              className="absolute text-7xl sm:text-8xl md:text-9xl font-black text-gray-100 whitespace-nowrap pointer-events-none select-none"
              style={{
                top: '-20px',
                left: '-10px',
                zIndex: 0,
              }}
            >
              Platform Features
            </div>
            {/* Foreground text */}
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 relative z-10">
              Platform Features
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-600 relative z-10">
            Built for seamless buying, selling, and donating
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={feature.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative"
              >
                {/* Number - top right */}
                <div 
                  className="absolute -top-4 -right-4 text-7xl font-bold transition-all duration-300"
                  style={{
                    color: isHovered ? feature.color : '#F3F4F6',
                    opacity: isHovered ? 1 : 0.5,
                  }}
                >
                  {feature.number}
                </div>

                {/* Icon - separate from number */}
                <div className="mb-6">
                  <div 
                    className="inline-flex p-3 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? feature.color : '#F9FAFB',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Icon 
                      className="w-8 h-8 transition-colors duration-300" 
                      style={{ color: isHovered ? '#FFFFFF' : feature.color }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-2xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: isHovered ? feature.color : '#111827' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom line */}
                <div className="mt-6 h-0.5 bg-gray-100 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{
                      width: isHovered ? '100%' : '20%',
                      backgroundColor: feature.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="mt-20 md:mt-32 text-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-900">
            Start your exchange journey today
          </p>
        </div>
      </div>
    </section>
  );
}