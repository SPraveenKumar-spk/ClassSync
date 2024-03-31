const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required :true,
    },
    role : {
        type:String,
        required:true,
    }

})

userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
            {
                userId : this._id.toString(),
                email: this.email,

            },
            process.env.JWT_SECRET_KEY,{
                expiresIn:"10d"
            }
        );
    }catch(error){
        console.log(error);
    }
}

const User = new mongoose.model("User",userSchema);

module.exports = User;