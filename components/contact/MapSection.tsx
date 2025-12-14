'use client';

import { MapPin, Navigation, Clock, Globe } from 'lucide-react';

const MapSection = () => {
  return (
    <div className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Find Us & Visit Our Office
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our headquarters in Nairobi or connect with our regional teams across Kenya.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Office Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Office */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Headquarters</h3>
                  <p className="text-sm text-gray-600">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700">
                  ABC Place, 1st Floor<br />
                  Waiyaki Way, Westlands<br />
                  Nairobi, Kenya
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm">Get Directions</span>
                </div>
              </div>
            </div>
            
            {/* Working Hours */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Working Hours</h3>
                  <p className="text-sm text-gray-600">We&apos;re here to help</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Sunday & Holidays</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
            
            {/* Regional Offices */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Regional Offices</h3>
                  <p className="text-sm text-gray-600">Across Kenya</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Mombasa</span>
                  <span className="text-sm text-gray-600">Nyali Center</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Kisumu</span>
                  <span className="text-sm text-gray-600">Westend Mall</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Eldoret</span>
                  <span className="text-sm text-gray-600">Rupa&apos;s Mall</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Nakuru</span>
                  <span className="text-sm text-gray-600">Westside Mall</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Map */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl h-full">
              {/* Map Container */}
              <div className="h-64 md:h-80 lg:h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 inline-block">
                      <h4 className="font-bold text-gray-900">Decluttr Headquarters</h4>
                      <p className="text-sm text-gray-600">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Markers */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-lg" />
              </div>
              
              {/* Map Controls */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    View Larger Map
                  </button>
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Get Directions
                  </button>
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Save Location
                  </button>
                  <button className="py-2 px-4 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;