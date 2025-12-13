import React, { useState } from 'react';
import { Upload, Search, MessageCircle, CreditCard } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'List Your Items',
    description: 'Upload photos, set prices, and choose categories in minutes.',
    icon: Upload,
    color: '#DB362D',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop'
  },
  {
    number: '02',
    title: 'Get Discovered',
    description: 'Buyers find your items through search and browse.',
    icon: Search,
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop'
  },
  {
    number: '03',
    title: 'Chat & Connect',
    description: 'Communicate directly with buyers through messaging.',
    icon: MessageCircle,
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop'
  },
  {
    number: '04',
    title: 'Secure Payment',
    description: 'Receive payments instantly via M-Pesa integration.',
    icon: CreditCard,
    color: '#DB362D',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
  },
];

export default function HowItWorksSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-20 relative">
          <div className="relative">
            {/* Large background text */}
            <div 
              className="absolute text-6xl sm:text-7xl md:text-8xl font-black text-gray-200 whitespace-nowrap pointer-events-none select-none"
              style={{
                top: '-15px',
                left: '-10px',
                zIndex: 0,
              }}
            >
              How It Works
            </div>
            {/* Foreground text */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10">
              How It Works
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-600 relative z-10">
            Simple steps to start buying and selling
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={step.number}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group"
              >
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-white shadow-md">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-64 object-cover transition-transform duration-500"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  {/* Number badge on image */}
                  <div 
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="flex-shrink-0 p-3 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? step.color : '#F9FAFB',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Icon 
                      className="w-6 h-6 transition-colors duration-300" 
                      style={{ color: isHovered ? '#FFFFFF' : step.color }}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 
                      className="text-xl font-bold mb-2 transition-colors duration-300"
                      style={{ color: isHovered ? step.color : '#111827' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="mt-4 h-0.5 bg-gray-200 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{
                      width: isHovered ? '100%' : '30%',
                      backgroundColor: step.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-900">
            Ready to get started?
          </p>
        </div>
      </div>
    </section>
  );
}