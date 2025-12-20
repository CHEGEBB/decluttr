/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Camera, 
  Package, 
  DollarSign,
  Hash,
  Shield,
  Check,
  Loader2
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CreateProductData } from '@/services/productService';

const ProductListForm = () => {
  const { createProduct, isCreating } = useProducts();
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    category: '',
    listingType: 'resale',
    price: 0,
    images: [],
    condition: 'Good',
    location: 'Nairobi',
    brand: '',
    model: '',
    color: '',
    size: '',
    material: '',
    warranty: '',
    tags: []
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Electronics',
    'Clothes',
    'Shoes',
    'Furniture',
    'Books',
    'Accessories',
    'Home & Garden',
    'Sports & Fitness',
    'Toys & Games',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Needs Repair'
  ];

  const locations = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Eldoret',
    'Nakuru',
    'Thika',
    'Kitale',
    'Malindi',
    'Other'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const newImageFiles: File[] = [];
    
    for (let i = 0; i < Math.min(files.length, 5 - imageFiles.length); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === Math.min(files.length, 5 - imageFiles.length)) {
          setImages(prev => [...prev, ...newImages].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
      newImageFiles.push(file);
    }
    
    setImageFiles(prev => [...prev, ...newImageFiles].slice(0, 5));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageFiles].slice(0, 5) }));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.listingType === 'resale' && (!formData.price || formData.price <= 0)) {
      setError('Please enter a valid price for resale items');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      const productData: CreateProductData = {
        ...formData,
        // Ensure price is included for resale
        price: formData.listingType === 'resale' ? formData.price : undefined,
        // Map category to backend format
        category: mapCategoryToBackend(formData.category),
        // Convert tags string to array if needed
        tags: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : [formData.tags]) : []
      };

      const response = await createProduct(productData);
      
      if (response.success) {
        setIsSubmitted(true);
        
        // Reset form
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            description: '',
            category: '',
            listingType: 'resale',
            price: 0,
            images: [],
            condition: 'Good',
            location: 'Nairobi',
            brand: '',
            model: '',
            color: '',
            size: '',
            material: '',
            warranty: '',
            tags: []
          });
          setImages([]);
          setImageFiles([]);
        }, 3000);
      } else {
        setError(response.message || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const mapCategoryToBackend = (category: string): string => {
    const mapping: Record<string, string> = {
      'Electronics': 'Electronics',
      'Clothes': 'Clothes',
      'Shoes': 'Shoes',
      'Furniture': 'Furniture',
      'Books': 'Books',
      'Accessories': 'Accessories',
      'Home & Garden': 'Home',
      'Sports & Fitness': 'Sports',
      'Toys & Games': 'Entertainment',
      'Other': 'Other'
    };
    return mapping[category] || 'Other';
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Product Listed Successfully!</h3>
        <p className="text-gray-600 mb-6">
          Your item is now live on the marketplace. Buyers can view and purchase it immediately.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            List Another Item
          </button>
          <button 
            onClick={() => window.location.href = '/main/profile?tab=dashboard'}
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:border-red-500 hover:text-red-600 transition-all"
          >
            View Your Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">List Your Product</h2>
        <p className="text-gray-600">Fill in the details below to add your item to the marketplace</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Images *
            <span className="text-xs text-gray-500 ml-2">(Upload up to 5 images)</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Upload Button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Images</span>
              <span className="text-xs text-gray-500">Max 5 images</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden placeholder:text-gray-400 text-gray-500"
              />
            </div>

            {/* Preview Images */}
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}

            {/* Empty Slots */}
            {[...Array(5 - images.length)].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center"
              >
                <div className="text-gray-300 text-2xl">+</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="e.g., iPhone 13 Pro 256GB Like New"
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              required
              className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
            >
              <option value="">Select condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="resale"
                  checked={formData.listingType === 'resale'}
                  onChange={(e) => setFormData({...formData, listingType: 'resale' as any})}
                  className="mr-2 placeholder:text-gray-400 text-gray-500"
                />
                <span className="text-gray-700">Resale</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="donation"
                  checked={formData.listingType === 'donation'}
                  onChange={(e) => setFormData({...formData, listingType: 'donation' as any})}
                  className="mr-2 placeholder:text-gray-400 text-gray-500"
                />
                <span className="text-gray-700">Donation</span>
              </label>
            </div>
          </div>

          {/* Price - Only show for Resale */}
          {formData.listingType === 'resale' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KSh) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required={formData.listingType === 'resale'}
                  className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter price"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
              className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows={6}
            className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            placeholder="Describe your item in detail. Include features, specifications, and any flaws..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </div>
        </div>

        {/* Optional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand (Optional)
            </label>
            <input
              type="text"
              value={formData.brand || ''}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 placeholder:text-gray-400 text-gray-500 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="e.g., Apple, Nike, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model (Optional)
            </label>
            <input
              type="text"
              value={formData.model || ''}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 placeholder:text-gray-400 text-gray-500 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="e.g., iPhone 13 Pro, Air Max 270, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color (Optional)
            </label>
            <input
              type="text"
              value={formData.color || ''}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="e.g., Black, Red, Blue, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (Optional)
            </label>
            <input
              type="text"
              value={formData.size || ''}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 placeholder:text-gray-400 text-gray-500 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="e.g., M, 42, Large, etc."
            />
          </div>
        </div>

        {/* Verification & Terms */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Verification & Terms</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All items must be accurately described</li>
                <li>• Images must be of the actual item for sale</li>
                <li>• Prohibited items are not allowed</li>
                <li>• You agree to our Terms of Service</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isCreating || imageFiles.length === 0}
            className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Listing Your Product...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                List Product on Marketplace
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Your item will be live immediately and visible to all buyers
          </p>
        </div>
      </form>
    </div>
  );
};

export default ProductListForm;