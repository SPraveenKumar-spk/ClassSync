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
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
