/* eslint-disable @typescript-eslint/no-explicit-any */
// services/adminService.ts
import authService from './authService';

export interface AdminStats {
  totalExchanges: number;
  pendingOrders: number;
  pendingDeliveries: number;
  unverifiedProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  buyer: {
    name: string;
    username: string;
  };
  seller?: {
    name: string;
    username: string;
  };
  createdAt: string;
}

export interface PendingProduct {
  id: string;
  name: string;
  price: number;
  status: string;
  isVerified: boolean;
  seller: {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    location: string;
  };
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  location: string;
  totalIncome: number;
  totalExchanges: number;
  ratings: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentOrders: AdminOrder[];
}

class AdminService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return authService.isAdmin();
  }

  /**
   * Get admin dashboard data
   */
  async getDashboard(): Promise<AdminDashboardData> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch dashboard data',
          error: data.error,
        };
      }

      return data.data;
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get pending products for verification
   */
  async getPendingProducts(): Promise<PendingProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/products/pending`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch pending products',
          error: data.error,
        };
      }

      return data.data || [];
    } catch (error) {
      console.error('Get pending products error:', error);
      throw error;
    }
  }

  /**
   * Verify a product
   */
  async verifyProduct(productId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/products/${productId}/verify`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to verify product',
          error: data.error,
        };
      }

      return data;
    } catch (error) {
      console.error('Verify product error:', error);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch users',
          error: data.error,
        };
      }

      return data.data || [];
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get all orders
   */
  async getAllOrders(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch orders',
          error: data.error,
        };
      }

      return data.data || [];
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to delete product',
          error: data.error,
        };
      }

      return data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  /**
   * Deactivate a user
   */
  async deactivateUser(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to deactivate user',
          error: data.error,
        };
      }

      return data;
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  }

  /**
   * Admin login (same as user login but checks for admin role)
   */
  async adminLogin(identifier: string, password: string): Promise<any> {
    try {
      // Use the auth service for login
      const response = await authService.login({ identifier, password });
      
      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        throw {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      return response;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const adminService = new AdminService();
export default adminService;