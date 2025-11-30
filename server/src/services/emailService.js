import crypto from "crypto";
import transporter from "../util/mail.js";
import Token from "../models/emailToken.js";

const BACKEND_URL = process.env.BACKEND_URL;

export const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  await Token.create({ userId: user._id, token, purpose: "verify-email" });
  const verificationLink = `${BACKEND_URL}/api/verify/verify-email/${user._id}/${token}`;
  await transporter.sendMail({
    from: "infinity@example.com",
    to: user.email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });
};
