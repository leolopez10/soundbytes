const express = require('express');
const router = express.Router();
// Controllers
const { signup, signin, signout } = require('../../controllers/auth');
// Validation
const { signupValidator, signinValidator } = require('../../validators');

// Routes w/ controllers and middleware
router.post('/signup', signupValidator, signup);
router.post('/signin', signinValidator, signin);
router.get('/signout', signout);

module.exports = router;
