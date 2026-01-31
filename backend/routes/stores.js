const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, requireNormalUser, requireStoreOwner } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Routes for normal users
router.get('/', requireNormalUser, storeController.getStores);
router.get('/:id', requireNormalUser, storeController.getStoreById);
router.post('/ratings', requireNormalUser, validateRating, storeController.submitRating);
router.get('/user/ratings', requireNormalUser, storeController.getUserRatings);

// Routes for store owners
router.get('/owner/dashboard', requireStoreOwner, storeController.getStoreRatings);

module.exports = router;