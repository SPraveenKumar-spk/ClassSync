const mongoose = require("mongoose");
const User = require("./user");

const joinSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  joinType: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Project Member", "Project Lead"],
    validate: {
      validator: function (v) {
        return this.joinType !== "Team" || !!v;
      },
      message: 'Role is required when joinType is "Team".',
    },
  },
  teamName: {
    type: String,
    validate: {
      validator: function (v) {
        return this.joinType !== "Team" || !!v;
      },
      message: 'Team name is required when joinType is "Team".',
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const JoinProject = mongoose.model("JoinProject", joinSchema);

module.exports = JoinProject;
