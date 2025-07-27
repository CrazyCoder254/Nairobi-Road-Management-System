const Vehicle = require('../models/Vehicle');
const Sacco = require('../models/Sacco');
const { validationResult } = require('express-validator');

const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, saccoId } = req.query;
    
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (saccoId) filter.saccoId = saccoId;
    
    const vehicles = await Vehicle.find(filter)
      .populate('saccoId', 'name')
      .populate('currentDriver', 'firstName lastName')
      .populate('currentRoute', 'routeNumber name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Vehicle.countDocuments(filter);

    res.json({
      vehicles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVehicleStats = async (req, res) => {
  try {
    const total = await Vehicle.countDocuments();
    const active = await Vehicle.countDocuments({ isActive: true });
    const inactive = total - active;

    res.json({ total, active, inactive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id)
      .populate('saccoId', 'name')
      .populate('currentDriver', 'firstName lastName')
      .populate('currentRoute', 'routeNumber name');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicleData = req.body;
    
    // Check if plate number exists
    const existingVehicle = await Vehicle.findOne({ 
      plateNumber: vehicleData.plateNumber.toUpperCase() 
    });
    
    if (existingVehicle) {
      return res.status(400).json({ 
        message: 'Vehicle with this plate number already exists' 
      });
    }

    // Verify SACCO exists
    const sacco = await Sacco.findById(vehicleData.saccoId);
    if (!sacco) {
      return res.status(400).json({ message: 'Invalid SACCO ID' });
    }

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // Update SACCO vehicle count
    await Sacco.findByIdAndUpdate(vehicleData.saccoId, {
      $inc: { totalVehicles: 1, activeVehicles: 1 },
      $push: { vehicles: vehicle._id }
    });

    await vehicle.populate('saccoId', 'name');

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).populate('saccoId', 'name');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update SACCO vehicle count
    await Sacco.findByIdAndUpdate(vehicle.saccoId, {
      $inc: { activeVehicles: -1 },
      $pull: { vehicles: vehicle._id }
    });

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
    getAllVehicles,
  getVehicleStats,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
