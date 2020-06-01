const express = require('express');
const router = express.Router();
// Controllers
const { requireSignIn } = require('../../controllers/auth');
const { postById } = require('../../controllers/posts');
const { userById } = require('../../controllers/user');
const {
  fileByName,
  create,
  createResponse,
  listFiles,
  //   listUserFiles,
  readByFileName,
  update,
  remove
} = require('../../controllers/files');

// File uploader Routes
router.post('/upload/:userId', requireSignIn, create, createResponse);
router.get('/files', listFiles);
// router.get('/files/:userId', requireSignIn, listUserFiles); // Need to work on adding a userId to this data
router.get('/files/:filename', requireSignIn, readByFileName);
router.put('/upload/:filename/:userId', requireSignIn, create, update);
router.delete('/files/:filename/:userId', requireSignIn, remove);

// Parameter from URL
router.param('userId', userById);
router.param('postId', postById);
router.param('filename', fileByName);

module.exports = router;
