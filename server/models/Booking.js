const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true,
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
    },
    adminNote: String,
}, {
    timestamps: true,
});

// Index to prevent overlapping bookings for the same resource
// logic will be handled in controller as well for granular error messages, but this is a safety net if we want strict enforcement
// However, 'cancelled' or 'rejected' bookings should not block, so a partial index is better
// or purely application level logic. Given complexity, application level + compound index on resource/status might be tricky.
// We will stick to application logic for conflict detection, but we can index fields for lookup speed.
bookingSchema.index({ resource: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
