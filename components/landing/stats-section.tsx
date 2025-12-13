// components/landing/stats-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Users, Package, TrendingUp, Globe } from 'lucide-react'
import CountUp from 'react-countup'

const stats = [
  {
    icon: Users,
    value: 15000,
    suffix: '+',
    label: 'Active Users',
    description: 'Community members',
    color: 'text-emerald',
    bg: 'bg-emerald/10',
  },
  {
    icon: Package,
    value: 2847,
    suffix: '+',
    label: 'Listed Items',
    description: 'Available for exchange',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: TrendingUp,
    value: 8924,
    suffix: '+',
    label: 'Transactions',
    description: 'Successful exchanges',
    color: 'text-blue',
    bg: 'bg-blue/10',
  },
  {
    icon: Globe,
    value: 125,
    suffix: ' tons',
    label: 'Waste Reduced',
    description: 'Environmental impact',
    color: 'text-emerald',
    bg: 'bg-emerald/10',
  },
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="block">Join Our Growing</span>
              <span className="bg-gradient-to-r from-primary to-emerald bg-clip-text text-transparent">
                Sustainable Community
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Every transaction on DECLUTTR contributes to a circular economy,
              reducing waste and creating value from pre-loved items.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald" />
                <span className="text-lg">Admin-verified sellers for security</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-lg">Secure M-Pesa payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue" />
                <span className="text-lg">Real-time messaging system</span>
              </div>
            </div>
          </motion.div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-6 border border-transparent hover:border-current/20 transition-colors`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        <CountUp
                          end={stat.value}
                          duration={2.5}
                          separator=","
                        />
                      </span>
                      {stat.suffix && (
                        <span className="text-xl font-semibold text-gray-900">{stat.suffix}</span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}