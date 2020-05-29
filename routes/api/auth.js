const express = require('express');
const router = express.Router();
// Controllers
const { signup, signin } = require('../../controllers/auth');
// Validation
const { signupValidator, signinValidator } = require('../../validators');

// Routes w/ controllers and middleware
router.post('/signup', signupValidator, signup);
router.post('/signin', signinValidator, signin);

module.exports = router;
