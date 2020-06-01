const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');

// Models
// const User = require('../models/user');
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

// @route   UPDATE api/post/:postId/:userId
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
      return res.status(500).json({
        error: 'Server Error'
      });
    }
    res.status(200).json(data);
  });
};

// @route   DELETE api/post/:postId/:userId
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

// // Get commentId from URL
// exports.commentById = (req, res, next, id) => {
//   Post.findById(id).exec((err, post) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'Post not found'
//       });
//     }
//     req.post = post;
//     next();
//   });
// };

// @route   POST api/post/comment/:postId/:userId
// @desc    Post a comment on a post by postid and userId
// @access  Private
exports.createComment = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = req.profile;
  const post = req.post;

  const newComment = new Post({
    user: user._id,
    description: req.body.description,
    name: user.name,
    avatar: user.avatar
  });

  // add new comment to the beginning of the array
  post.comments.unshift(newComment);

  // Save updated post with comment to database
  post.save((err, data) => {
    if (err) {
      return res.status(500).json({
        error: 'Server Error'
      });
    }
    res.status(200).json(data.comments);
  });
};

// @route   DELETE api/post/comment/:postId/:commentId/:userId
// @desc    Delete post by id
// @access  Private only user can delete
exports.removeComment = (req, res) => {
  const post = req.post;
  const user = req.profile;

  // Pull out comment
  const comment = post.comments.find(
    comment => comment._id.toString() === req.params.commentId
  );

  // Make sure comment exists
  if (!comment) {
    return res.status(404).json({ msg: 'Comment does not exit' });
  }

  // Check to see if user left the comment
  if (comment.user._id.toString() !== user._id.toString()) {
    return res
      .status(401)
      .json({ msg: 'User not authorized to delete this comment' });
  }

  // Get remove index
  const removeIndex = post.comments
    .map(comment => comment.user._id.toString())
    .indexOf(user._id);

  // Remove comment
  post.comments.splice(removeIndex, 1);

  // Save updated post to database
  post.save((err, post) => {
    if (err) {
      return res.status(500).json({
        error: errorHandler(err)
      });
    }
    res.status(200).json(post.comments);
  });
};

// @route   PUT api/posts/like/:postId/:userId
// @desc    Add a like and user to a post and make sure only one like per user
// @access  Private
exports.like = (req, res) => {
  const post = req.post;
  const user = req.profile;

  // Check to make sure the user has not liked the post
  if (
    post.likes.filter(like => like.user._id.toString() == user._id.toString())
      .length > 0
  ) {
    return res.status(400).json({ msg: 'Post already liked' });
  }
  // Post user id like to the first of list
  post.likes.unshift({ user });

  // Save updated post to the database
  post.save((err, post) => {
    if (err) {
      return res.status(500).json({
        error: errorHandler(err)
      });
    }
    res.status(200).json(post.likes);
  });
};

// @route   PUT api/post/unlike/:postId/:userId
// @desc    Update like by removing it from the post
// @access  Private
exports.unlike = (req, res) => {
  const post = req.post;
  const user = req.profile;
  // Check if the post has already been liked
  if (
    post.likes.filter(like => like.user._id.toString() == user._id.toString())
      .length === 0
  ) {
    return res.status(400).json({ msg: 'Post has not been liked' });
  }

  // find the user's id in the like
  const removeIndex = post.likes
    .map(like => like.user._id.toString())
    .indexOf(user._id);

  // remove the like by user id
  post.likes.splice(removeIndex, 1);

  // save new post to the database
  post.save((err, post) => {
    if (err) {
      return res.status(500).json({
        error: errorHandler(err)
      });
    }
    res.status(200).json(post.likes);
  });
};
