const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  projectName: {
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
  role: {
    type: String,
    enum: ["Project Member", "Project Lead"],
    required: true,
  },
  teamName: {
    type: String,
    required: function () {
      return this.role === "Project Lead";
    },
  },
});

const studentProjects = new mongoose.model("studentprojects", studentSchema);

module.exports = studentProjects;
