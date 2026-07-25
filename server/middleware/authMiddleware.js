const jwt = require('jsonwebtoken');
const { stores } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'lms_secret_key_2026_super_secure';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = stores.User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists' });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const instructorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Instructor or Admin privileges required' });
  }
};

module.exports = { protect, instructorOnly, JWT_SECRET };
