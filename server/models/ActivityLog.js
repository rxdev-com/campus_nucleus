const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String, // e.g., 'EVENT_APPROVED', 'BOOKING_CREATED', 'MEMBER_ADDED'
        required: true,
    },
    targetType: {
        type: String, // e.g., 'Event', 'Booking', 'Club'
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    details: {
        type: String,
    },
}, {
    timestamps: true,
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
