const express = require('express');
const router = express.Router();
// Controllers
const { requireSignIn } = require('../../controllers/auth');
const { createPost } = require('../../controllers/posts');
const { userById } = require('../../controllers/user');
// Validation
const { postsValidator } = require('../../validators');

router.post('/post/create/:userId', requireSignIn, postsValidator, createPost);

// Parameter from URL
router.param('userId', userById);

module.exports = router;
