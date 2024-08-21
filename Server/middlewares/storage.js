const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

// Create a connection to MongoDB
const conn = mongoose.createConnection(process.env.MongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize GridFS
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("MongoDB connection established for GridFS");
});

const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return {
      bucketName: "uploads", // Collection name in MongoDB
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, gfs };
