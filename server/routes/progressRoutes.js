const express = require('express');
const router = express.Router();
const { enrollCourse, getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll', protect, enrollCourse);
router.get('/:courseId', protect, getProgress);
router.post('/update', protect, updateProgress);

module.exports = router;
