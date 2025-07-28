const express = require('express');
const { body } = require('express-validator');
const driverController = require('../controllers/driverController');
const { auth, authorize } = require('../middleware/auth'); // ✅ Destructure both from the module


const router = express.Router();

// Validation rules
const driverValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('licenseExpiryDate').isISO8601().withMessage('Valid license expiry date is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('sacco').isMongoId().withMessage('Valid SACCO ID is required')
];



// Routes
router.get('/', auth, driverController.getAllDrivers);
router.get('/:id', auth, driverController.getDriverById);
router.post('/', auth, driverValidation, driverController.createDriver);
router.put('/:id', auth, driverValidation, driverController.updateDriver);
router.delete('/:id', auth, driverController.deleteDriver);
router.post('/:id/assign-vehicle', auth, driverController.assignVehicle);

module.exports = router;