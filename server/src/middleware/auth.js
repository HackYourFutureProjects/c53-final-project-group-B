import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    console.log("Auth middleware - Headers:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "invalid token or expired" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found for userId:", decoded.userId);
      return res.status(401).json({ message: "user not found" });
    }
    console.log("User found:", user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "invalid token or expired" });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
