const express = require('express');
const { body } = require('express-validator');
const saccoController = require('../controllers/saccoController');
const { auth, authorize } = require('../middleware/auth'); // ✅ Destructure both from the module


const router = express.Router();

// Validation rules
const saccoValidation = [
  body('name').notEmpty().withMessage('Sacco name is required'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('contactPerson.name').notEmpty().withMessage('Chairperson name is required'),
  body('contactPerson.phone').notEmpty().withMessage('Valid phone number is required'),
  body('contactPerson.email').isEmail().withMessage('Valid email is required'),
  body('officeLocation.address').notEmpty().withMessage('Address is required'),
];



// Routes
router.get('/', auth, saccoController.getAllSaccos);
router.get('/:id', auth, saccoController.getSaccoById);
router.get('/:id/vehicles', auth, saccoController.getSaccoVehicles);
router.get('/:id/drivers', auth, saccoController.getSaccoDrivers);
router.post('/', auth, saccoValidation, saccoController.createSacco);
router.put('/:id', auth, authorize(['admin', 'operator']), saccoValidation, saccoController.updateSacco);
router.delete('/:id', auth, saccoController.deleteSacco);

module.exports = router;