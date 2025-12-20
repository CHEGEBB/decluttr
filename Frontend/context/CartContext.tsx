/* eslint-disable @typescript-eslint/no-explicit-any */
// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import cartService, { Cart, CartItem, CartResponse } from '@/services/cartService';

interface CartContextType {
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
  refreshCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  incrementQuantity: (productId: string) => Promise<void>;
  decrementQuantity: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
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
  const { isAuthenticated } = useAuth();

  const getCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setCartItems([]);
      setCartCount(0);
      setTotalPrice(0);
      setGrandTotal(600);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response: CartResponse = await cartService.getCart();
      
      if (response.success && response.data) {
        setCart(response.data.cart);
        setCartItems(response.data.cart.items || []);
        
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
  }, [isAuthenticated]);

  const refreshCart = useCallback(async () => {
    await getCart();
  }, [getCart]);

  const getCartCount = useCallback(async (): Promise<number> => {
    if (!isAuthenticated) return 0;
    
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
      return count;
    } catch (err: any) {
      console.error('Get cart count error:', err);
      setCartCount(0);
      return 0;
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    setIsAdding(true);
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        const count = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        const itemsTotal = response.data.items?.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
        setTotalPrice(itemsTotal);
        
        const shipping = response.data.items?.length > 0 ? 600 : 0;
        setShippingFee(shipping);
        setGrandTotal(itemsTotal + shipping);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product to cart');
      console.error('Add to cart error:', err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateCartItem = useCallback(async (productId: string, quantity: number) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        const count = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        const itemsTotal = response.data.items?.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
        setTotalPrice(itemsTotal);
        
        const shipping = response.data.items?.length > 0 ? 600 : 0;
        setShippingFee(shipping);
        setGrandTotal(itemsTotal + shipping);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
      console.error('Update cart item error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const incrementQuantity = useCallback(async (productId: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.incrementQuantity(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        const count = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        const itemsTotal = response.data.items?.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
        setTotalPrice(itemsTotal);
        
        const shipping = response.data.items?.length > 0 ? 600 : 0;
        setShippingFee(shipping);
        setGrandTotal(itemsTotal + shipping);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to increment quantity');
      console.error('Increment quantity error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const decrementQuantity = useCallback(async (productId: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await cartService.decrementQuantity(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        const count = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        const itemsTotal = response.data.items?.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
        setTotalPrice(itemsTotal);
        
        const shipping = response.data.items?.length > 0 ? 600 : 0;
        setShippingFee(shipping);
        setGrandTotal(itemsTotal + shipping);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to decrement quantity');
      console.error('Decrement quantity error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setIsRemoving(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        
        const count = response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
        
        const itemsTotal = response.data.items?.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
        setTotalPrice(itemsTotal);
        
        const shipping = response.data.items?.length > 0 ? 600 : 0;
        setShippingFee(shipping);
        setGrandTotal(itemsTotal + shipping);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove product from cart');
      console.error('Remove from cart error:', err);
      throw err;
    } finally {
      setIsRemoving(false);
    }
  }, []);

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
        setShippingFee(0);
        setGrandTotal(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <CartContext.Provider
      value={{
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
        refreshCart,
        getCartCount,
        addToCart,
        updateCartItem,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}