// Model
const User = require('../models/user');
const Post = require('../models/post');

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    req.profile = user;
    user.password = undefined;
    next();
  });
};

exports.removeUser = async (req, res) => {
  try {
    // remove all of user posts
    await Post.deleteMany({ user: req.profile._id });

    // @todo - remove all of user tracks as well

    // delete user
    await User.findOneAndRemove({ _id: req.profile._id });

    res.status(200).json({
      msg: 'User deleted'
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error);
  }
};
