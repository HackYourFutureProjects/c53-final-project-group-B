import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createUser, ServiceError } from "../services/userService.js";
import { sendVerificationEmail } from "../services/emailService.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

const refreshTokenStore = new Map(); // userId -> refreshToken

// Helpers
function createToken(user) {
  // short expiry
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
}
function createRefreshToken(user) {
  // long expiry
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET_REFRESH, {
    expiresIn: "7d",
  });
}

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body);
    await sendVerificationEmail(user);

    res.status(201).json({
      message: "User registered successfully please check your inbox ",
    });
  } catch (error) {
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
    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    refreshTokenStore.set(user._id.toString(), refreshToken);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
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
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
    } catch (e) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const storedToken = refreshTokenStore.get(payload.userId);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const user = await User.findById(payload.userId);
    const newToken = createToken(user);
    const newRefreshToken = createRefreshToken(user);
    refreshTokenStore.set(user._id.toString(), newRefreshToken);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    };
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.status(200).json({
      token: newToken,
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
export const logout = (req, res) => {
  try {
    const userId = req.user._id;
    refreshTokenStore.delete(userId.toString());
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
