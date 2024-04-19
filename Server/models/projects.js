const mongoose = require("mongoose")
const projectScheme = new mongoose.Schema({
    projectName  :{
        type : String,
        required : true,
    },
    classroom : {
        type : String,
        required : true,
    },
    students :{
        type : String,
        required : true,
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

const Project = new mongoose.model("Project",projectScheme)

module.exports = Project;