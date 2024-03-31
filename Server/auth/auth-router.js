const express  = require("express")

const router = express.Router();

const {home,login,projects} = require("../controller/auth-controller");
router.route("/").get(home)
router.route("/login").post(login);
router.route("/projects").post(projects);

module.exports = router;