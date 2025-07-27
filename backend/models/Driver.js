const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseClass: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  
  // Personal Information
  nationalId: { type: String, required: true, unique: true },
  dateOfBirth: Date,
  address: String,
  nextOfKin: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Professional Details
  experienceYears: Number,
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  
  // Status & Performance
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended', 'on_leave'], 
    default: 'active' 
  },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  totalTrips: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  
  // Compliance
  psvBadge: String,
  psvBadgeExpiry: Date,
  medicalCertificate: String,
  medicalCertExpiry: Date,
  
  // Violations & Penalties
  violations: [{
    type: String,
    date: Date,
    fine: Number,
    status: { type: String, enum: ['pending', 'paid', 'waived'], default: 'pending' }
  }],
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
