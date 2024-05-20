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
    date: {
        type: Date,
        default: Date.now 
      },
      time:{
        type : String
      },
      dayOfWeek: {
        type: String
      },
      comments: {
        type: String,
      },
      marks: {
        type: Number,
      },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
})

const Diary = new mongoose.model("Diary",diarySchema)
module.exports = Diary;