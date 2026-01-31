const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

const checkAvailability = async (resourceId, startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflict = await Booking.findOne({
        resource: resourceId,
        status: { $in: ['pending', 'approved'] }, // Ignore rejected/cancelled
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }, // Overlap condition
        ],
    });

    return !conflict;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { resourceId, eventId, startTime, endTime } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
        res.status(400);
        throw new Error('Start time must be before end time');
    }

    // Check availability and auto-approve config
    const resource = await Resource.findById(resourceId);
    if (!resource) {
        res.status(404);
        throw new Error('Resource not found');
    }

    // Check for conflicts
    const isAvailable = await checkAvailability(resourceId, startTime, endTime);

    if (!isAvailable) {
        res.status(409);
        throw new Error('Resource is already booked for this time slot');
    }

    const booking = new Booking({
        resource: resourceId,
        bookedBy: req.user._id,
        event: eventId,
        startTime: start,
        endTime: end,
        status: resource.autoApprove ? 'approved' : 'pending',
    });

    const createdBooking = await booking.save();

    // Log activity
    const { createActivityLog } = require('./activityLogController');
    await createActivityLog(
        req.user._id,
        'BOOKING_CREATED',
        'Booking',
        createdBooking._id,
        `Created booking for resource ${resourceId} (Status: ${createdBooking.status})`
    );

    // If approved, notify user immediately
    if (createdBooking.status === 'approved') {
        const { createNotification } = require('./notificationController');
        await createNotification(
            req.user._id,
            'Booking Approved',
            `Your booking for ${resource.name} has been auto-approved.`,
            'success'
        );
    }

    res.status(201).json(createdBooking);
});

// @desc    Get bookings for a specific resource
// @route   GET /api/bookings/resource/:id
// @access  Public (or Private)
const getBookingsByResource = asyncHandler(async (req, res) => {
    const resourceId = req.params.id;
    const { date } = req.query;

    let query = { resource: resourceId, status: { $in: ['pending', 'approved'] } };

    // If date is provided, filter by that day
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = {
            ...query,
            $or: [
                { startTime: { $gte: startOfDay, $lte: endOfDay } },
                { endTime: { $gte: startOfDay, $lte: endOfDay } },
                { startTime: { $lt: startOfDay }, endTime: { $gt: endOfDay } } // spans entire day
            ]
        };
    }

    const bookings = await Booking.find(query).select('startTime endTime status');
    res.json(bookings);
});

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ bookedBy: req.user._id }).populate('resource');
    res.json(bookings);
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
        .populate('resource')
        .populate('bookedBy', 'name')
        .sort({ startTime: -1 });
    res.json(bookings);
});

// @desc    Update booking status (Admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('resource');

    if (booking) {
        booking.status = status;
        const updatedBooking = await booking.save();

        // Notify user
        // We need to require it inside to avoid circular dependency if notificationController imports models which import something else, 
        // essentially lazy loading or just structure appropriately.
        const { createNotification } = require('./notificationController');
        await createNotification(
            booking.bookedBy,
            `Booking ${status}`,
            `Your booking for ${booking.resource.name} has been ${status}.`,
            status === 'approved' ? 'success' : 'error'
        );

        // Log activity
        const { createActivityLog } = require('./activityLogController');
        await createActivityLog(req.user._id, `BOOKING_${status.toUpperCase()}`, 'Booking', booking._id, `Booking for ${booking.resource.name} ${status}`);

        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getBookingsByResource, checkAvailability };
