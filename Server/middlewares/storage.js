const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

conn.once('open', () => {
  console.log('MongoDB connection established for GridFS');
});

const storage = new GridFsStorage({
  db: conn, 
  file: (req, file) => {
    return {
      bucketName: 'uploads', 
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
