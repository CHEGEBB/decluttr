/* eslint-disable @typescript-eslint/no-explicit-any */
// services/cartService.ts - UPDATED WITH QUANTITY SUPPORT

import { Product } from './productService';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: {
    cart: Cart;
    totalPrice: number;
    shippingFee: number;
    grandTotal: number;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

// Token storage key
const TOKEN_KEY = 'decluttr_token';

class CartService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get current user's cart
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/cart`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch cart',
          error: data.error,
        } as ApiError;
      }

      return data as CartResponse;
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  /**
   * Add product to cart with quantity
   */
  async addToCart(productId: string, quantity: number = 1): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/cart/add`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to add product to cart',
          error: data.error,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(productId: string, quantity: number): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/cart/update/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to update cart item',
          error: data.error,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  }

  /**
   * Increment cart item quantity by 1
   */
  async incrementQuantity(productId: string): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      // Get current cart to find current quantity
      const cartResponse = await this.getCart();
      const currentItem = cartResponse.data.cart.items.find(
        item => item.product._id === productId || item.product.id === productId
      );
      
      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      return await this.updateCartItem(productId, currentItem.quantity + 1);
    } catch (error) {
      console.error('Increment quantity error:', error);
      throw error;
    }
  }

  /**
   * Decrement cart item quantity by 1 (removes if quantity becomes 0)
   */
  async decrementQuantity(productId: string): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      // Get current cart to find current quantity
      const cartResponse = await this.getCart();
      const currentItem = cartResponse.data.cart.items.find(
        item => item.product._id === productId || item.product.id === productId
      );
      
      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      if (currentItem.quantity <= 1) {
        // Remove item if quantity would become 0
        return await this.removeFromCart(productId);
      }

      return await this.updateCartItem(productId, currentItem.quantity - 1);
    } catch (error) {
      console.error('Decrement quantity error:', error);
      throw error;
    }
  }

  /**
   * Remove product from cart
   */
  async removeFromCart(productId: string): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to remove product from cart',
          error: data.error,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<{ 
    success: boolean; 
    message: string; 
    data: Cart 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/cart/clear`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to clear cart',
          error: data.error,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  /**
   * Get cart item count (sum of quantities)
   */
  async getCartCount(): Promise<number> {
    try {
      const cartData = await this.getCart();
      return cartData.data.cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Get cart count error:', error);
      return 0;
    }
  }

  /**
   * Check if product is in cart
   */
  async isInCart(productId: string): Promise<boolean> {
    try {
      const cartData = await this.getCart();
      return cartData.data.cart.items.some(
        item => item.product._id === productId || item.product.id === productId
      );
    } catch (error) {
      console.error('Check if in cart error:', error);
      return false;
    }
  }

  /**
   * Calculate cart totals
   */
  calculateCartTotals(items: CartItem[]): {
    totalPrice: number;
    shippingFee: number;
    grandTotal: number;
    itemCount: number;
  } {
    const totalPrice = items.reduce((sum, item) => {
      if (item.product.listingType === 'resale' && item.product.status === 'available') {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    const shippingFee = 600;
    const grandTotal = totalPrice + shippingFee;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalPrice,
      shippingFee,
      grandTotal,
      itemCount
    };
  }
}

// Create a singleton instance
const cartService = new CartService();
export default cartService;