const express  = require("express")

const router = express.Router();

const {home,register,login,projects} = require("../controller/auth-controller");
router.route("/").get(home)
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/projects").post(projects);

module.exports = router;