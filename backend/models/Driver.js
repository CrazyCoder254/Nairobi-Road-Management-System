const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  licenseNumber: { type: String, required: true, unique: true },
  licenseClass: { type: String },
  licenseExpiry: { type: Date, required: true },

  dateOfBirth: { type: Date },
  experienceYears: { type: Number, default: 0 },

  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco', required: true },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'on_leave'],
    default: 'active'
  },

  rating: { type: Number, min: 1, max: 5, default: 5 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
