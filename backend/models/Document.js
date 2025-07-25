const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      'vehicle_permit',
      'vehicle_insurance',
      'vehicle_inspection',
      'driver_license',
      'driver_medical',
      'driver_clearance',
      'sacco_registration',
      'sacco_permit',
      'route_permit',
      'terminus_permit',
      'other'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: ['vehicle', 'driver', 'sacco', 'route', 'terminus', 'user']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityModel'
  },
  entityModel: {
    type: String,
    required: true,
    enum: ['Vehicle', 'Driver', 'Sacco', 'Route', 'Terminus', 'User']
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending_renewal', 'cancelled'],
    default: 'active'
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  expiryDate: {
    type: Date
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual to determine entity model based on entity type
documentSchema.pre('save', function(next) {
  const entityTypeToModel = {
    vehicle: 'Vehicle',
    driver: 'Driver',
    sacco: 'Sacco',
    route: 'Route',
    terminus: 'Terminus',
    user: 'User'
  };
  
  this.entityModel = entityTypeToModel[this.entityType];
  next();
});

// Index for efficient queries
documentSchema.index({ entityType: 1, entityId: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Document', documentSchema);