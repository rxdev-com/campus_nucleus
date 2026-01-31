const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Club = require('../models/Club');

// @desc    Get system analytics (Admin)
// @route   GET /api/analytics
// @access  Private (Admin)
const getAnalytics = asyncHandler(async (req, res) => {
    // 1. Basic Counts
    const userCount = await User.countDocuments({});
    const eventCount = await Event.countDocuments({});
    const bookingCount = await Booking.countDocuments({});
    const clubCount = await Club.countDocuments({});

    // 2. Event Status Distribution
    const eventsByStatus = await Event.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 3. Bookings by Resource
    const bookingsByResource = await Booking.aggregate([
        { $group: { _id: "$resource", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'resources', localField: '_id', foreignField: '_id', as: 'resourceDetails' } },
        { $unwind: '$resourceDetails' },
        { $project: { name: '$resourceDetails.name', count: 1 } }
    ]);

    // 4. Registration Trends (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const registrationTrends = await User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    // 5. High Engagement Events (Corrected using Aggregation)
    const topEvents = await Event.aggregate([
        { $match: { status: 'published' } },
        { $addFields: { participantCount: { $size: { $ifNull: ["$participants", []] } } } },
        { $sort: { participantCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'clubs', localField: 'organizerClub', foreignField: '_id', as: 'clubDetails' } },
        { $unwind: { path: '$clubDetails', preserveNullAndEmptyArrays: true } },
        { $project: { title: 1, participantCount: 1, club: '$clubDetails.name' } }
    ]);

    res.json({
        counts: { users: userCount, events: eventCount, bookings: bookingCount, clubs: clubCount },
        eventsByStatus,
        bookingsByResource,
        registrationTrends,
        topEvents
    });
});

// @desc    Export analytics as CSV
// @route   GET /api/analytics/export
// @access  Private (Admin)
const exportAnalytics = asyncHandler(async (req, res) => {
    // 1. Basic Counts
    const userCount = await User.countDocuments({});
    const eventCount = await Event.countDocuments({});
    const bookingCount = await Booking.countDocuments({});
    const clubCount = await Club.countDocuments({});

    let csvContent = "Metric,Value\n";
    csvContent += `Total Users,${userCount}\n`;
    csvContent += `Total Events,${eventCount}\n`;
    csvContent += `Total Bookings,${bookingCount}\n`;
    csvContent += `Total Clubs,${clubCount}\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=campus_analytics.csv');
    res.status(200).send(csvContent);
});

module.exports = { getAnalytics, exportAnalytics };
