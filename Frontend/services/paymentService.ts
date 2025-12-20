/* eslint-disable @typescript-eslint/no-explicit-any */

export interface InitiatePaymentData {
    phoneNumber: string;
    amount: number;
    orderId: string;
    accountReference?: string;
    transactionDesc?: string;
  }
  
  export interface PaymentResponse {
    success: boolean;
    message: string;
    data: {
      checkoutRequestID: string;
      merchantRequestID: string;
      responseCode: string;
      responseDescription: string;
      customerMessage: string;
    };
  }
  
  export interface PaymentStatusResponse {
    success: boolean;
    data: {
      paymentStatus: string;
      orderStatus: string;
      transaction: {
        _id?: string;
        mpesaReceiptNumber?: string;
        amount: number;
        status: string;
        transactionDate?: Date;
      };
    };
  }
  
  class PaymentService {
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
     * Initiate M-Pesa STK Push payment
     */
    async initiatePayment(paymentData: InitiatePaymentData): Promise<PaymentResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/payments/initiate`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(paymentData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to initiate payment',
            error: data.error || data.responseDescription,
          };
        }
  
        return data as PaymentResponse;
      } catch (error) {
        console.error('Initiate payment error:', error);
        throw error;
      }
    }
  
    /**
     * Check payment status
     */
    async checkPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/payments/status/${orderId}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw {
            success: false,
            message: data.message || 'Failed to check payment status',
            error: data.error,
          };
        }
  
        return data as PaymentStatusResponse;
      } catch (error) {
        console.error('Check payment status error:', error);
        throw error;
      }
    }
  
    /**
     * Format phone number to M-Pesa format
     */
    formatMpesaPhoneNumber(phoneNumber: string): string {
      let formatted = phoneNumber.replace(/\+/g, '').replace(/\s/g, '');
      
      if (formatted.startsWith('0')) {
        formatted = '254' + formatted.slice(1);
      }
      
      if (!formatted.startsWith('254')) {
        formatted = '254' + formatted;
      }
      
      return formatted;
    }
  
    /**
     * Validate phone number format
     */
    validatePhoneNumber(phoneNumber: string): boolean {
      const formatted = this.formatMpesaPhoneNumber(phoneNumber);
      return formatted.length === 12 && formatted.startsWith('254');
    }
  }
  
  // Create a singleton instance
  const paymentService = new PaymentService();
  export default paymentService;