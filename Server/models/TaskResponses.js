const mongoose = require("mongoose");

const taskResponseSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  projectCode: {
    type: "String",
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const taskResponse = mongoose.model("taskResponse", taskResponseSchema);
module.exports = taskResponse;
