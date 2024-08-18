const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
