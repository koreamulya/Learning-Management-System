const express = require('express');
const router = express.Router();
const { askAITutor } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askAITutor);

module.exports = router;
