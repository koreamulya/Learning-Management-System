const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', protect, instructorOnly, createCourse);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);

module.exports = router;
