// components/hero-section.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2532&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(#DB362D 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Animated accent shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-32 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#DB362D' }}
      />
      
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: '#10B981' }}
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: '#3B82F6' }}
      />

      <div className="relative min-h-screen flex items-center">
        {/* Right Image - Girl pointing to text */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-32 top-1/2 -translate-y-1/2 w-[40vw] h-[75vh] hidden lg:block z-10"
        >
          <div className="relative w-full h-full">
            {/* Glow effect behind image */}
            <div 
              className="absolute -inset-8 rounded-3xl blur-2xl opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(219, 54, 45, 0.4), transparent 70%)' }}
            />
            
            {/* Main image container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/left3.png"
                alt="Hero Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content Container - LEFT SIDE */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-20">
          <div className="lg:mr-[42vw]">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* Heading */}
              <h1 className="text-5xl sm:text-2xl lg:text-4xl xl:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="block text-white mb-2">Turn Your Clutter</span>
                <span className="block text-white mb-2">Into</span>
                <span 
                  className="inline-block px-6 py-2 rounded-xl transform -rotate-2"
                  style={{ backgroundColor: '#DB362D' }}
                >
                  Cash Flow
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl lg:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Our platform helps you declutter your space while giving your items a second life through re-commerce.
              Whether you’re clearing out, selling, or finding something pre-loved, Decluttr makes the process simple, smart, and sustainable.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{ backgroundColor: '#DB362D' }}
                >
                  <span className="relative z-10">Start Selling Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: '#10B981' }}
                  />
                </Link>

                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{ 
                    borderColor: 'white',
                    backgroundColor: 'transparent'
                  }}
                >
                  Browse Marketplace
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl">
                {[
                  { icon: Shield, label: 'Verified Sellers', color: '#10B981' },
                  { icon: Zap, label: 'Instant Setup', color: '#DB362D' },
                  { icon: CheckCircle, label: 'Secure Payments', color: '#3B82F6' },
                  { icon: Shield, label: '24/7 Support', color: '#10B981' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="p-2.5 rounded-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}