const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected', 'published', 'completed'],
        default: 'draft',
    },
    organizerClub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    coOrganizerClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeStart: {
        type: Date,
        required: true,
    },
    timeEnd: {
        type: Date,
        required: true,
    },
    venue: {
        type: String, // Can be a Resource name or external
    },
    budget: {
        type: Number,
        default: 0,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    rejectionReason: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ['public', 'internal', 'private'],
        default: 'public',
    },
    tags: [String],
    meetingLink: String,
    bannerImage: {
        type: String,
        default: '',
    },
    galleryImages: [String],
    isFest: {
        type: Boolean,
        default: false,
    },
    festName: {
        type: String,
        default: '',
    },
    eventLifecycle: [{
        status: {
            type: String,
            enum: ['draft', 'submitted', 'approved', 'rejected', 'published', 'completed'],
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        comment: String,
    }],
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
