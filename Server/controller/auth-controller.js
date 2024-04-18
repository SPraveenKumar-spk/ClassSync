const User = require("../models/user")
const Project = require("../models/projects")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const home = (req,res)=>{
    try{
        res.status(200).send("from home");
    }catch(error){
        consolr.log(error);
    }
}

const register = async(req,res)=>{
    try{
        const{name,email,password,role} = req.body;
        console.log(req.body);
        const userExist = await User.findOne({email});
        if(userExist){
            console.log("user already exist");
        }
        const userCreated = await User.create({name,email,password,role});
        res.status(200).json({
            msg : "user created",
            token : await userCreated.generateToken(),
            userId : userCreated._id.toString(),
    });
    }catch(error){
        res.status(500).send("Internal server error");
    }
}
const login = async (req,res)=>{
    try{
        const{email,password,role} = req.body;
        const userExisted = await User.findOne({email});
        if(!userExisted){
            return res.status(401).json({message :"Invalid Credendials"})
        }
        const valid = await bcrypt.compare(password,userExisted.password);
        if(valid)
        {
            res.status(200).json({
            msg : "Login Successful",
            token : await userExisted.generateToken(),
            userId : userExisted._id.toString(),
        });
        }else{
            res.send("Invalid email or password")
        }
    }catch(error){
        res.status(401).send("Internal server error");
    }
}

const projects = async(req,res) =>{
    try{
        const token = req.headers.authorization;
        if(!token){
            res.send("User not logged In");
        }
        const secret_key = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token,secret_key);
        const UserId = decoded.userId
        const {projectname,classroom} = req.body;
        const projectCreated = await Project.create({
            projectname,
            classroom,
            students,
            teamleaders,
            projectcode,
            user : UserId
        });
        res.json({
            data : projectCreated.projectname,
            msg : "project saved",

        });

    }catch(error){
        console.error(error);
    }
}

module.exports = {home,register,login,projects};