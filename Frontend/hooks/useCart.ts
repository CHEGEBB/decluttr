/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCart.ts - UPDATED WITH QUANTITY SUPPORT
'use client'

import { useState, useEffect, useCallback } from 'react';
import cartService, { Cart, CartItem, CartResponse } from '../services/cartService';

interface UseCartReturn {
  cart: Cart | null;
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  shippingFee: number;
  grandTotal: number;
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  error: string | null;
  
  // Actions
  getCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  incrementQuantity: (productId: string) => Promise<void>;
  decrementQuantity: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(600);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get cart on mount and update cart count
  const getCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: CartResponse = await cartService.getCart();
      
      if (response.success && response.data) {
        setCart(response.data.cart);
        setCartItems(response.data.cart.items || []);
        
        // Calculate cart count from quantities
        const count = response.data.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        setTotalPrice(response.data.totalPrice || 0);
        setShippingFee(response.data.shippingFee || 600);
        setGrandTotal(response.data.grandTotal || 0);
      }
    } catch (err: any) {
      if (err.message?.includes('Authentication required') || err.message?.includes('Cart not found')) {
        setCart(null);
        setCartItems([]);
        setCartCount(0);
        setTotalPrice(0);
        setGrandTotal(600);
      } else {
        setError(err.message || 'Failed to fetch cart');
        console.error('Get cart error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    getCart();
  }, [getCart]);

  // Add product to cart with quantity
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    setIsAdding(true);
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        // Refresh cart to get updated totals
        await getCart();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product to cart');
      console.error('Add to cart error:', err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [getCart]);

  // Update cart item quantity
  const updateCartItem = useCallback(async (productId: string, quantity: number) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        // Refresh cart to get updated totals
        await getCart();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
      console.error('Update cart item error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [getCart]);

  // Increment quantity by 1
  const incrementQuantity = useCallback(async (productId: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.incrementQuantity(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        // Refresh cart to get updated totals
        await getCart();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to increment quantity');
      console.error('Increment quantity error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [getCart]);

  // Decrement quantity by 1 (removes if quantity becomes 0)
  const decrementQuantity = useCallback(async (productId: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.decrementQuantity(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        // Refresh cart to get updated totals
        await getCart();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to decrement quantity');
      console.error('Decrement quantity error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [getCart]);

  // Remove product from cart
  const removeFromCart = useCallback(async (productId: string) => {
    setIsRemoving(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        // Refresh cart to get updated totals
        await getCart();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove product from cart');
      console.error('Remove from cart error:', err);
      throw err;
    } finally {
      setIsRemoving(false);
    }
  }, [getCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems([]);
        setCartCount(0);
        setTotalPrice(0);
        setGrandTotal(600);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId: string): boolean => {
    return cartItems.some(
      item => item.product._id === productId || item.product.id === productId
    );
  }, [cartItems]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    await getCart();
  }, [getCart]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    cart,
    cartItems,
    cartCount,
    totalPrice,
    shippingFee,
    grandTotal,
    isLoading,
    isAdding,
    isUpdating,
    isRemoving,
    error,
    
    // Actions
    getCart,
    addToCart,
    updateCartItem,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    refreshCart,
    clearError,
  };
}