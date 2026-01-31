const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordUpdate 
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateUserLogin, authController.login);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/password', validatePasswordUpdate, authController.updatePassword);
router.post('/logout', authController.logout);

module.exports = router;