const router = require('express').Router();

// Import Routes
const authRoutes = require('./api/auth');
const postRoutes = require('./api/posts');

// Routes to export to server
router.use('/api', authRoutes);
router.use('/api', postRoutes);

module.exports = router;
