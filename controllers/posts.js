const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');

exports.createPost = (req, res) => {
  // Handle validation errors for signing up
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Get user information from URL params
  const user = req.profile;

  // Create new post by signed in user
  const post = new Post({
    user,
    title: req.body.title,
    description: req.body.description,
    avatar: user.avatar
  });

  // Save post information to database
  post.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.status(200).json(data);
  });
};
