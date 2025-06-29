const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Send message to AI cooking assistant
router.post('/', chatController.chat);

module.exports = router; 