const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // to check for authentication
const { check, valdiationResult } = require('express-validator'); // validation for user sign in and sign up
const { errorHandler } = require('../helpers/dbErrorHandler'); // Error handler for database errors

// Model
const User = require('../models/user');

exports.signup = (req, res) => {
  //   res.json(req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    res.status(200).json(user);
  });
};
