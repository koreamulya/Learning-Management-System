const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stores } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = stores.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = stores.User.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: 'Enthusiastic online learner on LMS',
      xp: 100,
      badges: ['Welcome Onboard'],
      enrolledCourses: []
    });

    const token = generateToken(newUser._id);
    const { password: p, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = stores.User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const { password: p, ...userWithoutPassword } = user;

    res.json({
      message: 'Logged in successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const updatedUser = stores.User.findByIdAndUpdate(req.user._id, updates);
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
