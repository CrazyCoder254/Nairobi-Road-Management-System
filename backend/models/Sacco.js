const mongoose = require('mongoose');

const saccoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  licenseNumber: String,
  
  // Contact Information
  chairperson: { type: String, required: false },
  secretary: String,
  treasurer: String,
  phone: { type: String, required: true },
  email: String,
  address: String,
  
  // Operational Details
  routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
  
  // Financial Information
  accountBalance: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  pendingPayments: { type: Number, default: 0 },
  
  // Compliance
  licenseExpiry: Date,
  lastInspection: Date,
  nextInspection: Date,
  
  // Performance Metrics
  totalVehicles: { type: Number, default: 0 },
  activeVehicles: { type: Number, default: 0 },
  averageRating: { type: Number, default: 5 },
  totalComplaints: { type: Number, default: 0 },
  
  // Queue Management
  queueRanking: { type: Number, default: 0 },
  lastVehicleDispatched: Date,
  fairShareRatio: { type: Number, default: 1.0 },
  
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'], 
    default: 'active' 
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sacco', saccoSchema);
