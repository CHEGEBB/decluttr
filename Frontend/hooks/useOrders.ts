/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useEffect } from 'react';
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

  // Log state changes
  useEffect(() => {
    console.log('🔄 useOrders state updated:', {
      ordersCount: orders.length,
      receivedOrdersCount: receivedOrders.length,
      isLoading,
      error
    });
  }, [orders, receivedOrders, isLoading, error]);

  const createOrder = useCallback(async (orderData: CreateOrderData): Promise<Order> => {
    console.log('🎯 useOrders: createOrder called with:', orderData);
    setIsCreating(true);
    setError(null);
    try {
      const response = await orderService.createOrder(orderData);
      const newOrder = response.data;
      
      console.log('✅ Order created:', newOrder);
      
      // Add to orders list
      setOrders(prev => {
        console.log('📝 Updating orders list, previous count:', prev.length);
        return [newOrder, ...prev];
      });
      setCurrentOrder(newOrder);
      
      return newOrder;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create order';
      console.error('❌ Create order error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    console.log('🎯 useOrders: getMyOrders called');
    setIsLoading(true);
    setError(null);
    try {
      const myOrders = await orderService.getMyOrders();
      console.log('✅ My orders fetched:', myOrders.length);
      setOrders(myOrders);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch orders';
      console.error('❌ Get my orders error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getReceivedOrders = useCallback(async () => {
    console.log('🎯 useOrders: getReceivedOrders called');
    setIsLoading(true);
    setError(null);
    try {
      console.log('📡 Calling orderService.getReceivedOrders...');
      const received = await orderService.getReceivedOrders();
      console.log('✅ Received orders fetched:', received.length);
      console.log('📦 Orders data:', received);
      
      setReceivedOrders(received);
      console.log('✅ receivedOrders state updated');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch received orders';
      console.error('❌ Get received orders error:', errorMessage);
      console.error('❌ Full error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      console.log('🏁 getReceivedOrders finally block, setting isLoading to false');
      setIsLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (orderId: string) => {
    console.log('🎯 useOrders: getOrder called with ID:', orderId);
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrder(orderId);
      console.log('✅ Order fetched:', order);
      setCurrentOrder(order);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch order';
      console.error('❌ Get order error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, statusData: UpdateOrderStatusData): Promise<Order> => {
    console.log('🎯 useOrders: updateOrderStatus called', { orderId, statusData });
    setIsUpdating(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(orderId, statusData);
      const updatedOrder = response.data;
      
      console.log('✅ Order status updated:', updatedOrder);
      
      // Update in orders list
      setOrders(prev => {
        const updated = prev.map(order => 
          order._id === orderId ? updatedOrder : order
        );
        console.log('📝 Updated orders list');
        return updated;
      });
      
      // Update in received orders list
      setReceivedOrders(prev => {
        const updated = prev.map(order => 
          order._id === orderId ? updatedOrder : order
        );
        console.log('📝 Updated received orders list');
        return updated;
      });
      
      // Update current order
      if (currentOrder?._id === orderId) {
        setCurrentOrder(updatedOrder);
        console.log('📝 Updated current order');
      }
      
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update order status';
      console.error('❌ Update order status error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [currentOrder]);

  const clearError = useCallback(() => {
    console.log('🧹 Clearing error');
    setError(null);
  }, []);

  const clearCurrentOrder = useCallback(() => {
    console.log('🧹 Clearing current order');
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