const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mpesaNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  merchantRequestID: {
    type: String
  },
  checkoutRequestID: {
    type: String,
    unique: true,
    sparse: true
  },
  mpesaReceiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  transactionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['initiated', 'pending', 'completed', 'failed', 'cancelled'],
    default: 'initiated'
  },
  resultCode: {
    type: String
  },
  resultDesc: {
    type: String
  }
}, {
  timestamps: true
});


transactionSchema.index({ checkoutRequestID: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);