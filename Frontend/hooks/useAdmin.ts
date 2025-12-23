/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAdmin.ts
'use client'

import { useState, useCallback } from 'react';
import adminService, { 
  AdminDashboardData, 
  PendingProduct, 
  AdminUser 
} from '../services/adminService';
import { useAuth } from './useAuth';

interface UseAdminReturn {
  // State
  dashboard: AdminDashboardData | null;
  pendingProducts: PendingProduct[];
  users: AdminUser[];
  orders: any[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean; // Add this
  
  // Methods
  getDashboard: () => Promise<void>;
  getPendingProducts: () => Promise<void>;
  getAllUsers: () => Promise<void>;
  getAllOrders: () => Promise<void>;
  verifyProduct: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  clearError: () => void;
}

export function useAdmin(): UseAdminReturn {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAdmin: userIsAdmin } = useAuth(); // Rename to avoid conflict

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getDashboard = useCallback(async () => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await adminService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin]);

  const getPendingProducts = useCallback(async () => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const products = await adminService.getPendingProducts();
      setPendingProducts(products);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending products');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin]);

  const getAllUsers = useCallback(async () => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userList = await adminService.getAllUsers();
      setUsers(userList);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin]);

  const getAllOrders = useCallback(async () => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const orderList = await adminService.getAllOrders();
      setOrders(orderList);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin]);

  const verifyProduct = useCallback(async (productId: string) => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await adminService.verifyProduct(productId);
      // Refresh pending products
      await getPendingProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to verify product');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin, getPendingProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await adminService.deleteProduct(productId);
      // Refresh pending products
      await getPendingProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin, getPendingProducts]);

  const deactivateUser = useCallback(async (userId: string) => {
    if (!userIsAdmin) {
      setError('Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await adminService.deactivateUser(userId);
      // Refresh user list
      await getAllUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate user');
    } finally {
      setIsLoading(false);
    }
  }, [userIsAdmin, getAllUsers]);

  return {
    // State
    dashboard,
    pendingProducts,
    users,
    orders,
    isLoading,
    error,
    isAdmin: userIsAdmin, // Return the isAdmin value
    
    // Methods
    getDashboard,
    getPendingProducts,
    getAllUsers,
    getAllOrders,
    verifyProduct,
    deleteProduct,
    deactivateUser,
    clearError,
  };
}