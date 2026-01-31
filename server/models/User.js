const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'organizer', 'participant'],
        default: 'participant',
    },
    department: {
        type: String,
        required: true, // e.g., 'Computer Science'
    },
    year: {
        type: String, // e.g., 'SY', 'TY', 'Final Year'
    },
    contact: {
        type: String,
        default: '',
    },
    enrollmentId: {
        type: String,
        default: '',
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
    },
    managedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    }],
    joinedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],
    otp: {
        type: String,
    },
    otpExpire: {
        type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
