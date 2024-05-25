    const mongoose = require("mongoose");

    const taskSchema = new mongoose.Schema({
        taskId:{
            type : String,
            required : true,
            unique: true,
        },
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
        deadline:{
            type : String,
            required : true,
        },
        files:{
            type:Object,
            default :{},
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        projectCode :{
            type:String,
            required: true,
        }
    })

    const Tasks = new mongoose.model("Tasks",taskSchema);

    module.exports = Tasks;