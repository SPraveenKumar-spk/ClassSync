const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    default: null,
  },
});

userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password,saltRound);
        user.password = hash_password;
        next();
    }catch(error){
        next(error);
    }
})


userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
          {
            userId: this._id.toString(),
            email: this.email,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
    }catch(error){
        console.log(error);
    }
}

const User = new mongoose.model("User", userSchema);

module.exports = User;