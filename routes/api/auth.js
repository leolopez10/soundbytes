const express = require('express');
const router = express.Router();
// Controllers
const {
  signup,
  signin,
  signout,
  requireSignIn
} = require('../../controllers/auth');
const { userById, removeUser } = require('../../controllers/user');
const { postById } = require('../../controllers/posts');
// const {fileByName} = require('../../controllers/files')
// Validation
const { signupValidator, signinValidator } = require('../../validators');

// Routes w/ controllers and middleware
router.post('/auth/signup', signupValidator, signup);
router.post('/auth/signin', signinValidator, signin);
router.get('/auth/signout', signout);
router.delete('/auth/remove/:userId', requireSignIn, removeUser);

router.param('userId', userById);
router.param('postId', postById);
// router.param('filename', fileByName);

module.exports = router;
