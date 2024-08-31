const express = require('express');
const router = express.Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/storage").upload;

const {
  register,
  login,
  updatePassword,
  forgotpassword,
  resetpassword,
  userinfo,
  deleteaccount,
  updateRegNumber,
} = require("../controller/UserAuthentication");
const {
  home,
  projects,
  deleteproject,
  userProjects,
  studentprojects,
  studentsrepo,
  assigntasks,
  assignedDetails,
  deletetask,
  edittask,
  fetchFiles,
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
router.post("/updatePassword", AuthMiddleware, updatePassword);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetpassword);
router.get("/userinfo", AuthMiddleware, userinfo);
router.delete("/deleteaccount", AuthMiddleware, deleteaccount);
router.patch("/updateregno", AuthMiddleware, updateRegNumber);
router.post("/projects", AuthMiddleware, projects);
router.delete("/deleteproject", AuthMiddleware, deleteproject);
router.get("/userProjects", AuthMiddleware, userProjects);
router.post("/studentprojects", AuthMiddleware, studentprojects);
router.get("/studentsrepo", AuthMiddleware, studentsrepo);
router.post("/assigntasks", AuthMiddleware, upload.single("file"), assigntasks);
router.delete("/deletetask", deletetask);
router.put("/edittask", AuthMiddleware, edittask);
router.get("/assignedDetails", assignedDetails);
router.post("/diaryentry", AuthMiddleware, diaryentry);
router.get("/diaryrepo", AuthMiddleware, diaryrepo);
router.get("/studentdiaryrepo", studentdiaryrepo);
router.post("/submitFeedBack", submitFeedBack);

router.get("/classdetails", fetchClassDetails);
router.get("/teamDetails", fetchTeamDetails);

router.get("/file/:filename", fetchFiles);

module.exports = router;
