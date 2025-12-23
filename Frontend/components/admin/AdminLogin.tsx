/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Lock, Shield, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AdminLogin = ({ setIsAuthenticated }: AdminLoginProps) => {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const { isAdmin: userIsAdmin } = useAdmin();
  
  const [credentials, setCredentials] = useState({
    identifier: '', // Can be email or username
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Use the auth service to login
      await login(credentials);
      
      // Check if user is admin
      if (!userIsAdmin) {
        setError('Access denied. Admin privileges required.');
        return;
      }

      setSuccess('Admin login successful!');
      
      // Wait a bit then redirect
      setTimeout(() => {
        setIsAuthenticated(true);
        router.push('/admin/dashboard');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Access the Decluttr administration dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username */}
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
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="admin@decluttr.com or admin"
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading ? (
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

            {/* Note for test users */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Contact system administrator for credentials
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Decluttr Admin Portal • v1.0.0
          </p>
          <p className="text-xs text-gray-600 mt-1">
            For authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;