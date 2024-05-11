const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    data : {
        type:String,
        required : true,
    },
    projectCode :{
        type:String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
})

const Diary = new mongoose.model("Diary",diarySchema)
module.exports = Diary;