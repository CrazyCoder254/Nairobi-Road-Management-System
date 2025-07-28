const mongoose = require('mongoose');

const saccoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sacco name is required']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required']
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required']
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required']
    }
  },
  officeLocation: {
    address: {
      type: String,
      required: [true, 'Office address is required']
    },
    city: String,
    region: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sacco', saccoSchema);
