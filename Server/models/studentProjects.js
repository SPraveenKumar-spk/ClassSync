const mongoose = require('mongoose')
const User = require("../models/user")
const studentSchema = new mongoose.Schema({
    projectName :{
        type:String,
        required:true
    },
    projectCode :{
        type :String,
        required :true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
})

const studentProjects = new mongoose.model("studentprojects",studentSchema);
module.exports = studentProjects;