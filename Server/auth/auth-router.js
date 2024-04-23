const express  = require("express")
const router = express.Router();
const authMiddleware = require("../middlewares/AuthMiddleware");

const {home,register,login,userinfo,projects,userProjects,studentprojects,studentsrepo,assigntasks,assignedDetails} = require("../controller/auth-controller");
router.route("/").get(home)
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/userinfo").get(authMiddleware,userinfo)
router.route("/projects").post(projects);
router.route("/userProjects").get(userProjects);
router.route("/studentprojects").post(studentprojects);
router.route("/studentsrepo").get(studentsrepo);
router.route("/assigntasks").post(assigntasks);
router.route("/assignedDetails").get(assignedDetails);

module.exports = router;