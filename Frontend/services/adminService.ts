/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Admin API endpoints
const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',
  STATS: '/admin/stats',
  USERS: '/admin/users',
  PRODUCTS: '/admin/products',
  PENDING_PRODUCTS: '/admin/products/pending',
  ORDERS: '/admin/orders',
  TRANSACTIONS: '/admin/transactions',
  SEARCH: '/admin/search',
};

// Create axios instance with default config
const adminAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  verifiedProducts: number;
  pendingProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalExchanges: number;
}

export interface PlatformMetrics {
  averageOrderValue: number;
  conversionRate: number;
  activeUserRate: number;
  productVerificationRate: number;
}

export interface DashboardData {
  stats: DashboardStats;
  metrics: PlatformMetrics;
  recentActivity: {
    orders: any[];
    users: any[];
  };
}

export interface AdminUser {
  id: string;
  _id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  location: string;
  role: string;
  isActive: boolean;
  totalIncome: number;
  totalExchanges: number;
  ratings: number;
  createdAt: string;
  profileImage?: {
    url: string;
    public_id: string;
  };
}

export interface PendingProduct {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  isVerified: boolean;
  seller: {
    _id: string;
    name: string;
    email: string;
    username: string;
    phoneNumber: string;
    location: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  createdAt: string;
  listingType: string;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  buyer: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      category: string;
      images: Array<{ url: string }>;
    };
    seller: {
      _id: string;
      name: string;
      username: string;
    };
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    county: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStats {
  revenueByMonth: Array<{
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }>;
  productsByCategory: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
  usersByLocation: Array<{
    _id: string;
    count: number;
  }>;
  topSellers: Array<{
    sellerId: string;
    sellerName: string;
    sellerUsername: string;
    totalSales: number;
    orderCount: number;
  }>;
}

// Admin Service Class
class AdminService {
  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.DASHBOARD);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.STATS);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch platform stats');
    }
  }

  // Users
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.USERS);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  async getUser(userId: string): Promise<any> {
    try {
      const response = await adminAxios.get(`${ADMIN_ENDPOINTS.USERS}/${userId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await adminAxios.delete(`${ADMIN_ENDPOINTS.USERS}/${userId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  async toggleUserStatus(userId: string): Promise<AdminUser> {
    try {
      const response = await adminAxios.put(`${ADMIN_ENDPOINTS.USERS}/${userId}/toggle-status`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  }

  // Products
  async getAllProducts(): Promise<PendingProduct[]> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.PRODUCTS);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  async getPendingProducts(): Promise<PendingProduct[]> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.PENDING_PRODUCTS);
      return response.data.data.map((product: any) => ({
        ...product,
        id: product._id
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending products');
    }
  }

  async verifyProduct(productId: string): Promise<void> {
    try {
      await adminAxios.put(`${ADMIN_ENDPOINTS.PRODUCTS}/${productId}/verify`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await adminAxios.delete(`${ADMIN_ENDPOINTS.PRODUCTS}/${productId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  // Orders
  async getAllOrders(): Promise<AdminOrder[]> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.ORDERS);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }

  async getOrder(orderId: string): Promise<AdminOrder> {
    try {
      const response = await adminAxios.get(`${ADMIN_ENDPOINTS.ORDERS}/${orderId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<AdminOrder> {
    try {
      const response = await adminAxios.put(`${ADMIN_ENDPOINTS.ORDERS}/${orderId}/status`, {
        orderStatus: status
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  }

  // Transactions
  async getAllTransactions(): Promise<any[]> {
    try {
      const response = await adminAxios.get(ADMIN_ENDPOINTS.TRANSACTIONS);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }

  // Search
  async search(query: string, type?: 'users' | 'products' | 'orders'): Promise<any> {
    try {
      const params: any = { query };
      if (type) params.type = type;
      
      const response = await adminAxios.get(ADMIN_ENDPOINTS.SEARCH, { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Admin Authentication Check
  async checkAdminAuth(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return false;
      }

      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminAuthenticated');
    window.location.href = '/admin';
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;