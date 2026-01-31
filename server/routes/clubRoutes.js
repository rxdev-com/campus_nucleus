const express = require('express');
const router = express.Router();
const { getClubs, getMyManagedClubs, getClubById, createClub, updateClub, deleteClub, joinClub, leaveClub, addMember, removeMember } = require('../controllers/clubController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getClubs)
    .post(protect, admin, createClub);

router.get('/my-managed', protect, getMyManagedClubs);

router.route('/:id')
    .get(getClubById)
    .put(protect, admin, updateClub)
    .delete(protect, admin, deleteClub);

router.post('/:id/join', protect, joinClub);
router.delete('/:id/leave', protect, leaveClub);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
