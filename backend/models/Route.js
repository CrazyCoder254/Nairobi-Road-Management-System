const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  
  // Route Details
  startTerminus: { type: String, required: true },
  endTerminus: { type: String, required: true },
  distance: { type: Number, required: true }, // in kilometers
  estimatedDuration: { type: Number, required: true }, // in minutes
  
  // Stops
  stops: [{
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    order: Number
  }],
  
  // Operational Details
  operatingHours: {
    start: String, // "06:00"
    end: String    // "22:00"
  },
  frequency: { type: Number, default: 15 }, // minutes between vehicles
  
  // Financial
  fareAmount: { type: Number, required: true },
  distanceFare: Number, // fare per km
  
  // Assignment
  assignedSaccos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' }],
  assignedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  primaryTerminus: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminus' },
  secondaryTerminus: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminus' },
  
  // Performance
  dailyRiders: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  averageWaitTime: { type: Number, default: 0 },
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    default: 'active' 
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
