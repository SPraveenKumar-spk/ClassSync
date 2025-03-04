const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const createProject = mongoose.model("createProject", createSchema);

module.exports = createProject;
