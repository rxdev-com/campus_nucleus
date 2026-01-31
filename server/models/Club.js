const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    logoUrl: {
        type: String,
    },
    leadOrganizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],
    bannerUrl: {
        type: String,
        default: '',
    },
    leadership: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role: String, // e.g., 'President', 'Secretary'
    }],
    facultyCoordinator: {
        name: String,
        email: String,
    },
    socialMedia: {
        instagram: String,
        linkedin: String,
        website: String,
    },
}, {
    timestamps: true,
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
