/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/api.ts
import authService from '@/services/authService';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  async get(endpoint: string) {
    const headers = authService.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  async post(endpoint: string, data: any) {
    const headers = authService.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  async put(endpoint: string, data: any) {
    const headers = authService.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  async delete(endpoint: string) {
    const headers = authService.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  // For file uploads
  async upload(endpoint: string, formData: FormData) {
    const token = authService.getToken();
    const headers: HeadersInit = token 
      ? { 'Authorization': `Bearer ${token}` }
      : {};

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }
}

export const api = new ApiService();