const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentType: {
    type: String,
    required: true,
    enum: [
      'permit_fee',
      'registration_fee',
      'insurance_premium',
      'license_renewal',
      'inspection_fee',
      'route_fee',
      'terminus_fee',
      'fine',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  referenceNumber: {
    type: String,
    unique: true,
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'card', 'cheque']
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ vehicle: 1 });
paymentSchema.index({ driver: 1 });
paymentSchema.index({ referenceNumber: 1 });

module.exports = mongoose.model('Payment', paymentSchema);