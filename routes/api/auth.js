const express = require('express');
const router = express.Router();
// Controllers
const { signup } = require('../../controllers/auth');
// Validation
const { signupValidator } = require('../../validators');

// Routes w/ controllers and middleware
router.post('/signup', signupValidator, signup);

module.exports = router;
