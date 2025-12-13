// components/marketplace/HeroSection.tsx
export function HeroSection() {
    return (
      <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-2xl overflow-hidden mb-8">
        <div className="px-8 py-12 md:px-12 lg:px-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              MINIMALIST DESIGN TREND
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Comfortable items that decorate your life
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                SHOP NOW
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                NEW ARRIVALS
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3">
          <div className="absolute inset-0 bg-gradient-to-l from-red-600/20 to-transparent" />
        </div>
      </div>
    );
  }