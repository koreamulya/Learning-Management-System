const express = require('express');
const router = express.Router();
const { getDiscussions, createDiscussion, addReply, getLeaderboard } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.get('/:courseId', getDiscussions);
router.post('/:courseId', protect, createDiscussion);
router.post('/:id/reply', protect, addReply);

module.exports = router;
