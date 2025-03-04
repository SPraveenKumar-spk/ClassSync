require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/Message");

const URI = process.env.MongoDBURI;
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: " https://classync.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  },
});

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
  origin: " https://classync.vercel.app",
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

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("joinChatGroup", async ({ projectCode, teamName }) => {
    const groupName = `${projectCode}_${teamName}`;
    socket.join(groupName);
    console.log(`User joined group ${groupName}`);

    const pastMessages = await Message.find({ groupId: groupName }).sort({
      createdAt: 1,
    });

    socket.emit("loadPastMessages", pastMessages);
  });

  socket.on(
    "sendMessage",
    async ({ projectCode, teamName, sender, message }) => {
      const groupName = `${projectCode}_${teamName}`;
      const newMessage = new Message({ groupId: groupName, sender, message });
      await newMessage.save();
      io.to(groupName).emit("receiveMessage", newMessage);
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = 5000;

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
  });
});
