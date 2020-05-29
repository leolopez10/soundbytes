const express = require('express');
const router = express.Router();
//controllers
const { signup } = require('../../controllers/auth');

// Routes w/ controllers and middleware
router.post('/signup', signup);

module.exports = router;
