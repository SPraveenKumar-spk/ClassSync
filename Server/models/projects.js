const mongoose = require("mongoose")
const jwt = ("jsonwebtoen")

const projectScheme = new mongoose.Schema({
    projectname  :{
        type : String,
        required : true,
    },
    classroom : {
        type : String,
        required : true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
})

const Project = new mongoose.model("Project",projectScheme)

module.exports = Project;