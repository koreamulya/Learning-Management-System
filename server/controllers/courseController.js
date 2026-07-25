const { stores } = require('../config/db');

// Get all courses with search & filter
exports.getAllCourses = async (req, res) => {
  try {
    let courses = stores.Course.find();
    const { category, level, search, sort } = req.query;

    if (category && category !== 'All') {
      courses = courses.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
    }

    if (level && level !== 'All') {
      courses = courses.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
    }

    if (search) {
      const term = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        (c.instructor && c.instructor.name && c.instructor.name.toLowerCase().includes(term))
      );
    }

    if (sort === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'popular') {
      courses.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
    } else if (sort === 'newest') {
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

// Get single course details
exports.getCourseById = async (req, res) => {
  try {
    const course = stores.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Attach reviews
    const reviews = stores.Review.find({ courseId: course._id });
    res.json({ ...course, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course details' });
  }
};

// Create new course (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, modules, price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please fill in required fields (title, description, category)' });
    }

    const newCourse = stores.Course.insertOne({
      title,
      description,
      category,
      level: level || 'Beginner',
      price: price || 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      instructor: {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar
      },
      rating: 5.0,
      totalRatings: 1,
      totalStudents: 0,
      modules: modules || []
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};

// Update course (Instructor only)
exports.updateCourse = async (req, res) => {
  try {
    const course = stores.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.id !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const updatedCourse = stores.Course.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating course' });
  }
};

// Delete course (Instructor only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = stores.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.id !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    stores.Course.deleteOne({ _id: req.params.id });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting course' });
  }
};
