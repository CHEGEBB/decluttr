'use client';

import { Gift, Truck, Star, Shield, Clock, TrendingUp } from 'lucide-react';

export function InfiniteMarquee() {
  const announcements = [
    { text: "🎉 NEW COLLECTION: Sustainable luxury at 70% OFF", icon: <Gift className="w-4 h-4" /> },
    { text: "🚚 FREE SHIPPING on orders over KSh 5,000", icon: <Truck className="w-4 h-4" /> },
    { text: "⭐ 98% CUSTOMER SATISFACTION RATE", icon: <Star className="w-4 h-4" /> },
    { text: "🛡️ 100% BUYER PROTECTION GUARANTEED", icon: <Shield className="w-4 h-4" /> },
    { text: "⚡ SAME-DAY DELIVERY in Nairobi", icon: <Clock className="w-4 h-4" /> },
    { text: "📈 TRENDING: Over 2,500 premium items listed", icon: <TrendingUp className="w-4 h-4" /> },
    { text: "🆕 NEW USERS: Get 15% OFF with code WELCOME15", icon: <Gift className="w-4 h-4" /> },
    { text: "♻️ HELP SAVE THE PLANET: 10 trees planted per order", icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-3 overflow-hidden relative">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-red-600 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-red-600 to-transparent z-10" />
      
      {/* Marquee Container */}
      <div className="flex animate-marquee whitespace-nowrap">
        {announcements.map((item, index) => (
          <div key={index} className="inline-flex items-center mx-10 group hover:scale-105 transition-transform">
            <span className="mr-3 group-hover:rotate-12 transition-transform">
              {item.icon}
            </span>
            <span className="text-sm font-bold tracking-wide">
              {item.text}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {announcements.map((item, index) => (
          <div key={`dup-${index}`} className="inline-flex items-center mx-10 group hover:scale-105 transition-transform">
            <span className="mr-3 group-hover:rotate-12 transition-transform">
              {item.icon}
            </span>
            <span className="text-sm font-bold tracking-wide">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}