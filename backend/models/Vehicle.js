const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true, uppercase: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  color: String,
  chassisNumber: String,
  engineNumber: String,
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Diesel' },
  
  // Ownership & Management
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  
  // Operational Status
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance', 'inspection'], 
    default: 'active' 
  },
  currentRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  currentTerminus: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminus' },
  
  // Financial
  dailyTarget: { type: Number, default: 0 },
  monthlyEarnings: { type: Number, default: 0 },
  lastPaymentDate: Date,
  
  // Documents & Compliance
  registrationExpiry: Date,
  insuranceExpiry: Date,
  inspectionExpiry: Date,
  ntsa: String,
  psvBadge: String,
  
  // Tracking
  lastLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  
  // Queue Management
  queuePosition: { type: Number, default: 0 },
  lastDispatchTime: Date,
  totalTripsToday: { type: Number, default: 0 },
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
