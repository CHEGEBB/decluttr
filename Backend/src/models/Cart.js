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
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
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

// Remove duplicate products and sum their quantities
cartSchema.pre('save', async function() {
  const productMap = new Map();
  
  this.items.forEach(item => {
    const productId = item.product.toString();
    if (productMap.has(productId)) {
      const existing = productMap.get(productId);
      existing.quantity += item.quantity;
    } else {
      productMap.set(productId, {
        product: item.product,
        quantity: item.quantity,
        addedAt: item.addedAt
      });
    }
  });
  
  this.items = Array.from(productMap.values());
});

module.exports = mongoose.model('Cart', cartSchema);