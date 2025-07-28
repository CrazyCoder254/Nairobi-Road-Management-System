const express = require('express');
const { body } = require('express-validator');
const routeController = require('../controllers/routeController');
const { auth, authorize } = require('../middleware/auth'); // ✅ Destructure both from the module


const router = express.Router();

// Validation rules
const routeValidation = [
  body('name').notEmpty().withMessage('Route name is required'),
  body('routeCode').notEmpty().withMessage('Route code is required'),
  body('startTerminus').isMongoId().withMessage('Valid start terminus ID is required'),
  body('endTerminus').isMongoId().withMessage('Valid end terminus ID is required'),
  body('distance').isFloat({ min: 0 }).withMessage('Valid distance is required'),
  body('estimatedDuration').isInt({ min: 1 }).withMessage('Valid estimated duration is required'),
  body('fareAmount').isFloat({ min: 0 }).withMessage('Valid fare amount is required')
];

// Routes
router.get('/', auth, routeController.getAllRoutes);
router.get('/stats', auth, routeController.getRouteStats);
router.get('/:id', auth, routeController.getRouteById);
router.post('/', auth, routeValidation, routeController.createRoute);
router.put('/:id', auth, routeValidation, routeController.updateRoute);
router.delete('/:id', auth, routeController.deleteRoute);

module.exports = router;