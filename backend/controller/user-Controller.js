const user = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const PasswordResetToken = require("../models/passwordReset");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(401).json({ msg: "Email already exists" });
    }
    console.log("userExist", userExist);

    const userCreated = await user.create({ name, email, password });
    console.log("userCreated", userCreated);
    let mailOptions = {
      from: process.env.user,
      to: email,
      subject: "Welcome to ClassSync",
      html: `
                <p>Dear ${name},</p>
                <p>We are thrilled to welcome you to ClassSync! Your account registration has been successfully completed, and you are now part of our dynamic platform designed to streamline classroom management and enhance collaboration between teachers and students.</p>
                
                <p>As a member of ClassSync, you now have access to a comprehensive set of features tailored to meet your educational needs:</p>
                <ul>
                    <li><strong>Classroom Project Management:</strong> Efficiently organize and oversee classroom projects.</li>
                    <li><strong>Collaboration Platform:</strong> Foster seamless collaboration among students and teachers.</li>
                    <li><strong>Coordination Between Teachers and Students:</strong> Facilitate effective communication and interaction.</li>
                    <li><strong>Assignment Distribution:</strong> Easily distribute assignments and tasks to students.</li>
                    <li><strong>Feedback Provision:</strong> Provide timely feedback to students on their work.</li>
                    <li><strong>Progress Tracking:</strong> Monitor and track student progress over time.</li>
                    <li><strong>Task Management:</strong> Manage tasks and assignments effortlessly.</li>
                    <li><strong>Student Teamwork Facilitation:</strong> Promote teamwork and collaboration among students.</li>
                </ul>
                
                <p>Explore our platform and discover how ClassSync can transform your classroom experience.</p>
                
                <p>If you have any questions or need assistance, please do not hesitate to contact our dedicated support team .</p>
                
                <p>We are excited to have you join us at ClassSync and look forward to supporting your educational journey.</p>
                
                <p>Best regards,</p>
                <p>S. Praveen Kumar,</p>
                <p>(founder of ClassSync ) </p>
                <p>ClassSync.</p>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });

    const token = await userCreated.generateToken();
    res.status(200).json({
      msg: "user created",
      token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExisted = await user.findOne({ email });
    if (!userExisted) {
      return res.status(401).json({ message: "Invalid Credendials" });
    }
    const userName = userExisted.name;
    const valid = await bcrypt.compare(password, userExisted.password);
    const token = await userExisted.generateToken();
    if (valid) {
      res.status(200).json({
        msg: "Login Successful",
        token,
        userName,
        userId: userExisted._id.toString(),
      });
    } else {
      res.status(401).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDetails = await user.findById(userId);

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Password" });
    }
    userDetails.password = newPassword;

    await userDetails.save();
    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await PasswordResetToken.create({
      email,
      token,
      expiresAt,
      used: false,
    });
    const resetLink = `https://classync.vercel.app/resetpassword?token=${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `
           <p>Dear ${User.name},</p>
           <p>As you have requested for reset password instructions, here they are, please follow the URL:</p>
          <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 10 minutes.</p>
          `,
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.log(error);
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    const passwordResetToken = await PasswordResetToken.findOne({ token });

    if (!passwordResetToken || passwordResetToken.used) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    if (passwordResetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "link has expired" });
    }
    const User = await user.findOne({ email: passwordResetToken.email });
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }
    User.password = newPassword;

    await User.save();

    passwordResetToken.used = true;

    await passwordResetToken.save();

    res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    console.log(error);
  }
};

const userinfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDetails = await user.findById(userId).select({ password: 0 });

    if (!userDetails) {
      return res.status(404).json({ msg: "user details not found" });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteaccount = async (req, res) => {
  try {
    const { role } = req.query;

    const userId = req.user.userId;

    if (role === "Teacher") {
      await Project.deleteMany({ userId });
      await tasks.deleteMany({ userId });
    } else if (role === "Student") {
      await student.deleteMany({ userId });
      await diary.deleteMany({ userId });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const deletedUser = await user.deleteOne({ _id: userId });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateRegNumber = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    const userId = req.user.userId;
    const User = await user.findById(userId);

    if (!User) {
      return res.status(404).json({ msg: "User not found" });
    }

    User.registrationNumber = registrationNumber;
    await User.save();

    res.status(200).json({ msg: "Registration number updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  forgotpassword,
  resetpassword,
  userinfo,
  deleteaccount,
  updateRegNumber,
};
