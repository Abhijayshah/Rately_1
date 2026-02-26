const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

router.post('/message', authenticateToken, sendMessage);
router.post('/message/public', sendMessage);

module.exports = router;
