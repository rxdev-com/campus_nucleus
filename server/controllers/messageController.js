const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get messages for a context (event/club/direct)
// @route   GET /api/messages/:contextId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const { contextId } = req.params;
    const { type } = req.query; // Expecting 'type' query param to disambiguate or infer from contextId if possible, but strict param is better.
    // However, original design just had contextId. Let's rely on finding messages with that contextId and inferring type or passing it.
    // Better: GET /api/messages/:contextId?type=event|club|direct

    if (!type) {
        // Fallback: try to guess or just return if user has access to ANY message in that context? 
        // No, we must check access to the context entity first.
        res.status(400);
        throw new Error('Message type query parameter is required');
    }

    // Access Control
    if (type === 'club') {
        const club = await Club.findById(contextId);
        if (!club) {
            res.status(404);
            throw new Error('Club not found');
        }
        // Check if member or admin/organizer
        const isMember = club.members.includes(req.user._id);
        const isOrganizer = club.leadOrganizer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isMember && !isOrganizer && !isAdmin) {
            res.status(403);
            throw new Error('Not authorized to view this club chat');
        }
    } else if (type === 'event') {
        const event = await Event.findById(contextId);
        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }
        const isParticipant = event.participants.includes(req.user._id);
        const isCreator = event.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isParticipant && !isCreator && !isAdmin) {
            res.status(403);
            throw new Error('Not authorized to view this event chat');
        }
    } else if (type === 'direct') {
        // For direct messages, contextId acts as the "Conversation ID" OR we filter by (sender=Me, recipient=Other) OR (sender=Other, recipient=Me).
        // BUT, the model has `contextId`. For DM, `contextId` could be a unique string sort(id1, id2).
        // OR `contextId` could be the `recipient` ID if we treat "chat with X" as a context.
        // Let's assume for this implementation: contextId = current user ID does NOT make sense if we want chat history.
        // Let's assume the frontend sends `contextId` as the OTHER user's ID.
        // Then we find messages where (sender=Me AND recipient=Other) OR (sender=Other AND recipient=Me)
        // AND set contextType='direct'.

        // Logic deviation: The current schema uses `contextId` for grouping. 
        // For simplistic DMs compatible with schema, let's treat contextId as a unique identifier for the pair of users, e.g. "minId_maxId" (requires changing ObjectId to String in schema for contextId? No, contextId is ObjectId).
        // Workaround: We can't easily use `contextId` field for DMs if it must be an ObjectId. 
        // UNLESS we create a "Conversation" model.
        // ALTERNATIVE: Use `contextId` as the *Recipient's* ID for the message being sent, but for querying... 

        // Let's change the query for DMs to Ignore contextId field exact match for grouping and use sender/recipient logic.
        // Client sends GET /api/messages/:otherUserId?type=direct

        const otherUserId = contextId;
        const messages = await Message.find({
            contextType: 'direct',
            $or: [
                { sender: req.user._id, recipient: otherUserId },
                { sender: otherUserId, recipient: req.user._id }
            ]
        }).populate('sender', 'name avatarUrl role').sort({ createdAt: 1 });

        return res.json(messages);
    }

    // For Event/Club (Group types)
    const messages = await Message.find({ contextId })
        .populate('sender', 'name avatarUrl role')
        .sort({ createdAt: 1 });
    res.json(messages);
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content, contextId, contextType, recipient } = req.body;

    if (!content || !contextId || !contextType) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    if (contextType === 'direct') {
        if (!recipient) {
            res.status(400);
            throw new Error('Recipient is required for direct messages');
        }

        // Ensure contextId (conceptually the conversation) is consistent or ignored. 
        // We'll use contextId as the recipient ID to satisfy the schema requirement if strictly needed, 
        // OR we just assume contextId is the recipient's ID.
        // Let's verify recipient exists
        const userExists = await User.findById(recipient);
        if (!userExists) {
            res.status(404);
            throw new Error('Recipient user not found');
        }

        // Create message
        const message = await Message.create({
            sender: req.user._id,
            content,
            contextId: recipient, // For schema compliance, though logic uses sender/recipient fields
            contextType: 'direct',
            recipient
        });

        const populatedMessage = await message.populate('sender', 'name avatarUrl role');
        return res.status(201).json(populatedMessage);
    }

    // Group Chat Checks
    if (contextType === 'club') {
        const club = await Club.findById(contextId);
        if (!club) throw new Error('Club not found');
        if (!club.members.includes(req.user._id) && club.leadOrganizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized');
        }
    } else if (contextType === 'event') {
        const event = await Event.findById(contextId);
        if (!event) throw new Error('Event not found');
        if (!event.participants.includes(req.user._id) && event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized');
        }
    }

    const message = await Message.create({
        sender: req.user._id,
        content,
        contextId,
        contextType
    });

    const populatedMessage = await message.populate('sender', 'name avatarUrl role');

    res.status(201).json(populatedMessage);
});

module.exports = { getMessages, sendMessage };
