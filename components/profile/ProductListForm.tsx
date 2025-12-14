'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Camera, 
  Package, 
  DollarSign,
  Calendar,
  Hash,
  Shield,
  Check
} from 'lucide-react';

const ProductListForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    type: 'Resale',
    price: '',
    quantity: '1',
    location: 'Nairobi',
    contactInfo: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === Math.min(files.length, 5)) {
          setImages(prev => [...prev, ...newImages].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        condition: '',
        type: 'Resale',
        price: '',
        quantity: '1',
        location: 'Nairobi',
        contactInfo: ''
      });
      setImages([]);
    }, 3000);
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
          <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:border-red-500 hover:text-red-600 transition-all">
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
                className="hidden"
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
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
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
                  value="Resale"
                  checked={formData.type === 'Resale'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className="text-gray-700">Resale</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Donation"
                  checked={formData.type === 'Donation'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className="text-gray-700">Donation</span>
              </label>
            </div>
          </div>

          {/* Price - Only show for Resale */}
          {formData.type === 'Resale' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KSh) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required={formData.type === 'Resale'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter price"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Quantity"
                min="1"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            placeholder="Describe your item in detail. Include features, specifications, and any flaws..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Information
            <span className="text-xs text-gray-500 ml-2">(For buyers to contact you)</span>
          </label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Phone number or preferred contact method"
          />
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
            disabled={isSubmitting || images.length === 0}
            className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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