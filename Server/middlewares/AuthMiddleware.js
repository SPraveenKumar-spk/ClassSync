const jwt = require("jsonwebtoken");
const User = require("../models/user");

const AuthMiddleware = async(req,res,next) =>{
  
        const token = req.header("Authorization");
        if(!token){
            return res.status.json({msg:"Token not found"});
        }
        const jwtToken = token.remove("Bearer","").trim();
        console.log(jwtToken);
     
    try{
       
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);

        console.log(isVerified);

        const details = await User.findOne({email : isverified.email}).select({password:0});
        console.log(details);
        req.user = details,
        req.token =  token,
        req.userId = details._id

        next();
    }catch(error){
        console.log(error);
        return res.status.json({msg:"unAuthorized access"});
    }
    
}

module.exports = AuthMiddleware;