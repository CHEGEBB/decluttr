/* eslint-disable @typescript-eslint/no-explicit-any */
// services/authService.ts

// Types based on your backend User model
export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    location: string;
    role: 'user' | 'admin';
    totalIncome: number;
    totalExchanges: number;
    ratings: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      token: string;
    };
  }
  
  export interface LoginCredentials {
    identifier: string; // email or username
    password: string;
  }
  
  export interface SignupData {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    location: string;
  }
  
  export interface ApiError {
    success: boolean;
    message: string;
    errors?: string[];
    error?: string;
  }
  
  // Token storage keys
  const TOKEN_KEY = 'decluttr_token';
  const USER_KEY = 'decluttr_user';
  
  class AuthService {
    private baseUrl: string;
  
    constructor() {
      // Default to localhost:5000, but you can set this in your environment
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
  
    /**
     * Sign up a new user
     */
    async signup(userData: SignupData): Promise<AuthResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Registration failed',
            errors: data.errors,
            error: data.error,
          } as ApiError;
        }
  
        // Store token and user data
        if (data.success && data.data) {
          this.setToken(data.data.token);
          this.setUser(data.data.user);
        }
  
        return data as AuthResponse;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    }
  
    /**
     * Log in an existing user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Login failed',
            error: data.error,
          } as ApiError;
        }
  
        // Store token and user data
        if (data.success && data.data) {
          this.setToken(data.data.token);
          this.setUser(data.data.user);
        }
  
        return data as AuthResponse;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    /**
     * Get current user profile (requires token)
     */
    async getCurrentUser(): Promise<User> {
      try {
        const token = this.getToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await fetch(`${this.baseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // If token is invalid, clear stored data
          if (response.status === 401) {
            this.clearAuth();
          }
          
          throw {
            success: false,
            message: data.message || 'Failed to fetch user data',
            error: data.error,
          } as ApiError;
        }
  
        // Update stored user data
        if (data.success && data.data) {
          this.setUser(data.data);
        }
  
        return data.data;
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    }
  
    /**
     * Log out the current user
     */
    async logout(): Promise<void> {
      try {
        const token = this.getToken();
        
        if (token) {
          // Call backend logout endpoint if needed
          await fetch(`${this.baseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always clear local storage
        this.clearAuth();
      }
    }
  
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
      const token = this.getToken();
      const user = this.getUser();
      
      // Check if token exists and user data is available
      return !!token && !!user;
    }
  
    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
      const user = this.getUser();
      return user?.role === 'admin';
    }
  
    /**
     * Get user role
     */
    getUserRole(): string | null {
      const user = this.getUser();
      return user?.role || null;
    }
  
    /**
     * Get current user ID
     */
    getUserId(): string | null {
      const user = this.getUser();
      return user?.id || null;
    }
  
    /**
     * Get auth headers for API requests
     */
    getAuthHeaders(): HeadersInit {
      const token = this.getToken();
      
      if (!token) {
        return {
          'Content-Type': 'application/json',
        };
      }
  
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  
    /**
     * Get token for manual API calls
     */
    getToken(): string | null {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(TOKEN_KEY);
    }
  
    /**
     * Set authentication token
     */
    private setToken(token: string): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
    }
  
    /**
     * Get user data from storage
     */
    getUser(): User | null {
      if (typeof window === 'undefined') return null;
      
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
  
    /**
     * Set user data in storage
     */
    private setUser(user: User): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    }
  
    /**
     * Clear all authentication data
     */
    clearAuth(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  
    /**
     * Update user profile (partial update)
     */
    async updateProfile(profileData: Partial<User>): Promise<User> {
      try {
        const token = this.getToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await fetch(`${this.baseUrl}/users/me/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to update profile',
            error: data.error,
          } as ApiError;
        }
  
        // Update stored user data
        if (data.success && data.data?.user) {
          this.setUser(data.data.user);
        }
  
        return data.data?.user;
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  
    /**
     * Validate token by calling /auth/me
     */
    async validateToken(): Promise<boolean> {
      try {
        await this.getCurrentUser();
        return true;
      } catch (error) {
        return false;
      }
    }
  
    /**
     * Get dashboard data for authenticated user
     */
    async getDashboard(): Promise<any> {
      try {
        const token = this.getToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await fetch(`${this.baseUrl}/users/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to fetch dashboard data',
            error: data.error,
          } as ApiError;
        }
  
        return data.data;
      } catch (error) {
        console.error('Get dashboard error:', error);
        throw error;
      }
    }
  
    /**
     * Get public user profile by username
     */
    async getUserProfile(username: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/users/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to fetch user profile',
            error: data.error,
          } as ApiError;
        }
  
        return data.data;
      } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
      }
    }
  }
  
  // Create a singleton instance
  const authService = new AuthService();
  export default authService;