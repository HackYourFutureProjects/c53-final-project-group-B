import crypto from "crypto";
import transporter from "../util/mail.js";
import Token from "../models/emailToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await Token.deleteMany({ userId: user._id });
    await Token.create({ userId: user._id, token, purpose: "reset-password" });
    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    if (!userId || !token) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    const resetToken = await Token.findOne({
      userId,
      token,
      purpose: "reset-password",
    });
    if (!resetToken) {
      return res.status(404).json({ message: "Invalid request" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    await Token.deleteMany({ userId });
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
