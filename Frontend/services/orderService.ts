/* eslint-disable @typescript-eslint/no-explicit-any */

export interface OrderItem {
    product: string;
    seller: string;
    name: string;
    price: number;
    listingType: 'resale' | 'donation';
    category: string;
  }
  
  export interface PaymentInfo {
    checkoutRequestID: string;
    merchantRequestID: string;
    amount: number;
    phoneNumber: string;
    mpesaReceiptNumber?: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    transactionDate?: Date;
    initiatedAt: Date;
    _id?: string;
  }
  
  export interface Order {
    _id: string;
    buyer: {
      _id: string;
      name: string;
      email: string;
      phoneNumber?: string;
      location?: string;
    };
    items: OrderItem[];
    shippingAddress: string;
    shippingFee: number;
    totalAmount: number;
    payment?: PaymentInfo;
    paymentStatus: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    mpesaReceiptNumber?: string;
    paymentDate?: Date;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateOrderData {
    shippingAddress: string;
  }
  
  export interface OrderResponse {
    success: boolean;
    message: string;
    data: Order;
  }
  
  export interface OrdersResponse {
    success: boolean;
    message: string;
    data: Order[];
    count?: number;
  }
  
  export interface UpdateOrderStatusData {
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  }
  
  class OrderService {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
  
    private getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem('decluttr_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
  
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  
    /**
     * Create a new order from cart
     */
    async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/orders`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(orderData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to create order',
            error: data.error,
          };
        }
  
        return data as OrderResponse;
      } catch (error) {
        console.error('Create order error:', error);
        throw error;
      }
    }
  
    /**
     * Get current user's orders
     */
    async getMyOrders(): Promise<Order[]> {
      try {
        const response = await fetch(`${this.baseUrl}/orders`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to fetch orders',
            error: data.error,
          };
        }
  
        return data.data as Order[];
      } catch (error) {
        console.error('Get my orders error:', error);
        throw error;
      }
    }
  
    /**
     * Get orders received by current user (seller orders)
     */
    async getReceivedOrders(): Promise<Order[]> {
      try {
        const response = await fetch(`${this.baseUrl}/orders/received`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to fetch received orders',
            error: data.error,
          };
        }
  
        return data.data as Order[];
      } catch (error) {
        console.error('Get received orders error:', error);
        throw error;
      }
    }
  
    /**
     * Get order by ID
     */
    async getOrder(orderId: string): Promise<Order> {
      try {
        const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to fetch order',
            error: data.error,
          };
        }
  
        return data.data as Order;
      } catch (error) {
        console.error('Get order error:', error);
        throw error;
      }
    }
  
    /**
     * Update order status (for sellers)
     */
    async updateOrderStatus(orderId: string, statusData: UpdateOrderStatusData): Promise<OrderResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(statusData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to update order status',
            error: data.error,
          };
        }
  
        return data as OrderResponse;
      } catch (error) {
        console.error('Update order status error:', error);
        throw error;
      }
    }
  }
  
  // Create a singleton instance
  const orderService = new OrderService();
  export default orderService;