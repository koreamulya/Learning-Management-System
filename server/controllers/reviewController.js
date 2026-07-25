const { stores } = require('../config/db');

// Get reviews for a course
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = stores.Review.find({ courseId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Add or update review
exports.addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    let review = stores.Review.findOne({ userId, courseId });
    if (review) {
      review = stores.Review.findByIdAndUpdate(review._id, {
        rating: Number(rating),
        comment,
        updatedAt: new Date().toISOString()
      });
    } else {
      review = stores.Review.insertOne({
        userId,
        courseId,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        rating: Number(rating),
        comment
      });
    }

    // Recalculate average rating for course
    const allCourseReviews = stores.Review.find({ courseId });
    const avgRating = (
      allCourseReviews.reduce((acc, r) => acc + r.rating, 0) / allCourseReviews.length
    ).toFixed(1);

    stores.Course.findByIdAndUpdate(courseId, {
      rating: parseFloat(avgRating),
      totalRatings: allCourseReviews.length
    });

    res.json({ message: 'Review saved successfully', review });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Server error saving review' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = stores.Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const courseId = review.courseId;
    stores.Review.deleteOne({ _id: id });

    // Recalculate course rating
    const remaining = stores.Review.find({ courseId });
    const avg = remaining.length > 0
      ? (remaining.reduce((acc, r) => acc + r.rating, 0) / remaining.length).toFixed(1)
      : 5.0;

    stores.Course.findByIdAndUpdate(courseId, {
      rating: parseFloat(avg),
      totalRatings: remaining.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting review' });
  }
};
