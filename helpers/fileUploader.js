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

exports.uploadSingleFile = upload.single('file');

exports.uploadSingleFileResponse = (req, res) => {
  res.status(200).json({
    msg: 'File has been uploaded succesfully'
  });
};
