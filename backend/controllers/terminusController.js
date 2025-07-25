const Terminus = require('../models/Terminus');
const { validationResult } = require('express-validator');

// Get all terminuses
exports.getAllTerminuses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.region': { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const terminuses = await Terminus.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Terminus.countDocuments(query);

    res.json({
      terminuses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get terminus by ID
exports.getTerminusById = async (req, res) => {
  try {
    const terminus = await Terminus.findById(req.params.id);
    
    if (!terminus) {
      return res.status(404).json({ message: 'Terminus not found' });
    }
    
    res.json(terminus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new terminus
exports.createTerminus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      location,
      capacity,
      facilities,
      operatingHours,
      contactPerson,
      description
    } = req.body;

    const terminus = new Terminus({
      name,
      location,
      capacity,
      facilities,
      operatingHours,
      contactPerson,
      description
    });

    await terminus.save();
    res.status(201).json(terminus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update terminus
exports.updateTerminus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const terminus = await Terminus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!terminus) {
      return res.status(404).json({ message: 'Terminus not found' });
    }

    res.json(terminus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete terminus
exports.deleteTerminus = async (req, res) => {
  try {
    const terminus = await Terminus.findByIdAndDelete(req.params.id);
    
    if (!terminus) {
      return res.status(404).json({ message: 'Terminus not found' });
    }

    res.json({ message: 'Terminus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get terminus capacity info
exports.getTerminusCapacity = async (req, res) => {
  try {
    const terminus = await Terminus.findById(req.params.id);
    
    if (!terminus) {
      return res.status(404).json({ message: 'Terminus not found' });
    }

    // In a real implementation, you would track current occupancy
    // For now, we'll return capacity info with mock current occupancy
    const currentOccupancy = Math.floor(Math.random() * terminus.capacity);
    
    res.json({
      totalCapacity: terminus.capacity,
      currentOccupancy,
      availableSpaces: terminus.capacity - currentOccupancy,
      occupancyPercentage: (currentOccupancy / terminus.capacity) * 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};