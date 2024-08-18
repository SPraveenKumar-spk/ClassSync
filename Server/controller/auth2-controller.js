const Project = require("../models/projects");
const studentProjects = require("../models/studentProjects");

const diaryentry = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "user not logged in" });
    }

    const userId = req.session.userId;
    const { projectCode } = req.query;
    const { data, date, time, dayOfWeek } = req.body;
    const validCode = await Project.find({ projectCode: projectCode });
    if (validCode.length === 0) {
      return res.status(401).json({ msg: "Invalid ProjectCode" });
    }
    await diary.create({
      data,
      projectCode,
      date,
      time,
      dayOfWeek,
      user: userId,
    });

    res.status(200).json({ msg: "Entry is successful" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const diaryrepo = async (req, res) => {
  try {
    const { projectCode } = req.query;
    if (!req.session.userId) {
      return res.status(401).json({ msg: "user not logged in" });
    }

    const userId = req.session.userId;
    const validCode = await Project.find({ projectCode });
    if (validCode.length === 0) {
      return res.status(401).json({ msg: "Invalid ProjectCode" });
    }

    const pastData = await diary.find({
      user: userId,
      projectCode: projectCode,
    });
    res.status(200).json(pastData);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const studentdiaryrepo = async (req, res) => {
  try {
    const { projectCode } = req.query;
    if (!req.session.userId) {
      return res.status(401).json({ msg: "user not logged in" });
    }

    //   const userId = req.session.userId;
    const validCode = await Project.find({ projectCode });
    if (validCode.length === 0) {
      return res.status(401).json({ msg: "Invalid ProjectCode" });
    }

    const pastData = await diary
      .find({ projectCode: projectCode })
      .populate("user", "email");
    res.status(200).json(pastData);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const submitFeedBack = async (req, res) => {
  try {
    const { diaryId, comments, marks } = req.body;
    await diary.findByIdAndUpdate(diaryId, { comments, marks });
    res.status(200).json({ msg: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
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

    // Ensure both projectCode and teamName are provided
    if (!projectCode || !teamName) {
      return res
        .status(400)
        .json({ msg: "Project code and team name are required" });
    }

    // Find students matching the provided projectCode and teamName
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

    // Format the response
    const response = students.map((student) => ({
      name: student.user.name,
      email: student.user.email,
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
  diaryentry,
  diaryrepo,
  studentdiaryrepo,
  submitFeedBack,
  fetchClassDetails,
  fetchTeamDetails,
};
