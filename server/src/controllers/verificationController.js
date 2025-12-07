import Token from "../models/emailToken.js";
import User from "../models/User.js";
import crypto from "crypto";
import transporter from "../util/mail.js";
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

export const verifyEmail = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const emailToken = await Token.findOne({ userId, token });
    if (!emailToken) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Token.deleteOne({ userId, token });
    res.redirect(`${FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
    const verificationLink = `${BACKEND_URL}/api/verify/verify-email/${user._id}/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email – Dropit",

      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <div style="text-align: center;">
        <h2> Dropit </h2>
      </div>

      <h2>Email Verification</h2>

      <p>Hello ${user.name || ""},</p>

      <p>We received a request to verify your email address. Please click the button below to complete your verification:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}"
           style="background-color: #007bff; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Verify Email
        </a>
      </div>

      <p>If the button above doesn’t work, you can also verify by clicking this link:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>

      <p>Thank you for choosing <strong>Dropit</strong>!</p>

      <br>
      <p style="font-size: 12px; color: #888;">
        This is an automated message. If you didn’t request this, you can safely ignore it.
      </p>
    </div>
  `,
    });

    res.json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
