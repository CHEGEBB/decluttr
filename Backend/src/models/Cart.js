const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

cartSchema.index({ user: 1 }, { unique: true });

cartSchema.pre('save', function(next) {
  const seen = new Set();
  this.items = this.items.filter(item => {
    const productId = item.product.toString();
    if (seen.has(productId)) {
      return false; 
    }
    seen.add(productId);
    return true; 
  });
  next();
});

module.exports = mongoose.model('Cart', cartSchema);