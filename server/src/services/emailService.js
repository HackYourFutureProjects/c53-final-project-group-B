import crypto from "crypto";
import transporter from "../util/mail.js";
import Token from "../models/emailToken.js";
export const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  await Token.create({ userId: user._id, token, purpose: "verify-email" });
  const verificationLink = `http://localhost:3000/api/verify/verify-email/${user._id}/${token}`;
  await transporter.sendMail({
    from: "infinity@example.com",
    to: user.email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });
};
