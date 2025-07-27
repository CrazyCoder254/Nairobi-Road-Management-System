const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: false },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['admin', 'sacco_manager', 'driver', 'terminus_manager'], 
    default: 'driver' 
  },
  isActive: { type: Boolean, default: true },
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  terminusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminus' },
  avatar: String,
  lastLogin: Date,
  emailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
