const Project = require("../models/projects");

const fetchClassDetails = async (req, res) => {
  try {
    const { projectCode } = req.query;
    console.log("code", projectCode);

    const project = await Project.findOne({ projectCode }).populate("students");
    console.log(project);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    console.log("project", project.students);
    if (!Array.isArray(project.students)) {
      return res.status(500).send("Unexpected data format");
    }

    const userDetails = project.students.map((student) => ({
      name: student.name,
      email: student.email,
    }));

    res.status(200).json({
      users: userDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
};

module.exports = { fetchClassDetails };
