const User = require("../models/user")
const Project = require("../models/projects")
const student = require("../models/studentProjects")
const tasks = require("../models/tasks")
const diary = require("../models/diary")
const bcrypt = require("bcryptjs")

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
        req.session.userId = userCreated._id.toString();
        res.status(200).json({
            msg : "user created",
          
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
        if (role && userExisted.role !== role) {
            return res.status(404).json({ message: "Invalid user" });
        }
        const valid = await bcrypt.compare(password,userExisted.password);
        if(valid)
        {
            req.session.userId = userExisted._id.toString();
            res.status(200).json({
            msg : "Login Successful",
            userId : userExisted._id.toString(),
        });
        }else{
            res.status(401).json({msg:"Invalid email or password"});
        }
    }catch(error){
        res.status(401).send("Internal server error");
    }
}

const userinfo = async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ msg: "User not logged in" });
      }
      const userId = req.session.userId;
      const userDetails = await User.findById(userId).select({ password: 0 });
      if (!userDetails) {
        return res.status(404).json({ msg: "User details not found" });
      }
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  };
  

const projects = async(req,res) =>{
    try{
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
          const userId = req.session.userId;
        const {projectName,classroom,students,projectCode} = req.body;
        const projectCreated = await Project.create({
            projectName,
            classroom,
            students,
            projectCode,
            user : userId
        });
        res.status(200).json({
            data : projectCreated.projectName,
            msg : "project saved",

        });

    }catch(error){
        res.status(401).json({msg : "Unauthorized user"})
    }
}

const userProjects = async(req,res)=>{
    try{
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
          const userId = req.session.userId;
        const projectsData = await Project.find({user:userId});
        res.status(200).json(projectsData);

    }catch(error){
        res.status(401).json({msg: "Unauthorized user"});
    }
}



const deleteproject = async (req, res) => {
    try {
        const projectCode = req.query.projectCode;
        const role = req.query.role;
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
          const userId = req.session.userId;

        if (role === "Teacher") {
            await Project.findOneAndDelete({ projectCode, user: userId });
            await student.deleteMany({ projectCode });
            return res.status(200).json({ msg: "Project deleted successfully" });
        } else if (role === "Student") {
            await student.findOneAndDelete({ projectCode, user: userId });
            return res.status(200).json({ msg: "Project deleted successfully" });
        } else {
            return res.status(400).json({ msg: "Invalid role" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Server Error" });
    }
};

  
const studentprojects = async(req,res)=>{
    try{
        const{projectName,projectCode} = req.body;
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
        const userId = req.session.userId;
        const validCode = await Project.find({projectCode : projectCode})
        if(validCode.length===0){
            return res.status(401).json({msg:"Invalid ProjectCode"})
        }
        
        const StudentProject = await student.create({
            projectName,
            projectCode,
            user:userId,
        });
        res.status(200).json({
            msg: "Project saved successfully",
            data : StudentProject.projectName,
            
        })
    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}
const studentsrepo = async(req,res)=>{
    try{
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
          const userId = req.session.userId;
       const repo = await student.find({user:userId});
       res.status(200).json(repo)
       

    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const assigntasks = async(req,res)=>{
    try{
        const{taskName,theme,description,deadline,files,taskId} = req.body;
        const { projectCode } = req.query;    
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
          const userId = req.session.userId;
        const createTask = await tasks.create({
            taskId,
            taskName,
            theme,
            description,
            deadline,
            files: { data: files },
            user:userId,
            projectCode,
        });

        res.status(200).json({
            msg : "Successfully created the task"
        });

    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const deletetask = async (req, res) => {
    try {
        const { taskId } = req.body;
        const deletedTask = await tasks.findOneAndDelete({ taskId });
        if (!deletedTask) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(200).json({ msg: "Task deleted successfully" });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
};

const edittask = async(req,res)=>{
    try{
        const {taskId} = req.query;
        const {taskName, theme, description} = req.body;
        const exist = await tasks.findOne({taskId});
        if(!exist){
            return res.status(404).json({msg:"Task not found"});
        }
        exist.taskName = taskName;
        exist.theme = theme;
        exist.description = description;
        const updatedTask = await exist.save();
        if (updatedTask) {
            return res.status(200).json({ msg: "Task updated successfully" });
        } else {
            return res.status(500).json({ msg: "Failed to update task" });
        }

    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const assignedDetails = async(req,res)=>{
    try{
        const { projectCode } = req.query;
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
    
       const tasksrepo = await tasks.find({projectCode });
       res.status(200).json(tasksrepo)
       
    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const diaryentry = async(req,res)=>{
    try{
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
        const userId = req.session.userId;
        const {projectCode} = req.query;
        const{data, date,time,dayOfWeek,} = req.body;
        const validCode = await Project.find({projectCode : projectCode})
        if(validCode.length===0){
            return res.status(401).json({msg:"Invalid ProjectCode"})
        }
        const uploadDiary = await diary.create({
            data,
            projectCode,
            date,
            time,
            dayOfWeek,
            user:userId,
        })

        res.status(200).json({msg: "Entry is successful"});
        
    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const diaryrepo = async(req,res)=>{
    try{
        const {projectCode} = req.query;
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
        const userId = req.session.userId;
        const validCode = await Project.find({projectCode})
        if(validCode.length===0){   
            return res.status(401).json({msg:"Invalid ProjectCode"})
        }

        const pastData = await diary.find({user:userId,projectCode:projectCode});
        res.status(200).json(pastData);
    }catch(error){  
        res.status(500).json({msg:"Internal server error"});
    }
}

const studentdiaryrepo = async(req,res)=>{
    try{
        const {projectCode} = req.query;
        if (!req.session.userId) {
            return res.status(401).json({ msg: "User not logged in" });
          }
      
        //   const userId = req.session.userId;
        const validCode = await Project.find({projectCode})
        if(validCode.length===0){   
            return res.status(401).json({msg:"Invalid ProjectCode"})
        }

        const pastData = await diary.find({projectCode:projectCode}).populate('user','email');
        res.status(200).json(pastData);
    }catch(error){  
        res.status(500).json({msg:"Internal server error"});
    }
}

const submitFeedBack = async(req,res)=>{
    try {
        const { diaryId, comments, marks } = req.body;
        await diary.findByIdAndUpdate(diaryId, { comments, marks });
        res.status(200).json({ msg: "Feedback submitted successfully" });
      } catch (error) {
        res.status(500).json({ msg: "Server error" });
      }
}

module.exports = {home,register,login,userinfo,projects,deleteproject,userProjects,studentprojects,studentsrepo,assigntasks,assignedDetails,deletetask,edittask,diaryentry,diaryrepo,studentdiaryrepo,submitFeedBack};