const createProject = require("../models/create");
const diary = require("../models/diary");

const diaryentry = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { projectCode } = req.query;
    const { data, date, time, dayOfWeek } = req.body;

    const validCode = await createProject.findOne({ projectCode });
    if (!validCode) {
      return res.status(401).json({ msg: "Invalid Project Code" });
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
    const userId = req.user.userId;
    const validCode = await createProject.findOne({ projectCode });
    if (!validCode) {
      return res.status(401).json({ msg: "Invalid Project Code" });
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

    const validCode = await createProject.findOne({ projectCode });
    if (!validCode) {
      return res.status(401).json({ msg: "Invalid Project Code" });
    }

    const pastData = await diary
      .find({ projectCode: projectCode })
      .populate("user", "email");

    res.status(200).send(pastData);
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

module.exports = { diaryentry, diaryrepo, studentdiaryrepo, submitFeedBack };
