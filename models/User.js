require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  password: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  //console.log(this);
  if (this.isModified('password')) {
    //Encrypt their password
    return bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(this.password, salt).then(hash => {
          //console.log(hash)
          this.password = hash;
        });
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  } else {
    return Promise.resolve();
  }
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
