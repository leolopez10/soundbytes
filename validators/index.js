const { check } = require('express-validator'); // validation for user sign in and sign up

exports.signupValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 })
];

exports.signinValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.postsValidator = [
  check('title', 'What is your song title').not().isEmpty()
];
