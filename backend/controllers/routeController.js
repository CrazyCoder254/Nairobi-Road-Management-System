const Route = require('../models/Route');
const { validationResult } = require('express-validator');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { routeCode: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const routes = await Route.find(query)
      .populate('startTerminus', 'name location')
      .populate('endTerminus', 'name location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Route.countDocuments(query);

    res.json({
      routes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('startTerminus')
      .populate('endTerminus');
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new route
exports.createRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      routeCode,
      startTerminus,
      endTerminus,
      distance,
      estimatedDuration,
      fareAmount,
      intermediateStops,
      operatingHours,
      description
    } = req.body;

    // Check if route code already exists
    const existingRoute = await Route.findOne({ routeCode });
    if (existingRoute) {
      return res.status(400).json({ message: 'Route code already exists' });
    }

    const route = new Route({
      name,
      routeCode,
      startTerminus,
      endTerminus,
      distance,
      estimatedDuration,
      fareAmount,
      intermediateStops,
      operatingHours,
      description
    });

    await route.save();
    await route.populate('startTerminus endTerminus', 'name location');

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('startTerminus endTerminus', 'name location');

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get route statistics
exports.getRouteStats = async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments();
    const activeRoutes = await Route.countDocuments({ status: 'active' });
    const inactiveRoutes = await Route.countDocuments({ status: 'inactive' });

    const avgDistance = await Route.aggregate([
      { $group: { _id: null, avgDistance: { $avg: '$distance' } } }
    ]);

    const avgFare = await Route.aggregate([
      { $group: { _id: null, avgFare: { $avg: '$fareAmount' } } }
    ]);

    res.json({
      totalRoutes,
      activeRoutes,
      inactiveRoutes,
      averageDistance: avgDistance[0]?.avgDistance || 0,
      averageFare: avgFare[0]?.avgFare || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};