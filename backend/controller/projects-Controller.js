const createProject = require("../models/create");
const joinProject = require("../models/join");
const Notification = require("../models/Notification");

const createProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectName, classroom, section, projectCode } = req.body;
    const projectCreated = await createProject.create({
      projectName,
      classroom,
      section,
      projectCode,
      user: userId,
    });

    console.log("created", projectCreated);
    res.status(200).json({
      data: projectCreated.projectName,
      msg: "project saved",
    });
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized user" });
  }
};

const fetchCreatedProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const projectsData = await createProject.find({ user: userId });
    res.status(200).json(projectsData);
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized user" });
  }
};

const deleteCreatedProject = async (req, res) => {
  try {
    const projectCode = req.query.projectCode;
    const userId = req.user.userId;
    await createProject.findOneAndDelete({ projectCode, user: userId });
    await joinProject.deleteMany({ projectCode });
    return res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

const joinProjects = async (req, res) => {
  try {
    const { projectName, projectCode, joinType, teamName, role } = req.body;
    const userId = req.user.userId;
    const validCode = await createProject.findOne({ projectCode });
    if (!validCode) {
      return res.status(401).json({ msg: "Invalid Project Code" });
    }

    if (role === "Project Lead") {
      if (!teamName) {
        return res
          .status(402)
          .json({ msg: "Team name is required for Project Lead" });
      }
    }

    const alreadyJoined = await joinProject.findOne({ projectCode });
    const alreadyCreated = await createProject.findOne({ projectCode });
    if (alreadyJoined || alreadyCreated) {
      return res.status(400).json({ msg: "already joined" });
    }
    await joinProject.create({
      projectName,
      projectCode,
      joinType,
      role,
      teamName,
      user: userId,
    });

    res.status(200).json({ msg: "Project saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fetchJoinedProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const repo = await joinProject.find({ user: userId });
    res.status(200).json(repo);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fetchClassDetails = async (req, res) => {
  try {
    const { projectCode } = req.query;
    const students = await joinProject.find({ projectCode }).populate({
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

    const students = await joinProject
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

const createNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectCode } = req.query;
    const { message, type } = req.body;
    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "User ID and message are required." });
    }

    const newNotification = new Notification({
      user: userId,
      projectCode: projectCode,
      message,
      type: type || "general",
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({
      message: "Notification created successfully",
      notification: savedNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      message: "Failed to create notification.",
      error: error.message,
    });
  }
};

const fetchNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectCode } = req.query;

    const notifications = await Notification.find({ projectCode })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

module.exports = {
  createProjects,
  deleteCreatedProject,
  fetchCreatedProjects,
  joinProjects,
  fetchJoinedProjects,
  fetchClassDetails,
  fetchTeamDetails,
  createNotifications,
  fetchNotifications,
};
