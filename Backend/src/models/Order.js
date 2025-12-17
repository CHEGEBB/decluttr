const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    listingType: {
      type: String,
      enum: ['resale', 'donation'],
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    type: String,
    required: [true, 'Please provide shipping address']
  },
  shippingFee: {
    type: Number,
    default: 600
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  mpesaReceiptNumber: {
    type: String
  },
  paymentDate: {
    type: Date
  }
}, {
  timestamps: true
});

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);