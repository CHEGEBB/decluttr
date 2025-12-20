// lib/api/client.ts
// Base API client for all requests - Uses existing authService

import authService from '@/services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiError {
  success: false;
  message: string;
  error?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    // Only access localStorage on client side
    if (typeof window === 'undefined') return null;
    
    const token = authService.getToken();
    
    // Debug logging
    if (!token) {
      console.warn('⚠️ No auth token found. User may not be logged in.');
    } else {
      console.log('✅ Auth token found:', token.substring(0, 20) + '...');
    }
    
    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Debug logging
    console.log('🌐 API Request:', {
      url: `${this.baseURL}${endpoint}`,
      method: options.method || 'GET',
      hasToken: !!token,
      headers: { ...headers, Authorization: token ? 'Bearer ***' : 'none' }
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle empty responses (like 204 No Content)
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: response.ok };
      }

      // Debug logging
      console.log('📥 API Response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        // Special handling for auth errors
        if (response.status === 401) {
          console.error('🔒 Authentication failed. Token may be expired or invalid.');
          
          // Optional: Clear token and redirect to login
          if (typeof window !== 'undefined') {
            authService.logout();
            window.location.href = '/login';
          }
        }
        
        throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // For file uploads (products with images)
  async uploadFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('📤 Uploading FormData:', {
      url: `${this.baseURL}${endpoint}`,
      hasToken: !!token
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.error('🔒 Authentication failed during upload.');
          if (typeof window !== 'undefined') {
            authService.logout();
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload failed');
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;