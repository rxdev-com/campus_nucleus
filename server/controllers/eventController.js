const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a new event (Draft)
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = asyncHandler(async (req, res) => {
    const {
        title, description, timeStart, timeEnd, venue, budget,
        organizerClub, coOrganizerClubs, isFest, festName, bannerImage, galleryImages
    } = req.body;

    const event = new Event({
        title,
        description,
        timeStart,
        timeEnd,
        venue,
        budget,
        organizerClub,
        coOrganizerClubs,
        isFest,
        festName,
        bannerImage,
        galleryImages,
        createdBy: req.user._id,
        status: 'draft',
        eventLifecycle: [{
            status: 'draft',
            changedAt: Date.now(),
            comment: 'Event created as draft'
        }]
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});

// @desc    Get all published events (Public)
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Event.countDocuments({ ...keyword, status: 'published' });
    const events = await Event.find({ ...keyword, status: 'published' })
        .populate('organizerClub', 'name logoUrl')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ events, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get logged in user's events (Organizer)
// @route   GET /api/events/my
// @access  Private
const getMyEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ createdBy: req.user._id })
        .populate('organizerClub', 'name')
        .sort({ createdAt: -1 });
    res.json(events);
});

// @desc    Get pending events (Admin)
// @route   GET /api/events/pending
// @access  Private (Admin)
const getPendingEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ status: 'submitted' })
        .populate('organizerClub', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: 1 });
    res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    let query = Event.findById(req.params.id)
        .populate('organizerClub', 'name')
        .populate('coOrganizerClubs', 'name')
        .populate('createdBy', 'name email');

    const event = await query;

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // If requester is owner or admin, populate participant details
    // We need 'protect' middleware to have req.user, but this route is public.
    // We'll check if a token is present or if we should just make this partially protected.
    // For now, let's assume we want to show it only if they are logged in and authorized.

    res.json(event);
});

// @desc    Get event participants
// @route   GET /api/events/:id/participants
// @access  Private (Admin/Organizer)
const getEventParticipants = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('participants', 'name email department year');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view participants');
    }

    res.json(event.participants);
});

// @desc    Update event status (Admin approval)
// @route   PATCH /api/events/:id/status
// @access  Private (Admin)
const updateEventStatus = asyncHandler(async (req, res) => {
    const { status, rejectionReason } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
        event.status = status;
        if (status === 'rejected' || status === 'returned') {
            event.rejectionReason = rejectionReason;
        }

        // Add to lifecycle
        event.eventLifecycle.push({
            status,
            changedAt: Date.now(),
            comment: rejectionReason || `Status updated to ${status}`
        });

        const updatedEvent = await event.save();

        // Notify user
        const { createNotification } = require('./notificationController');
        let title = `Event ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        let message = `Your event "${event.title}" has been ${status}.`;
        let type = 'info';

        if (status === 'published' || status === 'approved') type = 'success';
        if (status === 'rejected' || status === 'returned') type = 'error';

        await createNotification(
            event.createdBy,
            title,
            message,
            type
        );

        // Log activity
        const { createActivityLog } = require('./activityLogController');
        await createActivityLog(req.user._id, `EVENT_${status.toUpperCase()}`, 'Event', event._id, `Event "${event.title}" ${status}`);

        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Submit event for approval
// @route   PATCH /api/events/:id/submit
// @access  Private (Organizer)
const submitEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to submit this event');
    }

    if (event.status !== 'draft') {
        res.status(400);
        throw new Error('Only draft events can be submitted');
    }

    event.status = 'submitted';
    const updatedEvent = await event.save();

    // Log activity
    const { createActivityLog } = require('./activityLogController');
    await createActivityLog(req.user._id, 'EVENT_SUBMITTED', 'Event', event._id, `Submitted event "${event.title}" for approval`);

    res.json(updatedEvent);
});

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private (Participant)
const joinEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.status !== 'published') {
        res.status(400);
        throw new Error('Cannot join unpublished event');
    }

    // Check if already joined
    if (event.participants.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    event.participants.push(req.user._id);
    await event.save();

    res.json({ message: 'Registration successful' });
});

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private (Organizer)
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this event');
    }

    const {
        title, description, timeStart, timeEnd, venue, budget,
        organizerClub, coOrganizerClubs, isFest, festName, bannerImage, galleryImages
    } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.timeStart = timeStart || event.timeStart;
    event.timeEnd = timeEnd || event.timeEnd;
    event.venue = venue || event.venue;
    event.budget = budget || event.budget;
    event.organizerClub = organizerClub || event.organizerClub;
    event.coOrganizerClubs = coOrganizerClubs || event.coOrganizerClubs;
    event.isFest = isFest !== undefined ? isFest : event.isFest;
    event.festName = festName || event.festName;
    event.bannerImage = bannerImage || event.bannerImage;
    event.galleryImages = galleryImages || event.galleryImages;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
});

// @desc    Get all events (Admin)
// @route   GET /api/events/all
// @access  Private (Admin)
const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({})
        .populate('organizerClub', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
    res.json(events);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Organizer)
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Only creator or admin can delete
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this event');
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
});

// @desc    Get events joined by current user
// @route   GET /api/events/joined
// @access  Private
const getJoinedEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ participants: req.user._id })
        .populate('organizerClub', 'name logoUrl')
        .sort({ timeStart: 1 });
    res.json(events);
});

module.exports = { createEvent, getEvents, getMyEvents, getPendingEvents, getEventById, updateEventStatus, submitEvent, joinEvent, updateEvent, getAllEvents, deleteEvent, getEventParticipants, getJoinedEvents };
