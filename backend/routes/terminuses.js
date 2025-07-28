const express = require('express');
const { body } = require('express-validator');
const terminusController = require('../controllers/terminusController');
const { auth, authorize } = require('../middleware/auth'); // ✅ Destructure both from the module


const router = express.Router();

// Validation rules
const terminusValidation = [
  body('name').notEmpty().withMessage('Terminus name is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('totalCapacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('contactPerson.name').notEmpty().withMessage('Contact person name is required'),
  body('contactPerson.phone').isMobilePhone().withMessage('Valid contact phone is required')
];

// Routes
router.get('/', auth, terminusController.getAllTerminuses);
router.get('/:id', auth, terminusController.getTerminusById);
router.get('/:id/capacity', auth, terminusController.getTerminusCapacity);
router.post('/', auth, terminusValidation, terminusController.createTerminus);
router.put('/:id', auth, terminusValidation, terminusController.updateTerminus);
router.delete('/:id', auth, terminusController.deleteTerminus);

module.exports = router;