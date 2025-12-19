// models/Product.js (updated)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Books', 'Electronics', 'Shoes', 'Clothes', 'Furniture', 'Accessories', 'Sports', 'Home', 'Arts', 'Entertainment'],
      message: 'Please select a valid category'
    }
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  
  listingType: {
    type: String,
    required: [true, 'Please select listing type'],
    enum: {
      values: ['resale', 'donation'],
      message: 'Listing type must be either resale or donation'
    }
  },
  price: {
    type: Number,
    required: function() {
      return this.listingType === 'resale';
    },
    min: [0, 'Price cannot be negative'],
    max: [10000000, 'Price cannot exceed 10,000,000']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isOrdered: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'reserved'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: 'Nairobi'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'm', 'kg', 'g'],
      default: 'cm'
    }
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  model: {
    type: String,
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  color: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  warranty: {
    type: String,
    trim: true
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Text search index
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text', 
  model: 'text', 
  tags: 'text' 
});

// Compound indexes for better query performance
productSchema.index({ category: 1, listingType: 1, status: 1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ status: 1, isVerified: 1 });
productSchema.index({ price: 1 });
productSchema.index({ views: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for frontend ID
productSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);