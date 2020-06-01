const express = require('express');
const router = express.Router();
// Controllers
const { requireSignIn } = require('../../controllers/auth');
const {
  postById,
  create,
  list,
  read,
  update,
  remove,
  createComment,
  removeComment,
  like,
  unlike
} = require('../../controllers/posts');
const { userById } = require('../../controllers/user');
// Validation
const { postsValidator, commentValidator } = require('../../validators');

// Post routes
router.post('/post/:userId', requireSignIn, postsValidator, create);
router.get('/post', list);
router.get('/post/:postId', requireSignIn, read);
router.put('/post/:postId/:userId', requireSignIn, update);
router.delete('/post/:postId/:userId', requireSignIn, remove);

// Comment for posts
router.post(
  '/post/comment/:postId/:userId',
  requireSignIn,
  commentValidator,
  createComment
);
router.delete(
  '/post/comment/:postId/:commentId/:userId',
  requireSignIn,
  removeComment
);

// Likes for posts
router.put('/post/like/:postId/:userId', requireSignIn, like);
router.put('/post/unlike/:postId/:userId', requireSignIn, unlike);

// Parameter from URL
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
