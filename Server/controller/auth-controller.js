const User = require("../models/user")
const Project = require("../models/projects")
const home = (req,res)=>{
    try{
        res.status(200).send("from home");
    }catch(error){
        consolr.log(error);
    }
}
const login = async (req,res)=>{
    try{
        const data = req.body;
        const {name,email} = data;
        const userCreated = await User.create({
            name,
            email,
            role
        }) ;
        res.status(200).json({
            data : userCreated,
            msg : "Registration Successfully",
            token : await userCreated.generateToken(),
            userId : userCreated._id.toString(), 
        });
    }catch(error){
        console.log(error);
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

module.exports = {home,login,projects};