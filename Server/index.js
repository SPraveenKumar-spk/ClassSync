require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const app = express();
const MongoDBStore = require("connect-mongodb-session")(session);

const URI = process.env.MongoDBURI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to Database Successfully");
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

const store = new MongoDBStore({
  uri: process.env.MongoDBURI,
  collection: "sessions",
});

const corsOptions = {
  origin: "https://classsync-sooty.vercel.app", 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions)); 

app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure:true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'https://classsync-sooty.vercel.app',
    },
  })
);



const router = require("./auth/auth-router");
app.use("/api/auth/", router);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
  });
});
