const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "Token not found" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    req.user = isVerified;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Unauthorized access" });
  }
};

module.exports = AuthMiddleware;
