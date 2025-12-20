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
      console.log('🔧 OrderService initialized with baseUrl:', this.baseUrl);
    }
  
    private getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem('decluttr_token');
      
      if (!token) {
        console.error('❌ No authentication token found');
        throw new Error('Authentication required. Please log in.');
      }
  
      console.log('✅ Auth token found');
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  
    /**
     * Create a new order from cart
     */
    async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
      console.log('📡 Creating order with data:', orderData);
      try {
        const url = `${this.baseUrl}/orders`;
        console.log('📡 POST request to:', url);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(orderData),
        });
  
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📡 Response data:', data);
  
        if (!response.ok) {
          console.error('❌ Create order failed:', data);
          throw new Error(data.message || 'Failed to create order');
        }
  
        console.log('✅ Order created successfully:', data.data);
        return data as OrderResponse;
      } catch (error: any) {
        console.error('❌ Create order error:', error);
        throw new Error(error.message || 'Failed to create order');
      }
    }
  
    /**
     * Get current user's orders (as buyer)
     */
    async getMyOrders(): Promise<Order[]> {
      console.log('📡 Fetching my orders (as buyer)...');
      try {
        const url = `${this.baseUrl}/orders`;
        console.log('📡 GET request to:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📡 Response data:', data);
  
        if (!response.ok) {
          console.error('❌ Get my orders failed:', data);
          throw new Error(data.message || 'Failed to fetch orders');
        }
  
        console.log('✅ My orders fetched successfully. Count:', data.data?.length || 0);
        return data.data as Order[];
      } catch (error: any) {
        console.error('❌ Get my orders error:', error);
        throw new Error(error.message || 'Failed to fetch orders');
      }
    }
  
    /**
     * Get orders received by current user (as seller)
     */
    async getReceivedOrders(): Promise<Order[]> {
      console.log('📡 Fetching received orders (as seller)...');
      try {
        const url = `${this.baseUrl}/orders/received`;
        console.log('📡 GET request to:', url);
        
        const headers = this.getAuthHeaders() as Record<string, string>;
        console.log('📡 Request headers:', {
          ...headers,
          Authorization: headers['Authorization'] ? '✓ Present' : '✗ Missing'
        });
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
  
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('📡 Response data:', data);
  
        if (!response.ok) {
          console.error('❌ Get received orders failed:', data);
          throw new Error(data.message || 'Failed to fetch received orders');
        }
  
        console.log('✅ Received orders fetched successfully. Count:', data.data?.length || 0);
        
        if (data.data && Array.isArray(data.data)) {
          console.log('📦 Orders preview:', data.data.map((order: Order) => ({
            id: order._id,
            buyer: order.buyer?.name || 'Unknown',
            items: order.items?.length || 0,
            status: order.orderStatus,
            total: order.totalAmount
          })));
        }
        
        return data.data as Order[];
      } catch (error: any) {
        console.error('❌ Get received orders error:', error);
        console.error('Error stack:', error.stack);
        throw new Error(error.message || 'Failed to fetch received orders');
      }
    }
  
    /**
     * Get order by ID
     */
    async getOrder(orderId: string): Promise<Order> {
      console.log('📡 Fetching order:', orderId);
      try {
        const url = `${this.baseUrl}/orders/${orderId}`;
        console.log('📡 GET request to:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📡 Response data:', data);
  
        if (!response.ok) {
          console.error('❌ Get order failed:', data);
          throw new Error(data.message || 'Failed to fetch order');
        }
  
        console.log('✅ Order fetched successfully');
        return data.data as Order;
      } catch (error: any) {
        console.error('❌ Get order error:', error);
        throw new Error(error.message || 'Failed to fetch order');
      }
    }
  
    /**
     * Update order status (for sellers)
     */
    async updateOrderStatus(orderId: string, statusData: UpdateOrderStatusData): Promise<OrderResponse> {
      console.log('📡 Updating order status:', orderId, statusData);
      try {
        const url = `${this.baseUrl}/orders/${orderId}/status`;
        console.log('📡 PUT request to:', url);
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(statusData),
        });
  
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📡 Response data:', data);
  
        if (!response.ok) {
          console.error('❌ Update order status failed:', data);
          throw new Error(data.message || 'Failed to update order status');
        }
  
        console.log('✅ Order status updated successfully');
        return data as OrderResponse;
      } catch (error: any) {
        console.error('❌ Update order status error:', error);
        throw new Error(error.message || 'Failed to update order status');
      }
    }
  }
  
  // Create a singleton instance
  const orderService = new OrderService();
  export default orderService;