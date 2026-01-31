const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    updateUserRole,
    toggleUserStatus,
    forgotPassword,
    verifyOTP,
    resetPassword,
    googleLogin,
    refreshAccessToken,
    logoutUser,
    toggleFavoriteEvent
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/google', googleLogin);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile/favorites/:id')
    .put(protect, toggleFavoriteEvent);

// Admin routes
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/role').put(protect, admin, updateUserRole);
router.route('/users/:id/status').patch(protect, admin, toggleUserStatus);

module.exports = router;
