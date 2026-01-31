const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // Context can be an event ID or club ID
    contextId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    contextType: {
        type: String,
        enum: ['event', 'club', 'direct'],
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
