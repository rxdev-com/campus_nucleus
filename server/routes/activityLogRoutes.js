const express = require('express');
const router = express.Router();
const { getActivityLogs, getActivityLogsByTarget } = require('../controllers/activityLogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getActivityLogs);

router.route('/:targetType/:targetId')
    .get(protect, getActivityLogsByTarget);

module.exports = router;
