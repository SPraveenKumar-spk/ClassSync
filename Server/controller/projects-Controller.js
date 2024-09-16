const Project = require("../models/projects");
const student = require("../models/studentProjects");
const studentProjects = require("../models/studentProjects");

const home = (req, res) => {
  try {
    res.status(200).send("from ClassSync");
  } catch (error) {
    console.error(error);
  }
};

const createProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectName, classroom, students, projectCode } = req.body;
    const projectCreated = await Project.create({
      projectName,
      classroom,
      students,
      projectCode,
      user: userId,
    });
    res.status(200).json({
      data: projectCreated.projectName,
      msg: "project saved",
    });
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized user" });
  }
};

const userProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const projectsData = await Project.find({ user: userId });
    res.status(200).json(projectsData);
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized user" });
  }
};

const deleteproject = async (req, res) => {
  try {
    const projectCode = req.query.projectCode;
    const role = req.query.role;
    const userId = req.user.userId;

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

const studentprojects = async (req, res) => {
  try {
    const { projectName, projectCode, role, teamName } = req.body;
    const userId = req.user.userId;

    const validCode = await Project.findOne({ projectCode });
    if (!validCode) {
      return res.status(401).json({ msg: "Invalid Project Code" });
    }

    if (role === "Project Lead") {
      if (!teamName) {
        return res
          .status(402)
          .json({ msg: "Team name is required for Project Lead" });
      }

      const findTeam = await student.findOne({ teamName });
      if (findTeam) {
        return res.status(400).json({ msg: "Team name is already in use" });
      }
    }

    await student.create({
      projectName,
      projectCode,
      user: userId,
      role,
      teamName,
    });

    res.status(200).json({ msg: "Project saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const studentsrepo = async (req, res) => {
  try {
    const userId = req.user.userId;

    const repo = await student.find({ user: userId });
    res.status(200).json(repo);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fetchClassDetails = async (req, res) => {
  try {
    const { projectCode } = req.query;

    const students = await studentProjects.find({ projectCode }).populate({
      path: "user",
      select: "-password",
    });

    if (students.length === 0) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const response = students.map((student) => ({
      name: student.user.name,
      email: student.user.email,
      registrationNumber: student.user.registrationNumber,
      role: student.role,
      teamName: student.teamName || "N/A",
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

const fetchTeamDetails = async (req, res) => {
  try {
    const { projectCode, teamName } = req.query;
    if (!projectCode || !teamName) {
      return res
        .status(400)
        .json({ msg: "Project code and team name are required" });
    }

    const students = await studentProjects
      .find({
        projectCode,
        teamName,
      })
      .populate({
        path: "user",
        select: "-password",
      });

    if (students.length === 0) {
      return res.status(404).json({
        msg: "No students found for the given project code and team name",
      });
    }

    const response = students.map((student) => ({
      name: student.user.name,
      email: student.user.email,
      registrationNumber: student.user.registrationNumber,
      role: student.role,
      teamName: student.teamName || "N/A",
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  home,
  createProjects,
  deleteproject,
  userProjects,
  studentprojects,
  studentsrepo,
  fetchClassDetails,
  fetchTeamDetails,
};
