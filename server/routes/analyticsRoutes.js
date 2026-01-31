const express = require('express');
const router = express.Router();
const { getAnalytics, exportAnalytics } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAnalytics);

router.route('/export')
    .get(protect, admin, exportAnalytics);

module.exports = router;
