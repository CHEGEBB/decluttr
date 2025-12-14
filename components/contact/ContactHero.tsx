'use client';

import { MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-4">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">GET IN TOUCH</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              Let&apos;s Connect & <span className="text-red-500">Help</span> Each Other
            </h1>
            
            <p className="text-lg text-gray-300 mb-6">
              Have questions about buying, selling, or donating items? Our team is here to help you 
              with any inquiries about our marketplace platform.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-red-500">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-red-500">30m</div>
                <div className="text-sm text-gray-300">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-red-500">98%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-red-500">5K+</div>
                <div className="text-sm text-gray-300">Users Helped</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Quick Contact */}
          <div className="lg:w-1/2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">Call Us</div>
                  <div className="font-semibold">+254 712 345 678</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">Email Us</div>
                  <div className="font-semibold">support@decluttr.co.ke</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">Visit Us</div>
                  <div className="font-semibold">Nairobi, Kenya</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">Working Hours</div>
                  <div className="font-semibold">Mon - Fri: 8AM - 8PM</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-gray-300">
                Need immediate assistance? Use our live chat feature in the bottom right corner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;