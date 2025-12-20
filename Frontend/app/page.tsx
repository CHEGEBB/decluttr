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
import StatsSection from '@/components/landing/stats-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background Elements */}
      {/* Animated Background Elements */}
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  {[...Array(15)].map((_, i) => {
    // Generate consistent values based on index
    const size = ((i * 37) % 100) + 100;
    const left = ((i * 67) % 100);
    const top = ((i * 89) % 100);
    const duration = 20 + ((i * 13) % 10);
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-full opacity-5"
        style={{
          background: `conic-gradient(from 0deg, #DB362D, #10B981, #3B82F6, #DB362D)`,
          width: size,
          height: size,
          left: `${left}%`,
          top: `${top}%`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    );
  })}
</div>

      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <StatsSection/>
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}