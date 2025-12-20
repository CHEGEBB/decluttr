/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback } from 'react';
import paymentService, { 
  InitiatePaymentData, 
  PaymentStatusResponse 
} from '../services/paymentService';

interface UsePaymentReturn {
  isProcessing: boolean;
  isCheckingStatus: boolean;
  paymentStatus: string | null;
  checkoutRequestID: string | null;
  error: string | null;
  
  // Actions
  initiatePayment: (paymentData: InitiatePaymentData) => Promise<void>;
  checkPaymentStatus: (orderId: string) => Promise<PaymentStatusResponse>;
  formatPhoneNumber: (phoneNumber: string) => string;
  validatePhoneNumber: (phoneNumber: string) => boolean;
  clearPaymentState: () => void;
  clearError: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (paymentData: InitiatePaymentData) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate phone number
      if (!paymentService.validatePhoneNumber(paymentData.phoneNumber)) {
        throw new Error('Invalid phone number. Please use format: 2547XXXXXXXX or 07XXXXXXXX');
      }

      const response = await paymentService.initiatePayment(paymentData);
      
      setCheckoutRequestID(response.data.checkoutRequestID);
      setPaymentStatus('pending');
      
      // Start polling for payment status
      setTimeout(() => {
        checkPaymentStatus(paymentData.orderId);
      }, 5000);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Payment initiation failed';
      setError(errorMessage);
      console.error('Initiate payment error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (orderId: string): Promise<PaymentStatusResponse> => {
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      const response = await paymentService.checkPaymentStatus(orderId);
      
      setPaymentStatus(response.data.paymentStatus);
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to check payment status';
      setError(errorMessage);
      console.error('Check payment status error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  const formatPhoneNumber = useCallback((phoneNumber: string): string => {
    return paymentService.formatMpesaPhoneNumber(phoneNumber);
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber: string): boolean => {
    return paymentService.validatePhoneNumber(phoneNumber);
  }, []);

  const clearPaymentState = useCallback(() => {
    setIsProcessing(false);
    setIsCheckingStatus(false);
    setPaymentStatus(null);
    setCheckoutRequestID(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    isCheckingStatus,
    paymentStatus,
    checkoutRequestID,
    error,
    
    // Actions
    initiatePayment,
    checkPaymentStatus,
    formatPhoneNumber,
    validatePhoneNumber,
    clearPaymentState,
    clearError,
  };
}