const mongoose = require('mongoose');

const terminusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  
  // Location
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String,
    ward: String,
    constituency: String
  },
  
  // Capacity & Infrastructure
  totalCapacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  parkingBays: { type: Number, required: true },
  
  // Facilities
  facilities: [{
    type: String,
    enum: ['restrooms', 'waiting_area', 'food_court', 'atm', 'security', 'cctv', 'wifi']
  }],
  
  // Operational
  operatingHours: {
    start: String,
    end: String
  },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Routes & Vehicles
  routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  currentVehicles: [{ 
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    arrivalTime: Date,
    queuePosition: Number
  }],
  
  // Financial
  dailyRevenue: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  parkingFee: { type: Number, default: 0 },
  
  // Performance Metrics
  averageWaitTime: { type: Number, default: 0 },
  dailyThroughput: { type: Number, default: 0 },
  peakHours: [{
    start: String,
    end: String,
    vehicleCount: Number
  }],
  
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    default: 'active' 
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Terminus', terminusSchema);
