/* eslint-disable @typescript-eslint/no-explicit-any */
// app/login/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const loginImages = [
  { url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', text: 'Declutter Your Space, Empower Your Life' },
  { url: 'https://images.unsplash.com/photo-1593344484962-796055d4a3a4?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D', text: 'Buy and Sell with Confidence' },
  { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=1600&fit=crop', text: 'Join Our Sustainable Community' },
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loginImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    setError('');
    
    if (!identifier || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    try {
      await login({ identifier, password });
      router.push('/main/marketplace');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Image Top on Mobile, Right on Desktop with Padding */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen p-4 lg:p-4 order-1 lg:order-2">
        <div className="w-full h-full relative overflow-hidden rounded-3xl">
          {loginImages.map((img, index) => (
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
                  Join thousands of users buying and selling sustainably
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Left on Desktop, Bottom on Mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
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
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              Welcome Back 
            </h1>
            <p className="text-gray-600">
              Sign in to start managing your products
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-4 py-3 border-2 text-gray-500 placeholder:text-gray-500 rounded-xl focus:outline-none transition-colors ${
                    error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Email or username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-12 py-3 border-2 text-gray-500 placeholder:text-gray-500 rounded-xl focus:outline-none transition-colors ${
                    error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-red-400 hover:text-emerald-700 font-semibold">
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign in
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
                <span className="px-4 bg-white text-gray-500">Or sign in with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-700 text-sm lg:text-base">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-semibold text-gray-700 text-sm lg:text-base">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <button type="button" className="text-green-600 hover:text-green-700 font-semibold" onClick={handleSignUp}>
                Sign up
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">© 2025 ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
}