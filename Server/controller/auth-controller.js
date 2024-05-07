const User = require("../models/user")
const Project = require("../models/projects")
const student = require("../models/studentProjects")
const tasks = require("../models/tasks");
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
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(401).json({msg:"Email already exists"})
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
            res.status(401).json({msg:"Invalid email or password"});
        }
    }catch(error){
        res.status(401).send("Internal server error");
    }
}

const userinfo = async(req,res) =>{
    try{
        const userdata = req.user;
        res.status(200).json({userdata});
      
    }catch(error){
        res.status(500).json({msg:"user not logined"});
    }
}

const projects = async(req,res) =>{
    try{
        const token = req.header("Authorization");
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
           return res.send("User not logged In");
        }
        const secret_key = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(jwtToken,secret_key);
        const UserId = decoded.userId;
        const Existence = await User.findById(UserId)
        if(!Existence){
           return res.status(401).json({msg : "No user Existed"});
        }
        const {projectName,classroom,students,projectCode} = req.body;
        const projectCreated = await Project.create({
            projectName,
            classroom,
            students,
            projectCode,
            user : UserId
        });
        res.status(200).json({
            data : projectCreated.projectName,
            msg : "project saved",

        });

    }catch(jwtError){
        res.status(401).json({msg : "Unauthorized user"})
    }
}

const userProjects = async(req,res)=>{
    try{

        const token = req.header("Authorization");
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
           return res.send("User not logged In");
        }
        const secret_key = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(jwtToken,secret_key);
        const UserId = decoded.userId;
        const Existence = await User.findById(UserId)
        if(!Existence){
           return res.status(401).json({msg : "No user Existed"});
        }
        const projectsData = await Project.find({user:UserId});
        res.status(200).json(projectsData);

    }catch(error){
        res.status(401).json({msg: "Unauthorized user"});
    }
}

const studentprojects = async(req,res)=>{
    try{
        const{projectName,projectCode} = req.body;
        const token = req.header("Authorization");
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
            return res.status(401).json({msg: "Unuthorized login"});
        }
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        const UserId = isVerified.userId;
        const StudentExist = await User.findById(UserId);
        if(!StudentExist){
            return res.status(401).json({msg : "User not found"});
        }
        validCode = await Project.find({projectCode : projectCode})
        if(validCode.length===0){
            return res.status(401).json({msg:"Invalid ProjectCode"})
        }
        
        const StudentProject = await student.create({
            projectName,
            projectCode,
            user:UserId,
        });
        res.status(200).json({
            msg: "Project saved successfully",
            data : StudentProject.projectName,
            
        })
       

    }catch(error){
    }
}
const studentsrepo = async(req,res)=>{
    try{
        const token = req.header("Authorization");
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
            return res.status(401).json({msg: "Unuthorized login"});
        }
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        const UserId = isVerified.userId;
        const StudentExist = await User.findById(UserId);
        if(!StudentExist){
            return res.status(401).json({msg : "User not found"});
        }
       const repo = await student.find({user:UserId});
       res.status(200).json(repo)
       

    }catch(error){

    }
}

const assigntasks = async(req,res)=>{
    try{
        const{taskName,theme,description,files} = req.body;
        const { projectCode } = req.query;   
        console.log(projectCode);  
        const token = req.header("Authorization");
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
            return res.status(401).json({msg: "Unuthorized login"});
        }
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        const UserId = isVerified.userId;
        const createTask = await tasks.create({
            taskName,
            theme,
            description,
            files: { data: files },
            user:UserId,
            projectCode,
        });

        res.status(200).json({
            msg : "Successfully created the task"
        });

    }catch(error){
    }
}

const assignedDetails = async(req,res)=>{
    try{
        const token = req.header("Authorization");
        const { projectCode } = req.query;
        const jwtToken = token.replace("Bearer","").trim();
        if(!token){
            return res.status(401).json({msg: "Unuthorized login"});
        }
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        const UserId = isVerified.userId;
        const StudentExist = await User.findById(UserId);
        if(!StudentExist){
            return res.status(401).json({msg : "User not found"});
        }
       const tasksrepo = await tasks.find({projectCode });
       res.status(200).json(tasksrepo)
       
    }catch(error){
    }
}





module.exports = {home,register,login,userinfo,projects,userProjects,studentprojects,studentsrepo,assigntasks,assignedDetails};