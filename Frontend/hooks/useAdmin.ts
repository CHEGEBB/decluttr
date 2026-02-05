/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import adminService, {
  DashboardData,
  AdminUser,
  PendingProduct,
  AdminOrder,
  PlatformStats,
} from '@/services/adminService';

export const useAdmin = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdminUser = await adminService.checkAdminAuth();
      setIsAdmin(isAdminUser);
    };
    checkAdmin();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlatformStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getPlatformStats();
      setPlatformStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform stats');
      console.error('Platform stats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Users fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      console.error('Delete user error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedUser = await adminService.toggleUserStatus(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: updatedUser.isActive } : user
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
      console.error('Deactivate user error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Products fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPendingProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getPendingProducts();
      setPendingProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending products');
      console.error('Pending products error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.verifyProduct(productId);
      setPendingProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId)
      );
      if (products.length > 0) {
        await getAllProducts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify product');
      console.error('Verify product error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [products.length, getAllProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.deleteProduct(productId);
      setPendingProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId)
      );
      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId)
      );
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      console.error('Delete product error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Orders fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedOrder = await adminService.updateOrderStatus(orderId, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      console.error('Update order status error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string, type?: 'users' | 'products' | 'orders') => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await adminService.search(query, type);
      return results;
    } catch (err: any) {
      setError(err.message || 'Search failed');
      console.error('Search error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    adminService.logout();
  }, []);

  return {
    dashboard,
    users,
    products,
    pendingProducts,
    orders,
    platformStats,
    isLoading,
    error,
    isAdmin,
    clearError,
    getDashboard,
    getPlatformStats,
    getAllUsers,
    deleteUser,
    deactivateUser,
    getAllProducts,
    getPendingProducts,
    verifyProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    search,
    logout,
  };
};