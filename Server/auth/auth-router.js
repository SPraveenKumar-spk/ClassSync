const express  = require("express")
const router = express.Router();
const authMiddleware = require("../middlewares/AuthMiddleware");

const {home,register,updatePassword,login,userinfo,projects,deleteproject,userProjects,studentprojects,studentsrepo,assigntasks,assignedDetails,deletetask,edittask,diaryentry,diaryrepo,studentdiaryrepo,submitFeedBack} = require("../controller/auth-controller");
router.route("/").get(home)
router.route("/register").post(register)
router.route("/updatePassword").post(updatePassword);
router.route("/login").post(login);
router.route("/userinfo").get(userinfo)
router.route("/projects").post(projects);
router.route("/deleteproject").delete(deleteproject);
router.route("/userProjects").get(userProjects);
router.route("/studentprojects").post(studentprojects);
router.route("/studentsrepo").get(studentsrepo);
router.route("/assigntasks").post(assigntasks);
router.route("/deletetask").delete(deletetask);
router.route("/edittask").put(edittask);
router.route("/assignedDetails").get(assignedDetails);
router.route("/diaryentry").post(diaryentry);
router.route("/diaryrepo").get(diaryrepo);
router.route("/studentdiaryrepo").get(studentdiaryrepo);
router.route("/submitFeedBack").post(submitFeedBack);

module.exports = router;