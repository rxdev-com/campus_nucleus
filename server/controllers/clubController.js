const asyncHandler = require('express-async-handler');
const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = asyncHandler(async (req, res) => {
    const clubs = await Club.find({}).populate('leadOrganizer', 'name');
    res.json(clubs);
});

// @desc    Get clubs managed by logged in user
// @route   GET /api/clubs/my-managed
// @access  Private (Organizer)
const getMyManagedClubs = asyncHandler(async (req, res) => {
    // efficient query: find clubs where leadOrganizer is the user
    const clubs = await Club.find({ leadOrganizer: req.user._id });
    res.json(clubs);
});

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id)
        .populate('leadOrganizer', 'name email')
        .populate('events'); // Assuming we want to show events

    if (club) {
        res.json(club);
    } else {
        res.status(404);
        throw new Error('Club not found');
    }
});

// @desc    Create a new club (Admin only for now, or Organizer request)
// @route   POST /api/clubs
// @access  Private (Admin)
const createClub = asyncHandler(async (req, res) => {
    const { name, description, leadOrganizerId } = req.body;

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
        res.status(400);
        throw new Error('Club already exists');
    }

    // Verify lead organizer exists
    if (!leadOrganizerId) {
        res.status(400);
        throw new Error('Lead organizer is required');
    }

    const organizerUser = await User.findById(leadOrganizerId);
    if (!organizerUser) {
        res.status(404);
        throw new Error('Lead organizer user not found');
    }

    const club = await Club.create({
        name,
        description,
        leadOrganizer: leadOrganizerId
    });

    if (club) {
        // Add club to user's managedClubs
        organizerUser.managedClubs.push(club._id);
        // Ensure user role is organizer
        if (organizerUser.role === 'participant') {
            organizerUser.role = 'organizer';
        }
        await organizerUser.save();

        res.status(201).json(club);
    } else {
        res.status(400);
        throw new Error('Invalid club data');
    }
});

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private (Admin)
const updateClub = asyncHandler(async (req, res) => {
    const { name, description, leadOrganizerId } = req.body;
    const club = await Club.findById(req.params.id);

    if (club) {
        club.name = name || club.name;
        club.description = description || club.description;

        if (leadOrganizerId && leadOrganizerId !== club.leadOrganizer.toString()) {
            const organizerUser = await User.findById(leadOrganizerId);
            if (!organizerUser) {
                res.status(404);
                throw new Error('New lead organizer user not found');
            }
            club.leadOrganizer = leadOrganizerId;
            // Update user role if needed
            if (organizerUser.role === 'participant') {
                organizerUser.role = 'organizer';
                await organizerUser.save();
            }
        }

        const updatedClub = await club.save();
        res.json(updatedClub);
    } else {
        res.status(404);
        throw new Error('Club not found');
    }
});

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
const deleteClub = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (club) {
        await club.deleteOne();
        res.json({ message: 'Club removed' });
    } else {
        res.status(404);
        throw new Error('Club not found');
    }
});

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
const joinClub = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }
    if (club.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already a member of this club');
    }
    club.members.push(req.user._id);
    await club.save();
    res.json({ message: 'Successfully joined the club' });
});

// @desc    Leave a club
// @route   DELETE /api/clubs/:id/leave
// @access  Private
const leaveClub = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }
    club.members = club.members.filter(m => m.toString() !== req.user._id.toString());
    await club.save();
    res.json({ message: 'Left the club' });
});

// @desc    Add member to club (Organizer)
// @route   POST /api/clubs/:id/members
// @access  Private (Organizer of that club)
const addMember = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }

    // Check if requester is the lead organizer
    if (club.leadOrganizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to manage members');
    }

    if (club.members.includes(userId)) {
        res.status(400);
        throw new Error('User is already a member');
    }

    club.members.push(userId);
    await club.save();

    // Log activity
    const { createActivityLog } = require('./activityLogController');
    await createActivityLog(req.user._id, 'MEMBER_ADDED', 'Club', club._id, `Added user ${userId}`);

    res.json({ message: 'Member added successfully' });
});

// @desc    Remove member from club (Organizer)
// @route   DELETE /api/clubs/:id/members/:userId
// @access  Private (Organizer of that club)
const removeMember = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const club = await Club.findById(req.params.id);

    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }

    // Check if requester is the lead organizer
    if (club.leadOrganizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to manage members');
    }

    club.members = club.members.filter(m => m.toString() !== userId);
    await club.save();

    // Log activity
    const { createActivityLog } = require('./activityLogController');
    await createActivityLog(req.user._id, 'MEMBER_REMOVED', 'Club', club._id, `Removed user ${userId}`);

    res.json({ message: 'Member removed successfully' });
});

module.exports = { getClubs, getMyManagedClubs, getClubById, createClub, updateClub, deleteClub, joinClub, leaveClub, addMember, removeMember };
