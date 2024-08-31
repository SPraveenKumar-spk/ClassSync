const Project = require("../models/projects");
const student = require("../models/studentProjects");
const tasks = require("../models/tasks");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const mongoURI = process.env.MongoDBURI;
const conn = mongoose.createConnection(mongoURI);
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const home = (req, res) => {
  try {
    res.status(200).send("from home");
  } catch (error) {
    console.error(error);
  }
};

const projects = async (req, res) => {
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

const assigntasks = async (req, res) => {
  try {
    const { taskName, theme, description, deadline, taskId } = req.body;

    const { projectCode } = req.query;

    const userId = req.user.userId;

    const fileId = req.file ? req.file.filename : null;

    const newTask = new tasks({
      taskId,
      taskName,
      theme,
      description,
      deadline,
      file: fileId,
      user: userId,
      projectCode,
    });

    await newTask.save();

    res.status(200).json({ msg: "Successfully created the task" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deletetask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const deletedTask = await tasks.findOneAndDelete({ taskId });
    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const edittask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const { taskName, theme, description } = req.body;
    const exist = await tasks.findOne({ taskId });
    if (!exist) {
      return res.status(404).json({ msg: "Task not found" });
    }
    exist.taskName = taskName;
    exist.theme = theme;
    exist.description = description;
    const updatedTask = await exist.save();
    if (updatedTask) {
      return res.status(200).json({ msg: "Task updated successfully" });
    } else {
      return res.status(500).json({ msg: "Failed to update task" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const assignedDetails = async (req, res) => {
  try {
    console.log("Fetching task details...");
    const { projectCode } = req.query;
    const tasksrepo = await tasks
      .find({ projectCode })
      .populate("taskName theme description deadline file");

    console.log("Fetched tasks:", tasksrepo);

    const taskDetails = await Promise.all(
      tasksrepo.map(async (task) => {
        if (task.file) {
          const file = await gfs.files.findOne({ filename: task.file });
          if (file) {
            return {
              ...task.toObject(),
              fileMetadata: {
                filename: file.filename,
                contentType: file.contentType,
                length: file.length,
              },
            };
          }
        }
        return task;
      })
    );

    console.log("Task details with file metadata:", taskDetails);
    res.status(200).json(taskDetails);
  } catch (error) {
    console.error("Error fetching assigned details:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fetchFiles = async (req, res) => {
  try {
    console.log("Fetching file with filename:", req.params.filename);

    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (err) {
        console.error("Error finding file:", err);
        return res.status(500).json({ err: "Error finding file" });
      }
      console.log(file);
      if (!file || file.length === 0) {
        console.log("No file exists with that filename");
        return res.status(404).json({ err: "No file exists" });
      }

      // Set content type and content disposition for file download
      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

      // Stream the file to the response
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);

      // Handle any streaming errors
      readstream.on("error", (streamErr) => {
        console.error("Error streaming file:", streamErr);
        res.status(500).json({ err: "Error streaming file" });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
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
};
