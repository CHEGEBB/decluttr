/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback } from 'react';
import orderService, { 
  Order, 
  CreateOrderData, 
  UpdateOrderStatusData 
} from '../services/orderService';

interface UseOrdersReturn {
  orders: Order[];
  receivedOrders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Actions
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  getMyOrders: () => Promise<void>;
  getReceivedOrders: () => Promise<void>;
  getOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatusData) => Promise<Order>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [receivedOrders, setReceivedOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (orderData: CreateOrderData): Promise<Order> => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await orderService.createOrder(orderData);
      const newOrder = response.data;
      
      // Add to orders list
      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      
      return newOrder;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create order';
      setError(errorMessage);
      console.error('Create order error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const myOrders = await orderService.getMyOrders();
      setOrders(myOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Get my orders error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getReceivedOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const received = await orderService.getReceivedOrders();
      setReceivedOrders(received);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch received orders');
      console.error('Get received orders error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrder(orderId);
      setCurrentOrder(order);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      console.error('Get order error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, statusData: UpdateOrderStatusData): Promise<Order> => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(orderId, statusData);
      const updatedOrder = response.data;
      
      // Update in orders list
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
      
      // Update in received orders list
      setReceivedOrders(prev => 
        prev.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
      
      // Update current order
      if (currentOrder?._id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      return updatedOrder;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      console.error('Update order status error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [currentOrder]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    orders,
    receivedOrders,
    currentOrder,
    isLoading,
    isCreating,
    isUpdating,
    error,
    
    // Actions
    createOrder,
    getMyOrders,
    getReceivedOrders,
    getOrder,
    updateOrderStatus,
    clearError,
    clearCurrentOrder,
  };
}