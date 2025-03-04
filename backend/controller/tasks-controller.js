const tasks = require("../models/tasks");
const taskResponse = require("../models/TaskResponses");
const createProject = require("../models/create");

const assigntasks = async (req, res) => {
  try {
    const {
      taskId,
      taskName,
      theme,
      description,
      deadline,
      filename,
      fileOriginal,
    } = req.body;
    const userId = req.user.userId;
    const projectCode = req.query.projectCode;

    const newTask = new tasks({
      taskId,
      taskName,
      theme,
      description,
      deadline,
      filename,
      fileOriginal,
      user: userId,
      projectCode,
    });

    await newTask.save();
    res
      .status(200)
      .json({ message: "Task created successfully", task: newTask });
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
    const { projectCode } = req.query;
    const tasksRepo = await tasks
      .find({ projectCode })
      .populate("taskName theme description deadline filename fileOriginal");
    res.status(200).json(tasksRepo);
  } catch (error) {
    console.error("Error fetching assigned details:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const taskSolutions = async (req, res) => {
  try {
    const { taskId, solution } = req.body;
    const projectCode = req.query.projectCode;
    const validCode = await createProject.findOne({ projectCode });
    if (!validCode) {
      return res.status(404).json({ msg: "requested project is not found" });
    }
    const userId = req.user.userId;
    const validTaskId = await tasks.findOne({ taskId });
    if (!validTaskId) {
      return res.status(404).json({ msg: "requested task is not found" });
    }

    await taskResponse.create({
      taskId,
      projectCode,
      solution,
      user: userId,
    });

    res.status(200).json({
      msg: "Response saved successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

const getTaskResponses = async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(400).json({ msg: "Project code is required" });
    }
    const validCode = await taskResponse.findOne({ taskId });
    if (!validCode) {
      return res.status(404).json({ msg: "Requested project not found" });
    }

    const data = await taskResponse
      .find({ taskId })
      .populate("user", "email name");

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const fetchTasks = async (req, res) => {
  try {
    const { taskId } = req.query;
    const tasksRepo = await tasks
      .find({ taskId })
      .populate("taskName theme description deadline filename fileOriginal");
    res.status(200).json(tasksRepo);
  } catch (error) {
    console.error("Error fetching assigned details:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  assigntasks,
  assignedDetails,
  fetchTasks,
  deletetask,
  edittask,
  taskSolutions,
  getTaskResponses,
};
