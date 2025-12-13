'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    tag: 'SUSTAINABLE LIVING',
    title: 'Declutter Your Space',
    subtitle: 'Empower Your Life',
    description: 'Turn your unused items into cash. Join thousands selling and buying pre-loved goods sustainably.',
    bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop',
  },
  {
    id: 2,
    tag: 'ECO-FRIENDLY',
    title: 'Shop Smart',
    subtitle: 'Live Better',
    description: 'Discover quality pre-owned items at amazing prices. Save money while saving the planet.',
    bgImage: 'https://images.unsplash.com/photo-1674027392857-9aed6e8ecab9?w=1500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG9ubGluZSUyMHNob3B8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 3,
    tag: 'COMMUNITY DRIVEN',
    title: 'Buy & Sell',
    subtitle: 'With Confidence',
    description: 'Safe, verified transactions in Kenya\'s most trusted recommerce platform.',
    bgImage: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1920&h=600&fit=crop',
  },
];

const rightImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop',
    title: 'Fashion',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    title: 'Electronics',
  },
];

export  function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="relative h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-xl">
      {/* Background Image with Transition */}
      <div className="absolute inset-0">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img 
              src={s.bgImage}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-black/70 to-black/40" />
      </div>

      {/* Left Content */}
      <div className="relative h-full flex items-center px-4 md:px-8 lg:px-12">
        <div className="max-w-lg z-10">
          <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-3 animate-pulse">
            {slide.tag}
          </span>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 leading-tight">
            {slide.title}
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-red-400 mb-3">
            {slide.subtitle}
          </h2>
          
          <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-md">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Right Side Images - Hidden on Mobile and Small Tablets */}
      <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
        <div className="relative group">
          <div className="w-40 h-40 rounded-xl border-2 border-red-500 border-dotted overflow-hidden shadow-xl transform rotate-6 group-hover:rotate-0 transition-all duration-500 hover:scale-105">
            <img 
              src={rightImages[0].url}
              alt={rightImages[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white font-bold text-sm">
              {rightImages[0].title}
            </div>
          </div>
        </div>
        
        <div className="relative group ml-8">
          <div className="w-40 h-40 rounded-xl border-2 border-red-500 border-dotted overflow-hidden shadow-xl transform -rotate-6 group-hover:rotate-0 transition-all duration-500 hover:scale-105">
            <img 
              src={rightImages[1].url}
              alt={rightImages[1].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white font-bold text-sm">
              {rightImages[1].title}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-3 bottom-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute left-14 bottom-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 right-4 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index 
                ? 'w-6 bg-red-500' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}