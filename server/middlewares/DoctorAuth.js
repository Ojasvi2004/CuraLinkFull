const jwt = require("jsonwebtoken");

const DoctorAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }

  try {
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY not configured");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req._id = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = DoctorAuth;
