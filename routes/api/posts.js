const express = require('express');
const router = express.Router();
// Controllers
const { requireSignIn } = require('../../controllers/auth');
const {
  postById,
  create,
  list,
  read,
  remove,
  update
} = require('../../controllers/posts');
const { userById } = require('../../controllers/user');
// Validation
const { postsValidator } = require('../../validators');

router.post('/post/:userId', requireSignIn, postsValidator, create);
router.get('/post', list);
router.get('/post/:postId', requireSignIn, read);
router.put('/post/:postId/:userId', requireSignIn, update);
router.delete('/post/:postId/:userId', requireSignIn, remove);

// Parameter from URL
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
