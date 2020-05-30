const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');

// Get postId from URL
exports.postById = (req, res, next, id) => {
  Post.findById(id).exec((err, post) => {
    if (err) {
      return res.status(400).json({
        error: 'Post not found'
      });
    }
    req.post = post;
    next();
  });
};

// @route   POST api/post/create/:userId
// @desc    Create post w/o file by user Id
// @access  Private
exports.create = (req, res) => {
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

// @route   GET api/post
// @desc    GET all Posts
// @access  Private
exports.list = (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.status(200).json(posts);
    });
};

// @route   GET api/post/:postId
// @desc    GET post by id
// @access  Private
exports.read = (req, res) => {
  return res.status(200).json(req.post);
};

// @route   UPDATE api/posts/:postId/:userId
// @desc    update post by UserId and PostId
// @access  Private
exports.update = (req, res) => {
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

// @route   DELETE api/posts/:postId/:userId
// @desc    Delete post by id
// @access  Private
exports.remove = (req, res) => {
  const post = req.post;
  post.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      msg: 'Post deleted'
    });
  });
};
