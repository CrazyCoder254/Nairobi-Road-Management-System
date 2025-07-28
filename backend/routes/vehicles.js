const express = require('express');
const { body } = require('express-validator');
const vehicleController = require('../controllers/vehicleController');
const { auth, authorize } = require('../middleware/auth'); // ✅ Destructure both from the module



const router = express.Router();


// Validation rules
const vehicleValidation = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() }).withMessage('Valid year is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
];

// Routes
router.get('/', auth, vehicleController.getAllVehicles);
router.post('/', auth, vehicleValidation, vehicleController.createVehicle);
router.put('/:id', auth, authorize(['admin', 'operator']), vehicleValidation, vehicleController.updateVehicle);
router.delete('/:id', auth, authorize(['admin']), vehicleController.deleteVehicle);

module.exports = router;