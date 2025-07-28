const Sacco = require('../models/Sacco');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { validationResult } = require('express-validator');

// Get all saccos
exports.getAllSaccos = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const saccos = await Sacco.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Sacco.countDocuments(query);

    res.json({
      saccos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sacco by ID
exports.getSaccoById = async (req, res) => {
  try {
    const sacco = await Sacco.findById(req.params.id);
    
    if (!sacco) {
      return res.status(404).json({ message: 'SACCO not found' });
    }

    // Get vehicles and drivers count
    const vehiclesCount = await Vehicle.countDocuments({ sacco: req.params.id });
    const driversCount = await Driver.countDocuments({ sacco: req.params.id });

    res.json({
      ...sacco.toObject(),
      vehiclesCount,
      driversCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new sacco
exports.createSacco = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

        const {
      name,
      registrationNumber,
      contactPerson,
      officeLocation
    } = req.body;
    
    console.log("Received data:", req.body);


    // Check for duplicate registration number
    const existing = await Sacco.findOne({ registrationNumber });
    if (existing) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }

      const sacco = new Sacco({
      name,
      registrationNumber,
      contactPerson,
      officeLocation
    });

    await sacco.save();
    res.status(201).json(sacco);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update sacco
exports.updateSacco = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sacco = await Sacco.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sacco) {
      return res.status(404).json({ message: 'SACCO not found' });
    }

    res.json(sacco);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete sacco
exports.deleteSacco = async (req, res) => {
  try {
    const sacco = await Sacco.findById(req.params.id);
    
    if (!sacco) {
      return res.status(404).json({ message: 'SACCO not found' });
    }

    // Check if sacco has vehicles or drivers
    const vehiclesCount = await Vehicle.countDocuments({ sacco: req.params.id });
    const driversCount = await Driver.countDocuments({ sacco: req.params.id });

    if (vehiclesCount > 0 || driversCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete SACCO with associated vehicles or drivers' 
      });
    }

    await Sacco.findByIdAndDelete(req.params.id);
    res.json({ message: 'SACCO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sacco vehicles
exports.getSaccoVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ sacco: req.params.id })
      .populate('assignedDriver', 'firstName lastName licenseNumber');
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sacco drivers
exports.getSaccoDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ sacco: req.params.id })
      .populate('assignedVehicle', 'registrationNumber make model');
    
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};