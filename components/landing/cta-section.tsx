// components/cta-section.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-emerald/5 to-blue/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-emerald/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald/20 to-blue/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-200"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald/10 to-blue/10 border border-emerald/20 mb-8">
            <CheckCircle className="w-4 h-4 text-emerald" />
            <span className="text-sm font-medium text-gray-700">No credit card required</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-gray-900">Ready to Start</span>
            <span className="block bg-gradient-to-r from-primary via-emerald to-blue bg-clip-text text-transparent">
              Your Recommerce Journey?
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of sellers who are building sustainable businesses on DECLUTTR.
            Everything you need, completely free to start.
          </p>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              'No listing fees',
              'Secure payments',
              'Mobile app',
              '24/7 support',
              'Analytics dashboard',
              'Community network',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-emerald" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-emerald text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 overflow-hidden"
            >
              <span>Start Selling Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald to-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300"
            >
              Browse Top Sellers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}