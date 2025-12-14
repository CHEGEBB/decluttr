/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Wanjiku Kamau',
    role: 'Fashion Reseller',
    content: 'This platform changed my business! I sold over 50 items in my first month. The M-Pesa integration makes everything so smooth.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMHdvbWFufGVufDB8fDB8fHww',
    color: '#DB362D'
  },
  {
    name: 'James Omondi',
    role: 'Electronics Trader',
    content: 'Finally a platform that understands the Kenyan market. The messaging system is great for negotiating prices.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    color: '#10B981'
  },
  {
    name: 'Aisha Mwangi',
    role: 'Home Goods Seller',
    content: 'I love how easy it is to list items. Sold my old furniture in less than a week. Highly recommend!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1613005341945-35e159e522f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWZyaWNhbiUyMHdvbWFufGVufDB8fDB8fHww',
    color: '#3B82F6'
  },
  {
    name: 'Kevin Njoroge',
    role: 'Book Collector',
    content: 'Best platform for buying and selling books in Kenya. The community is friendly and supportive.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1620932934088-fbdb2920e484?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWZyaWNhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    color: '#DB362D'
  },
  {
    name: 'Fatuma Hassan',
    role: 'Shoes Reseller',
    content: 'The search and filter options make it so easy for buyers to find my items. Sales have been amazing!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1631831831430-8447cf883291?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFmcmljYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    color: '#10B981'
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-32 bg-gray-100 relative overflow-hidden">
      {/* Floating profile images in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {testimonials.map((testimonial, i) => (
          <Image
            key={i}
            src={testimonial.image}
            alt=""
            width={128}
            height={128}
            className="absolute w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
            style={{
              top: `${((i * 31.7) % 80) + 10}%`,
              left: `${((i * 43.3) % 80) + 10}%`,
              animation: `float ${5 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              What People Say
            </div>
            {/* Foreground text */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10">
              What People Say
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-600 relative z-10">
            Real stories from our community
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 relative">
            {/* Quote mark decoration */}
            <div 
              className="absolute top-8 left-8 text-8xl font-serif opacity-10 select-none"
              style={{ color: current.color }}
            >
              &quot;
            </div>

            {/* Content */}
            <div 
              className="relative z-10 transition-all duration-500"
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(current.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-6 h-6" 
                    style={{ fill: '#FBBF24', color: '#FBBF24' }} 
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-xl md:text-2xl text-gray-700 mb-12 text-center leading-relaxed">
                &quot;{current.content}&quot;
              </p>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-20 h-20 rounded-full p-1"
                  style={{ backgroundColor: current.color }}
                >
                  <img 
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900">{current.name}</h4>
                  <p className="text-gray-600">{current.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots Navigation */}
            <div className="flex gap-2 justify-center mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(i);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className="transition-all duration-300"
                  style={{
                    width: currentIndex === i ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: currentIndex === i ? current.color : '#D1D5DB',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </section>
  );
}