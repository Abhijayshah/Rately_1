const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// All chat routes require authentication
router.post('/message', authenticateToken, sendMessage);

module.exports = router;
