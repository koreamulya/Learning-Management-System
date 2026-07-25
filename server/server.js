const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const seedData = require('./data/seedData');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const quizRoutes = require('./routes/quizRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/discussions', discussionRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'LMS Online Learning Platform API', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize DB & Seed Data then Start Server
connectDB().then(async () => {
  await seedData();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🚀 LMS Express Backend Server Running on Port ${PORT}`);
    console.log(`  🔗 API Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
});
