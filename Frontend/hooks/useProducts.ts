/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProducts.ts
'use client'

import { useState, useCallback } from 'react';
import productService, { 
  Product, 
  ProductFilters, 
  CreateProductData,
  ProductResponse 
} from '../services/productService';

interface UseProductsReturn {
  products: Product[];
  featuredProducts: Product[];
  myProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  
  // Actions
  getProducts: (filters?: ProductFilters) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  createProduct: (productData: CreateProductData) => Promise<ProductResponse>;
  updateProduct: (id: string, productData: Partial<CreateProductData>) => Promise<ProductResponse>;
  deleteProduct: (id: string) => Promise<void>;
  getMyProducts: () => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string, filters?: ProductFilters) => Promise<void>;
  getProductsByCategory: (category: string, filters?: ProductFilters) => Promise<void>;
  getSimilarProducts: (productId: string) => Promise<Product[]>;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const getProducts = useCallback(async (filters: ProductFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(filters);
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setTotalProducts(result.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Get products error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await productService.getProduct(id);
      setCurrentProduct(product);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      console.error('Get product error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: CreateProductData): Promise<ProductResponse> => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      
      // Add new product to my products list
      if (response.success && response.data) {
        const newProduct = response.data as Product;
        setMyProducts(prev => [newProduct, ...prev]);
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      console.error('Create product error:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<CreateProductData>): Promise<ProductResponse> => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData);
      
      // Only update state if the update was successful
      if (response.success && response.data) {
        const updatedProduct = response.data as Product;
        
        // Update in products list
        setProducts(prev => 
          prev.map(product => 
            product.id === id ? updatedProduct : product
          )
        );
        
        // Update in my products list
        setMyProducts(prev => 
          prev.map(product => 
            product.id === id ? updatedProduct : product
          )
        );
        
        // Update current product if it's the one being updated
        if (currentProduct?.id === id) {
          setCurrentProduct(updatedProduct);
        }
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      console.error('Update product error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [currentProduct]);

  const deleteProduct = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      
      // Remove from products list
      setProducts(prev => prev.filter(product => product.id !== id));
      
      // Remove from my products list
      setMyProducts(prev => prev.filter(product => product.id !== id));
      
      // Clear current product if it's the one being deleted
      if (currentProduct?.id === id) {
        setCurrentProduct(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      console.error('Delete product error:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [currentProduct]);

  const getMyProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const myProductsData = await productService.getMyProducts();
      setMyProducts(myProductsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your products');
      console.error('Get my products error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFeaturedProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const featured = await productService.getFeaturedProducts();
      setFeaturedProducts(featured);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch featured products');
      console.error('Get featured products error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string, filters: ProductFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await productService.searchProducts(query, filters);
      setProducts(searchResults);
    } catch (err: any) {
      setError(err.message || 'Failed to search products');
      console.error('Search products error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string, filters: ProductFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const categoryProducts = await productService.getProductsByCategory(category, filters);
      setProducts(categoryProducts);
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${category} products`);
      console.error('Get products by category error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSimilarProducts = useCallback(async (productId: string): Promise<Product[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const similar = await productService.getSimilarProducts(productId);
      return similar;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch similar products');
      console.error('Get similar products error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentProduct = useCallback(() => {
    setCurrentProduct(null);
  }, []);

  return {
    products,
    featuredProducts,
    myProducts,
    currentProduct,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    totalPages,
    currentPage,
    totalProducts,
    
    // Actions
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getFeaturedProducts,
    searchProducts,
    getProductsByCategory,
    getSimilarProducts,
    clearError,
    clearCurrentProduct,
  };
}