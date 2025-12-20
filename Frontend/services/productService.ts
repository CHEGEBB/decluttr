/* eslint-disable @typescript-eslint/no-explicit-any */
// services/productService.ts

export interface Product {
  id: string;
  _id?: string; // Backend MongoDB ID
  name: string;
  description: string;
  images: { public_id: string; url: string }[];
  category: 'Books' | 'Electronics' | 'Shoes' | 'Clothes' | 'Furniture' | 'Accessories' | 'Sports' | 'Home' | 'Arts' | 'Entertainment';
  listingType: 'resale' | 'donation';
  price: number;
  seller: {
    _id: string;
    name: string;
    username: string;
    email?: string;
    location: string;
    ratings: number;
    totalExchanges?: number;
    phoneNumber?: string;
  };
  isVerified: boolean;
  isOrdered: boolean;
  status: 'available' | 'pending' | 'sold';
  views: number;
  createdAt: string;
  updatedAt: string;
  condition?: string;
  location?: string;
  rating?: number;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  material?: string;
  warranty?: string;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  listingType: 'resale' | 'donation';
  price?: number;
  images: File[];
  condition?: string;
  location?: string;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  material?: string;
  warranty?: string;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface ProductFilters {
  category?: string;
  listingType?: string;
  search?: string;
  page?: number;
  limit?: number;
  verified?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: string[];
  error?: string;
}

// Token storage keys
const TOKEN_KEY = 'decluttr_token';
const USER_KEY = 'decluttr_user';

class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    
    if (!token) {
      return {
        'Content-Type': 'application/json',
      };
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all products with optional filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<{ 
    data: Product[]; 
    totalPages: number; 
    currentPage: number; 
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const url = `${this.baseUrl}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch products',
          error: data.error,
        } as ApiError;
      }

      // Transform backend data to match Product interface
      const transformedProducts = data.data.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        category: product.category,
        listingType: product.listingType,
        price: product.price || 0,
        seller: product.seller || {
          _id: '',
          name: 'Unknown Seller',
          username: 'unknown',
          location: 'Nairobi',
          ratings: 4.5
        },
        isVerified: product.isVerified || false,
        isOrdered: product.isOrdered || false,
        status: product.status || 'available',
        views: product.views || 0,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        condition: product.condition || 'Good',
        location: product.location || product.seller?.location || 'Nairobi',
        rating: product.seller?.ratings || 4.5,
        brand: product.brand,
        model: product.model,
        color: product.color,
        size: product.size,
        material: product.material,
        warranty: product.warranty,
        tags: product.tags || [],
        specifications: product.specifications || {}
      }));

      return {
        data: transformedProducts,
        totalPages: data.pagination?.totalPages || data.totalPages || 1,
        currentPage: data.pagination?.currentPage || data.currentPage || 1,
        total: data.pagination?.total || data.total || transformedProducts.length,
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch product',
          error: data.error,
        } as ApiError;
      }

      const product = data.data;
      return {
        id: product._id || product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        category: product.category,
        listingType: product.listingType,
        price: product.price || 0,
        seller: product.seller || {
          _id: '',
          name: 'Unknown Seller',
          username: 'unknown',
          location: 'Nairobi',
          ratings: 4.5
        },
        isVerified: product.isVerified || false,
        isOrdered: product.isOrdered || false,
        status: product.status || 'available',
        views: product.views || 0,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        condition: product.condition || 'Good',
        location: product.location || product.seller?.location || 'Nairobi',
        rating: product.seller?.ratings || 4.5,
        brand: product.brand,
        model: product.model,
        color: product.color,
        size: product.size,
        material: product.material,
        warranty: product.warranty,
        tags: product.tags || [],
        specifications: product.specifications || {}
      };
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  /**
   * Create new product (requires authentication)
   */
  async createProduct(productData: CreateProductData): Promise<ProductResponse> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('listingType', productData.listingType);
      
      if (productData.listingType === 'resale' && productData.price !== undefined) {
        formData.append('price', productData.price.toString());
      }
      
      // Append optional fields
      if (productData.condition) formData.append('condition', productData.condition);
      if (productData.location) formData.append('location', productData.location);
      if (productData.brand) formData.append('brand', productData.brand);
      if (productData.model) formData.append('model', productData.model);
      if (productData.color) formData.append('color', productData.color);
      if (productData.size) formData.append('size', productData.size);
      if (productData.material) formData.append('material', productData.material);
      if (productData.warranty) formData.append('warranty', productData.warranty);
      if (productData.tags) formData.append('tags', JSON.stringify(productData.tags));
      if (productData.specifications) formData.append('specifications', JSON.stringify(productData.specifications));

      // Add images
      productData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to create product',
          errors: data.errors,
          error: data.error,
        } as ApiError;
      }

      // Transform the response data to match Product interface
      if (data.success && data.data) {
        const product = data.data;
        data.data = {
          id: product._id || product.id,
          name: product.name,
          description: product.description,
          images: product.images || [],
          category: product.category,
          listingType: product.listingType,
          price: product.price || 0,
          seller: product.seller,
          isVerified: product.isVerified || false,
          isOrdered: product.isOrdered || false,
          status: product.status || 'available',
          views: product.views || 0,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
          condition: product.condition || 'Good',
          location: product.location || product.seller?.location || 'Nairobi',
          rating: product.seller?.ratings || 4.5,
          brand: product.brand,
          model: product.model,
          color: product.color,
          size: product.size,
          material: product.material,
          warranty: product.warranty,
          tags: product.tags || [],
          specifications: product.specifications || {}
        };
      }

      return data as ProductResponse;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  /**
   * Update product (requires authentication and ownership)
   */
  async updateProduct(id: string, productData: Partial<CreateProductData>): Promise<ProductResponse> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to update product',
          errors: data.errors,
          error: data.error,
        } as ApiError;
      }

      // Transform the response data to match Product interface
      if (data.success && data.data) {
        const product = data.data;
        data.data = {
          id: product._id || product.id,
          name: product.name,
          description: product.description,
          images: product.images || [],
          category: product.category,
          listingType: product.listingType,
          price: product.price || 0,
          seller: product.seller,
          isVerified: product.isVerified || false,
          isOrdered: product.isOrdered || false,
          status: product.status || 'available',
          views: product.views || 0,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
          condition: product.condition || 'Good',
          location: product.location || product.seller?.location || 'Nairobi',
          rating: product.seller?.ratings || 4.5,
          brand: product.brand,
          model: product.model,
          color: product.color,
          size: product.size,
          material: product.material,
          warranty: product.warranty,
          tags: product.tags || [],
          specifications: product.specifications || {}
        };
      }

      return data as ProductResponse;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  /**
   * Delete product (requires authentication and ownership)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to delete product',
          error: data.error,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  /**
   * Get current user's products
   */
  async getMyProducts(): Promise<Product[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/products/my/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch your products',
          error: data.error,
        } as ApiError;
      }

      // Transform backend data to match Product interface
      return data.data.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        category: product.category,
        listingType: product.listingType,
        price: product.price || 0,
        seller: product.seller || {
          _id: '',
          name: 'Unknown Seller',
          username: 'unknown',
          location: 'Nairobi',
          ratings: 4.5
        },
        isVerified: product.isVerified || false,
        isOrdered: product.isOrdered || false,
        status: product.status || 'available',
        views: product.views || 0,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        condition: product.condition || 'Good',
        location: product.location || product.seller?.location || 'Nairobi',
        rating: product.seller?.ratings || 4.5,
        brand: product.brand,
        model: product.model,
        color: product.color,
        size: product.size,
        material: product.material,
        warranty: product.warranty,
        tags: product.tags || [],
        specifications: product.specifications || {}
      }));
    } catch (error) {
      console.error('Get my products error:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/featured?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch featured products',
          error: data.error,
        } as ApiError;
      }

      // Transform backend data to match Product interface
      return data.data.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        category: product.category,
        listingType: product.listingType,
        price: product.price || 0,
        seller: product.seller || {
          _id: '',
          name: 'Unknown Seller',
          username: 'unknown',
          location: 'Nairobi',
          ratings: 4.5
        },
        isVerified: product.isVerified || false,
        isOrdered: product.isOrdered || false,
        status: product.status || 'available',
        views: product.views || 0,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        condition: product.condition || 'Good',
        location: product.location || product.seller?.location || 'Nairobi',
        rating: product.seller?.ratings || 4.5,
        brand: product.brand,
        model: product.model,
        color: product.color,
        size: product.size,
        material: product.material,
        warranty: product.warranty,
        tags: product.tags || [],
        specifications: product.specifications || {}
      }));
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string, filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const searchFilters = { ...filters, search: query };
      const result = await this.getProducts(searchFilters);
      return result.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const categoryFilters = { ...filters, category };
      const result = await this.getProducts(categoryFilters);
      return result.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  }

  /**
   * Get similar products
   */
  async getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      // First get the product to know its category
      const product = await this.getProduct(productId);
      
      // Then get products from same category
      const similarProducts = await this.getProductsByCategory(product.category, { limit });
      
      // Filter out the current product
      return similarProducts.filter(p => p.id !== productId).slice(0, limit);
    } catch (error) {
      console.error('Get similar products error:', error);
      throw error;
    }
  }

  /**
   * Get product statistics
   */
  async getProductStats(): Promise<{
    totalProducts: number;
    totalViews: number;
    totalSold: number;
    totalRevenue: number;
    categoryDistribution: Record<string, number>;
  }> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/products/my/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || 'Failed to fetch product stats',
          error: data.error,
        } as ApiError;
      }

      return data.data || {
        totalProducts: 0,
        totalViews: 0,
        totalSold: 0,
        totalRevenue: 0,
        categoryDistribution: {}
      };
    } catch (error) {
      console.error('Get product stats error:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const productService = new ProductService();
export default productService;