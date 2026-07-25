const { stores } = require('../config/db');

exports.getDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const list = stores.Discussion.find({ courseId });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions' });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = stores.Discussion.insertOne({
      courseId,
      title,
      content,
      author: {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.role
      },
      replies: [],
      likes: 0
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = stores.Discussion.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = {
      _id: 'rep_' + Date.now(),
      content,
      author: {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.role
      },
      createdAt: new Date().toISOString()
    };

    const updatedReplies = [...(post.replies || []), reply];
    const updatedPost = stores.Discussion.findByIdAndUpdate(id, { replies: updatedReplies });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = stores.User.find();
    // Sort by XP descending
    const sorted = users.map(u => ({
      _id: u._id,
      name: u.name,
      avatar: u.avatar,
      role: u.role,
      xp: u.xp || 100,
      badges: u.badges || [],
      completedCount: (u.enrolledCourses || []).length
    })).sort((a, b) => b.xp - a.xp);

    res.json(sorted.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};
