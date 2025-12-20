import React, { useState } from 'react';
import { Users, ShoppingBag, MessageSquare, MapPin } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50+',
    label: 'Registered Users',
    color: '#DB362D',
  },
  {
    icon: ShoppingBag,
    value: '20+',
    label: 'Items Listed',
    color: '#10B981',
  },
  {
    icon: MessageSquare,
    value: '10+',
    label: 'Messages Sent',
    color: '#3B82F6',
  },
  {
    icon: MapPin,
    value: '5',
    label: 'Categories Available',
    color: '#DB362D',
  },
];

export default function StatsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 relative">
          <div className="relative">
            {/* Large background text */}
            <div 
              className="absolute text-6xl sm:text-7xl md:text-8xl font-black text-gray-100 whitespace-nowrap pointer-events-none select-none"
              style={{
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0,
              }}
            >
              Our Platform
            </div>
            {/* Foreground text */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10">
              Our Platform
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-600 relative z-10">
            Building a community for sustainable exchanges
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={stat.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group"
              >
                <div 
                  className="bg-gray-50 rounded-2xl p-6 md:p-8 text-center transition-all duration-300 border-2"
                  style={{
                    borderColor: isHovered ? stat.color : 'transparent',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 20px 40px -10px ${stat.color}40` : 'none',
                  }}
                >
                  {/* Icon */}
                  <div 
                    className="inline-flex p-4 rounded-xl mb-4 transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? stat.color : '#F9FAFB',
                      transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                    }}
                  >
                    <Icon 
                      className="w-8 h-8 transition-colors duration-300" 
                      style={{ color: isHovered ? '#FFFFFF' : stat.color }}
                    />
                  </div>

                  {/* Value */}
                  <div 
                    className="text-4xl md:text-5xl font-black mb-2 transition-colors duration-300"
                    style={{ color: isHovered ? stat.color : '#111827' }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm md:text-base font-semibold text-gray-600">
                    {stat.label}
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: isHovered ? '100%' : '0%',
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Features */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'M-Pesa Payments', color: '#10B981' },
              { label: 'Direct Messaging', color: '#3B82F6' },
              { label: 'User Dashboard', color: '#DB362D' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 justify-center md:justify-start">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: feature.color }}
                />
                <span className="text-gray-700 font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}