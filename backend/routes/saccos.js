const express = require('express');
const { body } = require('express-validator');
const saccoController = require('../controllers/saccoController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const saccoValidation = [
  body('name').notEmpty().withMessage('SACCO name is required'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('chairman.name').notEmpty().withMessage('Chairman name is required'),
  body('chairman.phone').isMobilePhone().withMessage('Valid chairman phone is required'),
  body('secretary.name').notEmpty().withMessage('Secretary name is required'),
  body('secretary.phone').isMobilePhone().withMessage('Valid secretary phone is required'),
  body('treasurer.name').notEmpty().withMessage('Treasurer name is required'),
  body('treasurer.phone').isMobilePhone().withMessage('Valid treasurer phone is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('totalMembers').isInt({ min: 1 }).withMessage('Valid total members count is required')
];

// Routes
router.get('/', auth, saccoController.getAllSaccos);
router.get('/:id', auth, saccoController.getSaccoById);
router.get('/:id/vehicles', auth, saccoController.getSaccoVehicles);
router.get('/:id/drivers', auth, saccoController.getSaccoDrivers);
router.post('/', auth, authorize(['admin', 'operator']), saccoValidation, saccoController.createSacco);
router.put('/:id', auth, authorize(['admin', 'operator']), saccoValidation, saccoController.updateSacco);
router.delete('/:id', auth, authorize(['admin']), saccoController.deleteSacco);

module.exports = router;