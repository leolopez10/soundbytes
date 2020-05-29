const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // to check for authentication
const bcrypt = require('bcryptjs'); // to check for password match
const gravatar = require('gravatar'); // avatar image for user
const { validationResult } = require('express-validator'); // validation for user sign in and sign up
const { errorHandler } = require('../helpers/dbErrorHandler'); // Error handler for database errors

// Model
const User = require('../models/user');

exports.signup = (req, res) => {
  //   res.json(req.body);

  // Handle validation errors for signing up
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Create new user and save to database
  const user = new User(req.body);
  user.avatar = gravatar.url(user.email, { s: '200', r: 'pg', d: 'mm' });
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    user.password = undefined;

    // Generate user token to login user immidately after signing up
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 'x-auth-token' in cookie with expiry date
    res.cookie('x-auth-token', token, { expiresIn: 360000 }); // 3600 is an hour
    //return response with user and token to frontend client
    return res.status(200).json({ token, user });
  });
};

exports.signin = (req, res) => {
  // res.json(req.body);

  // Handle validation errors for signing up
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        err:
          'User with that email could not be found. Please sign up or check for spelling errors'
      });
    }

    // If user is found check email and password for a match
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({ err: 'Invalid password' });
        }

        // Generate user token to login user immidately after signing up
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 'x-auth-token' in cookie with expiry date
        res.cookie('x-auth-token', token, { expiresIn: 360000 }); // 3600 is an hour
        //return response with user and token to frontend client
        const { _id, name, email, avatar } = user;
        return res.status(200).json({
          token,
          user: {
            _id,
            name,
            email,
            avatar
          }
        });
      })
      .catch(err => res.status(400).json(err));
  });
};

exports.signout = (req, res) => {
  res.clearCookie('x-auth-token');
  res.json({ msg: 'Sign-out successful' });
};

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});
