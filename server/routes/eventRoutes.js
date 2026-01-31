const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getMyEvents,
    getPendingEvents,
    getEventById,
    updateEventStatus,
    submitEvent,
    updateEvent,
    joinEvent,
    getAllEvents,
    deleteEvent,
    getEventParticipants,
    getJoinedEvents
} = require('../controllers/eventController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, organizer, createEvent);

router.route('/my')
    .get(protect, getMyEvents);

router.route('/pending')
    .get(protect, admin, getPendingEvents);

router.route('/all')
    .get(protect, admin, getAllEvents);

router.route('/joined')
    .get(protect, getJoinedEvents);

router.route('/:id')
    .get(getEventById)
    .put(protect, organizer, updateEvent)
    .delete(protect, deleteEvent);

router.route('/:id/status')
    .patch(protect, admin, updateEventStatus);

router.route('/:id/submit')
    .patch(protect, organizer, submitEvent);

router.route('/:id/join')
    .post(protect, joinEvent);

router.route('/:id/participants')
    .get(protect, getEventParticipants);

module.exports = router;
