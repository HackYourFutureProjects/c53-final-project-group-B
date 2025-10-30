import Token from "../models/emailToken.js";
import User from "../models/User.js";
import crypto from "crypto";
import transporter from "../util/mail.js";

export const verifyEmail = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const emailToken = await Token.findOne({ userId, token });
    if (!emailToken) {
      return res.status(404).json({ message: "Invalid or expired token" });
      //return res.redirect(`http://localhost:5173/login?verified=false`);
      // Alternatively, redirect to frontend with query param
    }
    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Token.deleteOne({ userId, token });
    res.status(200).json({ message: "Email verified successfully" });
    //res.redirect(`http://localhost:5173/login?verified=true`);
    // Alternatively, redirect to frontend with query param
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    //res.redirect(`http://localhost:5173/login?verified=error`);
    // Alternatively, redirect to frontend with query param
  }
};
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await Token.deleteMany({ userId: user._id });
    await Token.create({ userId: user._id, token, purpose: "verify-email" });
    const verificationLink = `http://localhost:3000/api/verify/verify-email/${user._id}/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Verification (Resent)",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
    res.json({ message: "Verification email resent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
