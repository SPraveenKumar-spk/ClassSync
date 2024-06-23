const jwt = require("jsonwebtoken");
const User = require("../models/user");

const AuthMiddleware = async(req,res,next) =>{
  
        const token = req.header("Authorization");
        if(!token){
            return res.status(200).json({msg:"Token not found"});
        }
        const jwtToken = token.replace("Bearer","").trim();
     
    try{
       
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        const details = await User.findOne({email : isVerified.email}).select({password:0});
        console.log(details);
        req.user = details,
        req.token =  token,
        req.userId = details._id

        next();
    }catch(error){
        console.log(error);
        return res.status(404).json({msg:"unAuthorized access"});
    }
    
}

module.exports = AuthMiddleware;