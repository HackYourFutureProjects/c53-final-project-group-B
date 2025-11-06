import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createUser, ServiceError } from "../services/userService.js";
import { sendVerificationEmail } from "../services/emailService.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body);
    try {
      await sendVerificationEmail(user);
    } catch (err) {
      console.error("Error sending verification email:", err);
    }

    res.status(201).json({
      message: "User registered successfully please check your inbox ",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error instanceof ServiceError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified", needVerification: true });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
