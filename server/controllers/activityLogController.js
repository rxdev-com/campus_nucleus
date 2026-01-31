const asyncHandler = require('express-async-handler');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create activity log entry
// @route   POST /api/activity-logs
// @access  Private (typically called internally)
const createActivityLog = async (userId, action, targetType, targetId, details = '') => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            targetType,
            targetId,
            details
        });
    } catch (error) {
        console.error('Failed to create activity log:', error);
    }
};

// @desc    Get all activity logs (Admin)
// @route   GET /api/activity-logs
// @access  Private (Admin)
const getActivityLogs = asyncHandler(async (req, res) => {
    const logs = await ActivityLog.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(100);
    res.json(logs);
});

// @desc    Get activity logs for a specific target
// @route   GET /api/activity-logs/:targetType/:targetId
// @access  Private
const getActivityLogsByTarget = asyncHandler(async (req, res) => {
    const { targetType, targetId } = req.params;
    const logs = await ActivityLog.find({ targetType, targetId })
        .populate('user', 'name email role')
        .sort({ createdAt: -1 });
    res.json(logs);
});

module.exports = { createActivityLog, getActivityLogs, getActivityLogsByTarget };
