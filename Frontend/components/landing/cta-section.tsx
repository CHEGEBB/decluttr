import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-br from-red-50/20 via-green-50/20 to-blue-50/20">
      {/* Parallax Background Elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-20"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"
        style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)` }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large background text */}
          <div className="relative mb-16">
            <div 
              className="absolute text-7xl sm:text-8xl md:text-9xl font-black text-white whitespace-nowrap pointer-events-none select-none opacity-40"
              style={{
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0,
              }}
            >
              Join Today
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 relative z-10">
              Ready to Start?
            </h2>
          </div>

          <p className="text-2xl md:text-3xl text-gray-700 mb-12 font-medium max-w-3xl mx-auto">
            Create your account and start buying or selling today
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              className="group relative px-12 py-6 rounded-2xl font-bold text-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl"
              style={{
                backgroundColor: '#10B981',
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <button
              className="px-12 py-6 rounded-2xl font-bold text-xl border-3 transition-all duration-300 hover:scale-105"
              style={{
                borderWidth: '3px',
                borderColor: '#111827',
                color: '#111827',
                backgroundColor: 'transparent',
              }}
            >
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-semibold">Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold">Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-semibold">Easy messaging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}