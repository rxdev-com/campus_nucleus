const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getBookingsByResource } = require('../controllers/bookingController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllBookings)
    .post(protect, organizer, createBooking);

router.route('/my')
    .get(protect, getMyBookings);

router.route('/:id/status')
    .patch(protect, admin, updateBookingStatus);

router.route('/resource/:id')
    .get(getBookingsByResource); // Public or Protected? Let's make it public for simplicity or protect if needed. Currently no middleware here.

module.exports = router;
