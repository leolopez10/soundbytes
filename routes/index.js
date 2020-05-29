const router = require('express').Router();

// Import Routes
const authRoutes = require('./api/auth');

// Routes to export to server
router.use('/api', authRoutes);

module.exports = router;
