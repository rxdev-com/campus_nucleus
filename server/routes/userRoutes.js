const express = require('express');
const router = express.Router();
const { getUserById, toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/favorites', protect, getFavorites);
router.post('/favorite/:eventId', protect, toggleFavorite);
router.get('/:id', protect, getUserById);

module.exports = router;
