require("dotenv").config();
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");

const URI = process.env.MongoDBURI;
const conn = mongoose.createConnection(URI);

let bucket;
conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const storage = new GridFsStorage({
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return reject(new Error("File type not allowed"));
        }

        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          contentType: file.mimetype,
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

const uploadTaskFiles = async (req, res) => {
  try {
    console.log("File received:", req.file);
    res.json({ fileId: req.file });
  } catch (err) {
    console.log(err);
  }
};

const fetchTaskFiles = async (req, res) => {
  try {
    const file = await bucket.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No file exists" });
    }

    const fileType = file[0].contentType;

    if (["image/jpeg", "image/png", "application/pdf"].includes(fileType)) {
      const downloadStream = bucket.openDownloadStream(file[0]._id);
      res.set("Content-Type", fileType);
      downloadStream.pipe(res);
    } else if (
      [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ].includes(fileType)
    ) {
      const downloadStream = bucket.openDownloadStream(file[0]._id);
      res.set(
        "Content-Disposition",
        `attachment; filename=${file[0].filename}`
      );
      res.set("Content-Type", fileType);
      downloadStream.pipe(res);
    } else {
      res.status(404).json({ err: "Unsupported file type" });
    }
  } catch (err) {
    console.error("Error retrieving file:", err);
    return res.status(500).json({ err: "Error retrieving file" });
  }
};

module.exports = {
  upload,
  uploadTaskFiles,
  fetchTaskFiles,
};
