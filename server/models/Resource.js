const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['room', 'hall', 'lab', 'equipment'],
        required: true,
    },
    capacity: {
        type: Number,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    requiresApproval: {
        type: Boolean,
        default: true,
    },
    autoApprove: {
        type: Boolean,
        default: false,
    },
    description: String,
    imageUrl: String,
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
