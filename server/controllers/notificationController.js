const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.user.toString() === req.user._id.toString()) {
        notification.read = true;
        await notification.save();
        res.json(notification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// Helper to create notification internally
const createNotification = async (userId, title, message, type = 'info') => {
    try {
        await Notification.create({ user: userId, title, message, type });

        // Send Email
        const User = require('../models/User'); // Lazy load
        const sendEmail = require('../utils/sendEmail');

        const user = await User.findById(userId);
        if (user && user.email) {
            await sendEmail({
                email: user.email,
                subject: `CampusNucleus: ${title}`,
                message: message, // Plain text
                html: `<p>${message}</p>` // Simple HTML
            }).catch(err => console.error('Email send failed:', err.message));
        }

    } catch (error) {
        console.error('Failed to create notification', error);
    }
};

module.exports = { getMyNotifications, markAsRead, createNotification };
