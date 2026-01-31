const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, sendMessage);

router.route('/:contextId')
    .get(protect, getMessages);

module.exports = router;
