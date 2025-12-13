/* eslint-disable react-hooks/purity */
// app/page.tsx
'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/landing/hero-section'
import FeaturesSection from '@/components/landing/features-section'
import HowItWorksSection from '@/components/landing/how-it-works-section'
import TestimonialsSection from '@/components/landing/testimonials'
import CTASection from '@/components/landing/cta-section'
import Footer from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              background: `conic-gradient(from 0deg, #DB362D, #10B981, #3B82F6, #DB362D)`,
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <Navbar scrollY={0} />
      
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}