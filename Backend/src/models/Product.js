const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Books', 'Electronics', 'Shoes', 'Clothes', 'Furniture'],
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
    min: [0, 'Price cannot be negative']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, listingType: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);