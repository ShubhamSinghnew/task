
import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "OTP verification required."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied."
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Verify OTP again."
    });
  }
};
