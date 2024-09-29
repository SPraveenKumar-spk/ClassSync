const express = require('express');
const router = express.Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");


const {
  register,
  login,
  updatePassword,
  forgotpassword,
  resetpassword,
  userinfo,
  deleteaccount,
  updateRegNumber,
} = require("../controller/user-Controller");

const {
  home,
  createProjects,
  deleteproject,
  userProjects,
  studentprojects,
  studentsrepo,
  fetchClassDetails,
  fetchTeamDetails,
} = require("../controller/projects-Controller");

const {
  assigntasks,
  assignedDetails,
  fetchTasks,
  deletetask,
  edittask,
  taskSolutions,
  getTaskResponses,
} = require("../controller/tasks-controller");

const {
  diaryentry,
  diaryrepo,
  studentdiaryrepo,
  submitFeedBack,
} = require("../controller/diary-Controller");

const {
  upload,
  uploadTaskFiles,
  fetchTaskFiles,
} = require("../middlewares/storage.js");

router.get("/", home);
router.post("/register", register);
router.post("/login", login);
router.post("/updatePassword", AuthMiddleware, updatePassword);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetpassword);
router.get("/userinfo", AuthMiddleware, userinfo);
router.delete("/deleteaccount", AuthMiddleware, deleteaccount);
router.patch("/updateregno", AuthMiddleware, updateRegNumber);
router.post("/projects", AuthMiddleware, createProjects);
router.delete("/deleteproject", AuthMiddleware, deleteproject);
router.get("/userProjects", AuthMiddleware, userProjects);
router.post("/studentprojects", AuthMiddleware, studentprojects);
router.get("/studentsrepo", AuthMiddleware, studentsrepo);
router.post("/assigntasks", AuthMiddleware, assigntasks);
router.delete("/deletetask", deletetask);
router.put("/edittask", AuthMiddleware, edittask);
router.post("/taskResponse", AuthMiddleware, taskSolutions);
router.get("/getTaskResponses", AuthMiddleware, getTaskResponses);
router.get("/assignedDetails", assignedDetails);
router.get("/fetchtasks", fetchTasks);
router.post("/diaryentry", AuthMiddleware, diaryentry);
router.get("/diaryrepo", AuthMiddleware, diaryrepo);
router.get("/studentdiaryrepo", studentdiaryrepo);
router.post("/submitFeedBack", submitFeedBack);
router.get("/classdetails", fetchClassDetails);
router.get("/teamDetails", fetchTeamDetails);

router.post("/files", upload.single("file"), uploadTaskFiles);
router.get("/file/:filename", fetchTaskFiles);



module.exports = router;
