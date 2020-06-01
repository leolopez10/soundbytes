const router = require('express').Router();

// Import Routes
const authRoutes = require('./api/auth');
const postRoutes = require('./api/posts');
const fileRoutes = require('./api/files');

// Routes to export to server
router.use('/api', authRoutes);
router.use('/api', postRoutes);
router.use('/api', fileRoutes);

module.exports = router;
