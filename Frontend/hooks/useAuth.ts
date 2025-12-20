// hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react';
import authService, { User, LoginCredentials, SignupData } from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearAuth: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getUser();
        
        if (token && storedUser) {
          // Validate token on mount
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setUser(storedUser);
            setIsAuthenticated(true);
            setIsAdmin(storedUser.role === 'admin');
          } else {
            authService.clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsAdmin(response.data.user.role === 'admin');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: SignupData) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsAdmin(response.data.user.role === 'admin');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      setIsAdmin(updatedUser.role === 'admin');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsAdmin(currentUser.role === 'admin');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    updateProfile,
    getCurrentUser,
    clearAuth,
  };
}