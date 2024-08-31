const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const mongoURI = process.env.MongoDBURI;
mongoose.connect(mongoURI);
const conn = mongoose.connection;

let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        console.log("files", fileInfo);
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });
const getGFS = () => gfs;
module.exports = { upload, getGFS };
