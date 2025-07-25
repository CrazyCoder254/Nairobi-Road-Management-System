const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const paymentValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('paymentType').isIn([
    'permit_fee',
    'registration_fee',
    'insurance_premium',
    'license_renewal',
    'inspection_fee',
    'route_fee',
    'terminus_fee',
    'fine',
    'other'
  ]).withMessage('Valid payment type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
];

// Routes
router.get('/', auth, paymentController.getAllPayments);
router.get('/stats', auth, paymentController.getPaymentStats);
router.get('/overdue', auth, paymentController.getOverduePayments);
router.get('/:id', auth, paymentController.getPaymentById);
router.post('/', auth, authorize(['admin', 'operator']), paymentValidation, paymentController.createPayment);
router.put('/:id', auth, authorize(['admin', 'operator']), paymentController.updatePayment);
router.post('/:id/process', auth, authorize(['admin', 'operator']), paymentController.processPayment);

module.exports = router;