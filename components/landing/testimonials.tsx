// components/testimonials-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Fashion Reseller',
    content: 'I\'ve made over KSh 500,000 selling my pre-loved clothes on DECLUTTR. The platform is intuitive and the community is amazing!',
    rating: 5,
    colors: ['#DB362D', '#10B981'],
  },
  {
    name: 'David K.',
    role: 'Electronics Trader',
    content: 'The secure payment system gave me confidence to sell high-value items. Customer support is responsive and helpful.',
    rating: 5,
    colors: ['#10B981', '#3B82F6'],
  },
  {
    name: 'Emma W.',
    role: 'Home Goods Seller',
    content: 'From furniture to kitchenware, everything sells quickly here. The verification process ensures trustworthy buyers.',
    rating: 5,
    colors: ['#3B82F6', '#DB362D'],
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'white' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-sm font-medium" style={{ color: '#374151' }}>Community Love</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block" style={{ color: '#111827' }}>Trusted by</span>
            <span className="block" style={{
              background: 'linear-gradient(135deg, #DB362D, #10B981, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              15,000+ Sellers
            </span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative rounded-2xl p-8 border transition-all duration-300"
              style={{
                backgroundColor: 'white',
                borderColor: '#E5E7EB'
              }}
            >
              {/* Quote Icon */}
              <div 
                className="absolute -top-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #111827, #374151)' }}
              >
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg mb-8 leading-relaxed italic" style={{ color: '#374151' }}>
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div 
                    className="w-14 h-14 rounded-full p-0.5"
                    style={{ background: `linear-gradient(135deg, ${testimonial.colors[0]}, ${testimonial.colors[1]})` }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: 'white' }}>
                      <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#D1D5DB' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: '#111827' }}>{testimonial.name}</h4>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 border"
          style={{
            background: 'linear-gradient(135deg, rgba(219, 54, 45, 0.05), rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
            borderColor: '#E5E7EB'
          }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '98%', label: 'Seller Satisfaction' },
              { value: '4.9/5', label: 'Platform Rating' },
              { value: '2.8K+', label: 'Daily Transactions' },
              { value: '15K+', label: 'Active Community' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #DB362D, #10B981, #3B82F6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: '#6B7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}