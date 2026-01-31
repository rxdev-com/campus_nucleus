const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Cookie options
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // not accessible via client-side JS
        secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
        sameSite: 'strict'
    };

    res.status(statusCode)
        .cookie('refreshToken', refreshToken, options)
        .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            department: user.department,
            managedClubs: user.managedClubs,
            favorites: user.favorites,
            token, // Access token
        });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        sendTokenResponse(user, 200, res);
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, department, year, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        department,
        year,
        role: role || 'participant',
    });

    if (user) {
        sendTokenResponse(user, 201, res);
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Cookie based)
const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Not authorized, no refresh token');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecret');

        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }

        const accessToken = generateToken(user._id);

        res.json({ token: accessToken });
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

// @desc    Logout / Clear Cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'User logged out' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            managedClubs: user.managedClubs,
            favorites: user.favorites,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Private (Admin)
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Toggle user active status
// @route   PATCH /api/auth/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isActive = !user.isActive;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.department = req.body.department || user.department;
        user.year = req.body.year || user.year;
        user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
        user.bio = req.body.bio || user.bio;
        user.socialLinks = req.body.socialLinks || user.socialLinks;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        sendTokenResponse(updatedUser, 200, res);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Toggle favorite event
// @route   PUT /api/auth/profile/favorites/:id
// @access  Private
const toggleFavoriteEvent = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const eventId = req.params.id;

    if (user) {
        if (user.favorites.includes(eventId)) {
            user.favorites = user.favorites.filter(id => id.toString() !== eventId);
        } else {
            user.favorites.push(eventId);
        }
        await user.save();
        res.json(user.favorites);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Forgot password (OTP phase 1)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send Email
    const message = `Your password reset OTP is: ${otp}\n\nIt is valid for 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'CampusNucleus Password Reset OTP',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to email',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error(error);
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Verify OTP (OTP phase 2)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    res.status(200).json({
        success: true,
        message: 'OTP verified'
    });
});

// @desc    Reset password (OTP phase 3)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired OTP session');
    }

    // Set new password
    user.password = password;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            password: sub, // Dummy password
            avatarUrl: picture,
            isVerified: true,
        });
    }

    if (user) {
        sendTokenResponse(user, 200, res);
    } else {
        res.status(401);
        throw new Error('Invalid Google Token');
    }
});

module.exports = {
    authUser,
    registerUser,
    refreshAccessToken,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    updateUserRole,
    toggleUserStatus,
    forgotPassword,
    verifyOTP,
    resetPassword,
    googleLogin,
    toggleFavoriteEvent
};
