'use client';

import { TrendingUp, Shield, Truck, Award } from 'lucide-react';

const WhyShopWithUs = () => {
  return (
    <div className="mt-10 md:mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 md:mb-8">Why Shop With Decluttr</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="text-center p-4 md:p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Save Up to 70%</h3>
          <p className="text-gray-600 text-xs md:text-sm">Premium items at fraction of retail prices</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Secure Transactions</h3>
          <p className="text-gray-600 text-xs md:text-sm">Protected payments & verified sellers</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Truck className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Fast Delivery</h3>
          <p className="text-gray-600 text-xs md:text-sm">Nationwide shipping & local pickup</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Quality Assured</h3>
          <p className="text-gray-600 text-xs md:text-sm">Thorough inspection & condition grading</p>
        </div>
      </div>
    </div>
  );
};

export default WhyShopWithUs;