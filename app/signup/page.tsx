/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const signupImages = [
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1600&fit=crop', text: 'Start Your Journey Today' },
  { url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=1600&fit=crop', text: 'Turn Clutter Into Cash' },
  { url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=1600&fit=crop', text: 'Shop Sustainably, Live Better' },
];

const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; username?: string; email?: string; password?: string; confirmPassword?: string; location?: string; phone?: string; }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % signupImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  }

  const validate = () => {
    const newErrors:any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        alert('Account created successfully! Redirecting to marketplace...');
        window.location.href = '/main/marketplace';
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Image Top on Mobile, Left on Desktop with Padding */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen p-4 order-1">
        <div className="w-full h-full relative overflow-hidden rounded-3xl">
          {signupImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: currentImageIndex === index ? 1 : 0 }}
            >
              <img
                src={img.url}
                alt="Decluttr"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl lg:text-4xl font-black mb-2 transition-opacity duration-1000">
                  {img.text}
                </h2>
                <p className="text-base lg:text-lg text-gray-200">
                  Create your account and start selling today
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Bottom on Mobile, Right on Desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 order-2 lg:overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
            <Image
                    src="/assets/logodark.png"
                    alt="Decluttr Logo"
                    width={260}
                    height={50}
                    priority
                    />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              Create Account 
            </h1>
            <p className="text-gray-600">Join our community today</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onKeyPress={handleKeyPress}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 border-2 text-gray-500 placeholder:text-gray-500 rounded-xl focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  onKeyPress={handleKeyPress}
                  placeholder="johndoe"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-500 placeholder:text-gray-500 focus:outline-none transition-colors ${
                    errors.username ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.username && <p className="text-xs text-red-600 mt-1 font-medium">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onKeyPress={handleKeyPress}
                  placeholder="john@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-500 placeholder:text-gray-500 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  onKeyPress={handleKeyPress}
                  placeholder="At least 6 characters"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl text-gray-500 placeholder:text-gray-500 focus:outline-none transition-colors ${
                    errors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  onKeyPress={handleKeyPress}
                  placeholder="Re-enter password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl text-gray-500 placeholder:text-gray-500 focus:outline-none transition-colors ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Location & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 border-2 text-gray-500 placeholder:text-gray-500 rounded-xl focus:outline-none transition-colors appearance-none ${
                      errors.location ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                    }`}
                  >
                    <option value="">Select</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                {errors.location && <p className="text-xs text-red-600 mt-1 font-medium">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    onKeyPress={handleKeyPress}
                    placeholder="0712345678"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-gray-500 placeholder:text-gray-500 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : (
                <>
                  Sign up
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-700 text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-semibold text-gray-700 text-sm">Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <button className="text-green-600 hover:text-green-700 font-semibold" onClick={handleLogin}>
                Log in
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">© 2025 ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
}