const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = asyncHandler(async (req, res) => {
    const resources = await Resource.find({});
    res.json(resources);
});

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private (Admin)
const createResource = asyncHandler(async (req, res) => {
    const { name, type, capacity, description, location } = req.body;
    const resource = new Resource({ name, type, capacity, description, location });
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
const updateResource = asyncHandler(async (req, res) => {
    const { name, type, capacity, description, location, isAvailable } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (resource) {
        resource.name = name || resource.name;
        resource.type = type || resource.type;
        resource.capacity = capacity || resource.capacity;
        resource.description = description || resource.description;
        resource.location = location || resource.location;
        resource.isAvailable = isAvailable !== undefined ? isAvailable : resource.isAvailable;

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
const deleteResource = asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id);
    if (resource) {
        await resource.deleteOne();
        res.json({ message: 'Resource removed' });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

module.exports = { getResources, createResource, updateResource, deleteResource };
