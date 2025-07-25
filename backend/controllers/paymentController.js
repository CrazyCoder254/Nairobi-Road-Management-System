const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { validationResult } = require('express-validator');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      paymentType, 
      startDate, 
      endDate 
    } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (paymentType) query.paymentType = paymentType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('vehicle', 'registrationNumber make model')
      .populate('driver', 'firstName lastName licenseNumber')
      .populate('paidBy', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('vehicle')
      .populate('driver')
      .populate('paidBy', 'firstName lastName email');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      amount,
      paymentType,
      description,
      vehicle,
      driver,
      dueDate,
      paymentMethod
    } = req.body;

    // Generate reference number
    const referenceNumber = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const payment = new Payment({
      amount,
      paymentType,
      description,
      vehicle,
      driver,
      dueDate,
      paymentMethod,
      referenceNumber,
      paidBy: req.user.id
    });

    await payment.save();
    await payment.populate('vehicle driver paidBy', 'registrationNumber make model firstName lastName email');

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicle driver paidBy', 'registrationNumber make model firstName lastName email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Process payment (mark as paid)
exports.processPayment = async (req, res) => {
  try {
    const { transactionId, paymentMethod } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'paid') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.transactionId = transactionId;
    payment.paymentMethod = paymentMethod || payment.paymentMethod;

    await payment.save();
    await payment.populate('vehicle driver paidBy', 'registrationNumber make model firstName lastName email');

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const totalPayments = await Payment.countDocuments(dateFilter);
    const paidPayments = await Payment.countDocuments({ ...dateFilter, status: 'paid' });
    const pendingPayments = await Payment.countDocuments({ ...dateFilter, status: 'pending' });
    const overduePayments = await Payment.countDocuments({ 
      ...dateFilter, 
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    const totalRevenue = await Payment.aggregate([
      { $match: { ...dateFilter, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await Payment.aggregate([
      { $match: { ...dateFilter, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paymentsByType = await Payment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$paymentType', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalPayments,
      paidPayments,
      pendingPayments,
      overduePayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0,
      paymentsByType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get overdue payments
exports.getOverduePayments = async (req, res) => {
  try {
    const overduePayments = await Payment.find({
      status: 'pending',
      dueDate: { $lt: new Date() }
    })
    .populate('vehicle', 'registrationNumber make model')
    .populate('driver', 'firstName lastName licenseNumber')
    .sort({ dueDate: 1 });

    res.json(overduePayments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};