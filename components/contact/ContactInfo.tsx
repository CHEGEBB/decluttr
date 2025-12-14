'use client';

import { Shield, Truck, Users, Award, Globe, Heart } from 'lucide-react';

const ContactInfo = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safe Transactions',
      description: 'Secure payments and verified sellers for worry-free shopping',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Nationwide delivery with tracking and local pickup options',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join our community of buyers and sellers helping each other',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All items are verified for condition and authenticity',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Globe,
      title: 'Nationwide Reach',
      description: 'Connecting buyers and sellers across Kenya',
      color: 'from-indigo-500 to-violet-600'
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Donate items to support local charities and communities',
      color: 'from-red-500 to-rose-600'
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why Choose Decluttr Marketplace?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re more than just a marketplace - we&apos;re a community dedicated to sustainability,
            affordability, and connecting people through pre-loved items.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">10,000+</div>
            <div className="text-sm text-gray-600">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">50,000+</div>
            <div className="text-sm text-gray-600">Items Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">95%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;