const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user by ID (Buddy Profile)
// @route   GET /api/users/:id
// @access  Public/Protected
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').populate('joinedClubs managedClubs');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Toggle favorite event
// @route   POST /api/users/favorite/:eventId
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const eventId = req.params.eventId;

    const isFavorite = user.favorites.includes(eventId);

    if (isFavorite) {
        user.favorites = user.favorites.filter((id) => id.toString() !== eventId);
    } else {
        user.favorites.push(eventId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
});

// @desc    Get favorite events
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
});

module.exports = { getUserById, toggleFavorite, getFavorites };
