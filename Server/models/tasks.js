const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName :{
        type: String,
        required:true,
    },
    theme : {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    files:{
        type:Object,
        default :{},
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const Tasks = new mongoose.model("Tasks",taskSchema);

module.exports = Tasks;