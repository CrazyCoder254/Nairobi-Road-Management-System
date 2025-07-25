const express = require('express');
const { body } = require('express-validator');
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const documentValidation = [
  body('title').notEmpty().withMessage('Document title is required'),
  body('documentType').isIn([
    'vehicle_permit',
    'vehicle_insurance',
    'vehicle_inspection',
    'driver_license',
    'driver_medical',
    'driver_clearance',
    'sacco_registration',
    'sacco_permit',
    'route_permit',
    'terminus_permit',
    'other'
  ]).withMessage('Valid document type is required'),
  body('entityType').isIn(['vehicle', 'driver', 'sacco', 'route', 'terminus', 'user']).withMessage('Valid entity type is required'),
  body('entityId').isMongoId().withMessage('Valid entity ID is required')
];

// Routes
router.get('/', auth, documentController.getAllDocuments);
router.get('/expiring', auth, documentController.getExpiringDocuments);
router.get('/expired', auth, documentController.getExpiredDocuments);
router.get('/:id', auth, documentController.getDocumentById);
router.get('/:id/download', auth, documentController.downloadDocument);

router.post('/', 
  auth, 
  authorize(['admin', 'operator']), 
  documentController.uploadMiddleware,
  documentValidation, 
  documentController.uploadDocument
);

router.put('/:id', auth, authorize(['admin', 'operator']), documentController.updateDocument);
router.delete('/:id', auth, authorize(['admin']), documentController.deleteDocument);

module.exports = router;