const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const drivers = await Driver.find(query)
      .populate('assignedVehicle', 'registrationNumber make model')
      .populate('sacco', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Driver.countDocuments(query);

    res.json({
      drivers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('assignedVehicle')
      .populate('sacco');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new driver
exports.createDriver = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseExpiryDate,
      dateOfBirth,
      address,
      sacco,
      emergencyContact
    } = req.body;

    // Check if license number already exists
    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const driver = new Driver({
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseExpiryDate,
      dateOfBirth,
      address,
      sacco,
      emergencyContact
    });

    await driver.save();
    await driver.populate('sacco', 'name');

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update driver
exports.updateDriver = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedVehicle').populate('sacco');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete driver
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Remove driver from assigned vehicle
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(
        driver.assignedVehicle,
        { $unset: { assignedDriver: 1 } }
      );
    }

    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign vehicle to driver
exports.assignVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const driverId = req.params.id;

    const driver = await Driver.findById(driverId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!driver || !vehicle) {
      return res.status(404).json({ message: 'Driver or vehicle not found' });
    }

    // Check if vehicle is already assigned
    if (vehicle.assignedDriver) {
      return res.status(400).json({ message: 'Vehicle already assigned to another driver' });
    }

    // Update both driver and vehicle
    driver.assignedVehicle = vehicleId;
    vehicle.assignedDriver = driverId;

    await driver.save();
    await vehicle.save();

    res.json({ message: 'Vehicle assigned successfully', driver, vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};