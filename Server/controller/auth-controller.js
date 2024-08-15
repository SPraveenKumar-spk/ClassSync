const user = require("../models/user")
const Project = require("../models/projects")
const student = require("../models/studentProjects")
const tasks = require("../models/tasks")
const diary = require("../models/diary")
const bcrypt = require("bcryptjs")
const nodemailer = require('nodemailer');
const PasswordResetToken = require('../models/passwordReset');
const crypto = require("crypto")
const home = (req,res)=>{
    try{
        res.status(200).send("from home");  
    }catch(error){
        consolr.log(error);
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'spraveen.961435@gmail.com', 
        pass: 'ljyvtcwmeqouveur' 
    }
});


const register = async(req,res)=>{
    try{
        const{name,email,password,role} = req.body;
        const userExist = await user.findOne({email});
        if(userExist){
            return res.status(401).json({msg:"Email already exists"})
        }
        const userCreated = await user.create({name,email,password,role});

        let mailOptions = {
            from: 'spraveen.961435@gmail.com', 
            to: email, 
            subject: 'Welcome to ClassSync',
            html: `
                <p>Dear ${name},</p>
                <p>We are thrilled to welcome you to ClassSync! Your account registration has been successfully completed, and you are now part of our dynamic platform designed to streamline classroom management and enhance collaboration between teachers and students.</p>
                
                <p>As a member of ClassSync, you now have access to a comprehensive set of features tailored to meet your educational needs:</p>
                <ul>
                    <li><strong>Classroom Project Management:</strong> Efficiently organize and oversee classroom projects.</li>
                    <li><strong>Collaboration Platform:</strong> Foster seamless collaboration among students and teachers.</li>
                    <li><strong>Coordination Between Teachers and Students:</strong> Facilitate effective communication and interaction.</li>
                    <li><strong>Assignment Distribution:</strong> Easily distribute assignments and tasks to students.</li>
                    <li><strong>Feedback Provision:</strong> Provide timely feedback to students on their work.</li>
                    <li><strong>Progress Tracking:</strong> Monitor and track student progress over time.</li>
                    <li><strong>Task Management:</strong> Manage tasks and assignments effortlessly.</li>
                    <li><strong>Student Teamwork Facilitation:</strong> Promote teamwork and collaboration among students.</li>
                </ul>
                
                <p>Explore our platform and discover how ClassSync can transform your classroom experience.</p>
                
                <p>If you have any questions or need assistance, please do not hesitate to contact our dedicated support team .</p>
                
                <p>We are excited to have you join us at ClassSync and look forward to supporting your educational journey.</p>
                
                <p>Best regards,</p>
                <p>S. Praveen Kumar,</p>
                <p>(founder of ClassSync ) </p>
                <p>ClassSync.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
           
        });

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
        const userExisted = await user.findOne({email});
        if(!userExisted){
            return res.status(401).json({message :"Invalid Credendials"})
        }
        if (role && userExisted.role !== role) {
            return res.status(404).json({ message: "Invalid user" });
        }
        const valid = await bcrypt.compare(password,userExisted.password);
        const token = await userExisted.generateToken();
        if(valid)
        {
            req.session.userId = userExisted._id.toString();
            res.status(200).json({
            msg : "Login Successful",
            token ,
            userId : userExisted._id.toString(),
        });
        }else{
            res.status(401).json({msg:"Invalid email or password"});
        }
    }catch(error){
        res.status(401).send("Internal server error");
    }
}

const updatePassword = async(req,res)=>{
    try{
        const user = req.session.userId;
        const userDetails = await user.findById(user);

        const {oldPassword,newPassword} = req.body;

        const  isMatch =await bcrypt.compare(oldPassword,userDetails.password);
        if(!isMatch){
           return res.status(401).json({msg:"Invalid Password"});
        }
        userDetails.password = newPassword;

        await userDetails.save();
       return res.status(200).json({ msg: 'Password updated successfully' });
    }catch(error){
       return  res.status(500).json({msg:"Internal server error"});
    }
}

const forgotpassword = async(req,res)=>{
    try{
        const { email } = req.body;
        const user = await user.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'user not found' });
        }
      
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 10 * 60 * 1000; 

        await PasswordResetToken.create({
          email,
          token,
          expiresAt,
          used: false
        });
        const resetLink = `http://localhost:5173/resetpassword?token=${token}`;

        await transporter.sendMail({
          to: email,
          subject: 'Password Reset Request',
          html: `
           <p>Dear ${user.name},</p>
           <p>As you have requested for reset password instructions, here they are, please follow the URL:</p>
          <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 10 minutes.</p>
          `,
        });
      
        res.status(200).json({ message: 'Reset link sent to your email' });
    }catch(error){
        console.log(error);
    }
}

const resetpassword = async(req,res) =>{
    try{
        const { token } = req.query;
        const { newPassword } = req.body;
        const passwordResetToken = await PasswordResetToken.findOne({ token });

        if (!passwordResetToken || passwordResetToken.used) {
          return res.status(400).json({ message: 'Invalid or expired link' });
        }
    
        if (passwordResetToken.expiresAt < Date.now()) {
          return res.status(400).json({ message: 'link has expired' });
        }
      
        const user = await user.findOne({ email: passwordResetToken.email });
        if (!user) {
          return res.status(404).json({ message: 'user not found' });
        }
        user.password = newPassword; 

        await user.save();
       
        passwordResetToken.used = true;

        await passwordResetToken.save();

      
        res.status(200).json({ message: 'Password reset successfull' });
      
    }catch(error){
        console.log(error);
    }
}

const userinfo = async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ msg: "user not logged in" });
      }
      const userId = req.session.userId;
      const userDetails = await user.findById(userId).select({ password: 0 });
      if (!userDetails) {
        return res.status(404).json({ msg: "user details not found" });
      }
      res.status(200).json(userDetails);
    } catch (error) {
     return res.status(500).json({ msg: "Internal server error" });
    }
  };
  

const projects = async(req,res) =>{
    try{
        if (!req.session.userId) {
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
          }
      
          const userId = req.session.userId;
       const repo = await student.find({user:userId});
       res.status(200).json(repo)
       

    }catch(error){
        res.status(500).json({msg:"Internal server error"});
    }
}

const assigntasks = async (req, res) => {
    try {

      const { taskName, theme, description, deadline, taskId } = req.body;
      const { projectCode } = req.query;

      if (!req.session.userId) {
        return res.status(401).json({ msg: "user not logged in" });
      }
  
      const userId = req.session.userId;

      const fileId = req.file ? req.file.filename : null;

    await tasks.create({
      taskId,
      taskName,
      theme,
      description,
      deadline,
      file: fileId,
      user: userId,
      projectCode,
    });

  
      res.status(200).json({ msg: "Successfully created the task" });
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  };

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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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
            return res.status(401).json({ msg: "user not logged in" });
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

module.exports = {home,register,login,updatePassword,forgotpassword,resetpassword,userinfo,projects,deleteproject,userProjects,studentprojects,studentsrepo,assigntasks,assignedDetails,deletetask,edittask,diaryentry,diaryrepo,studentdiaryrepo,submitFeedBack};