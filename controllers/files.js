// Gridfs and mongoose for creating posts and uploading music
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Save audio file
// First create connection to database
const conn = mongoose.createConnection(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('tracks');
});

// Create storage engin
const storage = new GridFsStorage({
  url: process.env.DATABASE,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'tracks'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

// @route POST /upload/:userId
// @desc Uploads file to DB
// @access Private
exports.create = upload.single('file');

exports.createResponse = (req, res) => {
  res.status(200).json({
    msg: 'File has been uploaded successfully',
    file: req.file
  });
};

// @Route GET /files
// @desc Display all files in json
// @access Public
exports.listFiles = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files exist
    if (!files || files.length === 0) {
      return res.status(404).json({
        error: 'No files exist'
      });
    }
    // Files exist
    return res.status(200).json(files);
  });
};

// @Route GET /files/:userId
// @desc Display all of users files in json
// @access Private
// exports.listUserFiles = (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files exist
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         error: console.log(err) + 'No files exist'
//       });
//     }
//     // Files exist
//     return res.status(200).json(files);
//   });
// };

// Get fileName from URL
exports.fileByName = (req, res, next, name) => {
  gfs.files.findOne({ filename: name }, (err, file) => {
    if (err) {
      return res.status(400).json({
        error: 'file not found'
      });
    }
    req.fileName = file;
    next();
  });
};

// @route   GET api/files/:filename
// @desc    GET file by name
// @access  Private
exports.readByFileName = (req, res) => {
  return res.status(200).json(req.fileName);
};

// @route   PUT api/upload/:filename/:userId
// @desc    UPDATE file by name
// @access  Private
exports.update = (req, res) => {
  res.status(200).json({
    msg: 'File has been updated successfully',
    file: req.fileName
  });
};

// @route   DELETE api/files/:filename/:userId
// @desc    UPDATE file by name
// @access  Private
exports.remove = (req, res) => {
  gfs.remove(
    { filename: req.params.filename, root: 'tracks' },
    (err, gridStore) => {
      if (err) {
        return res.status(404).json({ error: err });
      }
      res.status(200).json({
        msg: 'File has been deleted'
      });
    }
  );
};
