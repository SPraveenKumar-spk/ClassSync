require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const URI = process.env.MongoDBURI;
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to Database Successfully");
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

const corsOptions = {
  origin: "https://classsync-learn.vercel.app",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.json());
const router = require("./auth/auth-router");
app.use("/api/auth/", router);

const port = 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
  });
});
