const express = require('express');
const router = express.Router();
const upload = require('../middlewares/storage');

const {
  home,
  register,
  login,
  updatePassword,
  forgotpassword,
  resetpassword,
  userinfo,
  projects,
  deleteproject,
  userProjects,
  studentprojects,
  studentsrepo,
  assigntasks,
  assignedDetails,
  deletetask,
  edittask,
} = require("../controller/auth-controller");

const {
  diaryentry,
  diaryrepo,
  studentdiaryrepo,
  submitFeedBack,
  fetchClassDetails,
  fetchTeamDetails,
} = require("../controller/auth2-controller");

router.get("/", home);
router.post("/register", register);
router.post("/login", login);
router.post("/updatePassword", updatePassword);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetpassword);
router.get("/userinfo", userinfo);
router.post("/projects", projects);
router.delete("/deleteproject", deleteproject);
router.get("/userProjects", userProjects);
router.post("/studentprojects", studentprojects);
router.get("/studentsrepo", studentsrepo);
router.post("/assigntasks", upload.single("file"), assigntasks);
router.delete("/deletetask", deletetask);
router.put("/edittask", edittask);
router.get("/assignedDetails", assignedDetails);
router.post("/diaryentry", diaryentry);
router.get("/diaryrepo", diaryrepo);
router.get("/studentdiaryrepo", studentdiaryrepo);
router.post("/submitFeedBack", submitFeedBack);

router.get("/classdetails", fetchClassDetails);
router.get("/teamDetails", fetchTeamDetails);

module.exports = router;
