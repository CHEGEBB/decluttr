/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Lock, Shield, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AdminLogin = ({ setIsAuthenticated }: AdminLoginProps) => {
  const router = useRouter();
  
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('Attempting admin login...');

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: credentials.identifier,
          password: credentials.password
        }),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, success: data.success });

      if (!response.ok || !data.success) {
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      const { token, user } = data.data;

      // Verify admin role
      if (user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      // Store in sessionStorage (clears when browser closes)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('adminAuthenticated', 'true');

      console.log('Admin authenticated successfully');
      setSuccess('Admin login successful! Redirecting...');
      
      // Set authenticated state and redirect
      setTimeout(() => {
        setIsAuthenticated(true);
        router.push('/admin');
      }, 800);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Connection error. Make sure the backend is running on port 5000');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-red-900/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Access the Decluttr administration dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email or Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={credentials.identifier}
                  onChange={(e) => setCredentials({...credentials, identifier: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                  placeholder="admin@decluttr.com or admin"
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-300">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !credentials.identifier || !credentials.password}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Access Admin Dashboard
                </>
              )}
            </button>

            {/* Default Credentials Info */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-3">Default Admin Credentials (Development)</p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Email:</span>
                  <span className="text-xs text-white font-mono">admin@decluttr.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Username:</span>
                  <span className="text-xs text-white font-mono">admin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Password:</span>
                  <span className="text-xs text-white font-mono">admin123</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">© 2025 Decluttr Admin Portal • v1.0.0</p>
          <p className="text-xs text-gray-600 mt-1">For authorized personnel only</p>
          <p className="text-xs text-gray-700 mt-2">⚠️ Session expires when browser closes</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;