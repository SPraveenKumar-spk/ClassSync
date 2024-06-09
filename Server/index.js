const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const URI = process.env.MongoDBURI;
const connectDB = async () => {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DataBase Successfully");
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

const corsOptions = {
  origin: "https://classsync.vercel.app", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 
app.use(express.json());

const router = require("./auth/auth-router");
app.use("/api/auth/", router);

const port = 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
  });
});
