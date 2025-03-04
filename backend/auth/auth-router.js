const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware.js");

const {
  register,
  login,
  updatePassword,
  forgotpassword,
  resetpassword,
  userinfo,
  deleteaccount,
  updateRegNumber,
} = require("../controller/user-Controller.js");

const {
  createProjects,
  deleteCreatedProject,
  fetchCreatedProjects,
  joinProjects,
  fetchJoinedProjects,
  fetchClassDetails,
  fetchTeamDetails,
  createNotifications,
  fetchNotifications,
} = require("../controller/projects-Controller.js");

const {
  assigntasks,
  assignedDetails,
  fetchTasks,
  deletetask,
  edittask,
  taskSolutions,
  getTaskResponses,
} = require("../controller/tasks-controller.js");

const {
  diaryentry,
  diaryrepo,
  studentdiaryrepo,
  submitFeedBack,
} = require("../controller/diary-Controller.js");

const {
  upload,
  uploadTaskFiles,
  fetchTaskFiles,
} = require("../middlewares/storage.js");

router.post("/register", register);
router.post("/login", login);
router.post("/updatePassword", AuthMiddleware, updatePassword);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetpassword);
router.get("/userinfo", AuthMiddleware, userinfo);
router.delete("/deleteaccount", AuthMiddleware, deleteaccount);
router.patch("/updateregno", AuthMiddleware, updateRegNumber);

router.post("/createprojects", AuthMiddleware, createProjects);
router.delete("/deleteCreatedProject", AuthMiddleware, deleteCreatedProject);
router.get("/fetchCreatedProjects", AuthMiddleware, fetchCreatedProjects);
router.post("/joinprojects", AuthMiddleware, joinProjects);
router.get("/fetchJoinedProjects", AuthMiddleware, fetchJoinedProjects);
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
router.post("/createNotifications", AuthMiddleware, createNotifications);
router.get("/fetchNotifications", AuthMiddleware, fetchNotifications);

router.post("/files", upload.single("file"), uploadTaskFiles);
router.get("/file/:filename", fetchTaskFiles);

module.exports = router;
