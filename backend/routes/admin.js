const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  validateAdminUserCreation, 
  validateStore 
} = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management
router.post('/users', validateAdminUserCreation, adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Store management
router.post('/stores', validateStore, adminController.createStore);
router.get('/stores', adminController.getStores);

module.exports = router;